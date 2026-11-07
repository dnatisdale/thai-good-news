import { useState, useEffect, useCallback } from "react";
import {
  OFFLINE_AUDIO_CACHE,
  enrichTrackMetadata,
  getPlayableTrackUrl,
  getTrackCacheKeys,
  getCachedAudioBlobUrl,
  fetchAndCacheAudio,
  normalizeAudioUrl,
} from "../utils/audioHelper";

const CACHE_NAME = OFFLINE_AUDIO_CACHE;
const STORAGE_KEY = "offline_library_metadata";
const SYNC_EVENT = "offline-storage-sync";

// Shared module-level set so all hook instances see active downloads
const activeDownloads = new Set();

function loadStoredTracks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((track) => enrichTrackMetadata(track));
  } catch (e) {
    console.error("Failed to parse offline library metadata", e);
    return [];
  }
}

function saveTracksToStorage(tracks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  } catch (e) {
    console.error("Failed to save offline library metadata", e);
  }
}

export const useOfflineStorage = () => {
  const [offlineTracks, setOfflineTracks] = useState(() => loadStoredTracks());
  const [downloadingIds, setDownloadingIds] = useState(() =>
    Array.from(activeDownloads)
  );

  // Keep all hook instances (App, ContentView, AudioPlayer) synchronized
  useEffect(() => {
    const handleSync = () => {
      setOfflineTracks(loadStoredTracks());
      setDownloadingIds(Array.from(activeDownloads));
    };

    window.addEventListener(SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Self-heal any previously saved tracks in My Library whose cache entry was wiped or poisoned
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    const currentTracks = loadStoredTracks();
    if (currentTracks.length === 0) return;

    let isCancelled = false;
    (async () => {
      for (const track of currentTracks) {
        if (isCancelled) break;
        const existingBlobUrl = await getCachedAudioBlobUrl(track);
        if (existingBlobUrl) {
          URL.revokeObjectURL(existingBlobUrl);
          continue;
        }
        // Track metadata exists in My Library, but audio is missing from cache -> re-cache silently
        const playableUrl = getPlayableTrackUrl(track);
        if (playableUrl) {
          try {
            await fetchAndCacheAudio(
              playableUrl,
              CACHE_NAME,
              getTrackCacheKeys(track)
            );
            console.log(
              `useOfflineStorage: Repaired offline cache for track ${track.id}`
            );
          } catch (err) {
            console.warn(
              `useOfflineStorage: Could not repair cache for track ${track.id}:`,
              err
            );
          }
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Check if a track is fully downloaded (checked against metadata)
  const isTrackOffline = useCallback(
    (trackId) => {
      return offlineTracks.some((t) => String(t.id) === String(trackId));
    },
    [offlineTracks]
  );

  const isTrackDownloading = useCallback(
    (trackId) => {
      return downloadingIds.some((id) => String(id) === String(trackId));
    },
    [downloadingIds]
  );

  // Download a track
  const downloadTrack = useCallback(
    async (rawTrack) => {
      if (!rawTrack) return false;
      const track = enrichTrackMetadata(rawTrack);
      const playableUrl = getPlayableTrackUrl(track);
      if (!playableUrl) return false;

      if (isTrackOffline(track.id)) return { success: true };

      activeDownloads.add(track.id);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT));

      try {
        const candidateFetchUrls = [];

        // 1. If playableUrl is a local /audio/*.mp3 file, fetch it directly (fast, same-origin, no CORS)
        if (playableUrl.startsWith("/")) {
          candidateFetchUrls.push(playableUrl);
        } else {
          // 2. If it's an external URL, try direct first, then local sampleUrl fallback
          candidateFetchUrls.push(playableUrl);
          if (track.sampleUrl) {
            candidateFetchUrls.push(normalizeAudioUrl(track.sampleUrl));
          }
        }

        const extraKeys = getTrackCacheKeys(track);
        let cachedSuccessfully = false;
        let lastError = null;

        for (const urlToTry of candidateFetchUrls) {
          if (!urlToTry) continue;
          try {
            console.log(
              `Downloading track ${track.id} from: ${urlToTry}`
            );
            await fetchAndCacheAudio(urlToTry, CACHE_NAME, extraKeys);
            cachedSuccessfully = true;
            break;
          } catch (err) {
            lastError = err;
            console.warn(
              `useOfflineStorage: Attempt failed for ${urlToTry}:`,
              err.message
            );
          }
        }

        if (!cachedSuccessfully) {
          throw lastError || new Error("Failed to download audio file");
        }

        const current = loadStoredTracks();
        if (!current.some((t) => String(t.id) === String(track.id))) {
          const newTrack = {
            ...track,
            trackDownloadUrl: playableUrl,
          };
          saveTracksToStorage([...current, newTrack]);
        }

        return { success: true };
      } catch (error) {
        console.error(`Failed to download track ${track.id}:`, error);
        return { success: false, error: error.message };
      } finally {
        activeDownloads.delete(track.id);
        window.dispatchEvent(new CustomEvent(SYNC_EVENT));
      }
    },
    [isTrackOffline]
  );

  // Delete a track
  const deleteTrack = useCallback(async (trackId) => {
    const current = loadStoredTracks();
    const track = current.find((t) => String(t.id) === String(trackId));
    if (!track) return;

    try {
      const cache = await caches.open(CACHE_NAME);
      const keysToDelete = getTrackCacheKeys(track);
      for (const key of keysToDelete) {
        await cache.delete(key);
      }

      const updated = current.filter((t) => String(t.id) !== String(trackId));
      saveTracksToStorage(updated);
      console.log(`Track ${trackId} removed from offline storage.`);
    } catch (error) {
      console.error(`Failed to delete track ${trackId}:`, error);
    }
  }, []);

  // Clear all tracks
  const clearLibrary = useCallback(async () => {
    if (
      !window.confirm("Are you sure you want to delete all downloaded messages?")
    )
      return;

    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      for (const request of keys) {
        await cache.delete(request);
      }
      saveTracksToStorage([]);
      console.log("Offline library cleared.");
    } catch (error) {
      console.error("Failed to clear library:", error);
    }
  }, []);

  return {
    offlineTracks,
    downloadingIds,
    downloadTrack,
    deleteTrack,
    isTrackOffline,
    isTrackDownloading,
    clearLibrary,
  };
};
