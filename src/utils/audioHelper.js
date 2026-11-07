// src/utils/audioHelper.js
// Centralized helper for offline-capable MP3 caching and playback on mobile browsers (iOS Safari & Android Chrome)

import { staticContent } from "../data/staticContent";

export const OFFLINE_AUDIO_CACHE = "offline-audio-v1";
export const SW_AUDIO_CACHE = "gospel-audio-cache-v1";
export const AUDIO_CACHES = [OFFLINE_AUDIO_CACHE, SW_AUDIO_CACHE];

/**
 * Normalize an audio URL so relative paths stay relative and domain-only strings get https://
 */
export function normalizeAudioUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Fix known filename typo from legacy metadata
  if (trimmed === "/audio/Tai.Lu.06851.mp3") {
    return "/audio/Thai.Lu.06851.mp3";
  }

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

/**
 * Enrich a track object with staticContent fields (such as sampleUrl) if missing
 */
export function enrichTrackMetadata(track) {
  if (!track) return track;

  let sampleUrl = normalizeAudioUrl(track.sampleUrl);
  if (!sampleUrl) {
    const match = staticContent.find(
      (item) =>
        String(item.id) === String(track.id) ||
        (track.programId && String(item.programId) === String(track.programId))
    );
    if (match && match.sampleUrl) {
      sampleUrl = normalizeAudioUrl(match.sampleUrl);
    }
  }

  const normalizedTrackUrl = normalizeAudioUrl(track.trackDownloadUrl);

  return {
    ...track,
    sampleUrl: sampleUrl || track.sampleUrl,
    trackDownloadUrl: normalizedTrackUrl || sampleUrl || track.trackDownloadUrl,
  };
}

/**
 * Determine the best playable/downloadable URL for a track.
 * Built-in staticContent items have placeholder `fivefish.org/T...-001.mp3` in trackDownloadUrl,
 * while their actual bundled MP3 file is in `sampleUrl` (`/audio/*.mp3`).
 */
export function getPlayableTrackUrl(track) {
  if (!track) return null;
  const enriched = enrichTrackMetadata(track);

  const trackUrl = normalizeAudioUrl(enriched.trackDownloadUrl);
  const sampleUrl = normalizeAudioUrl(enriched.sampleUrl);

  // If trackUrl is missing or is the non-direct fivefish.org/T... shortlink, use sampleUrl
  if (!trackUrl || trackUrl.includes("fivefish.org/T")) {
    return sampleUrl || trackUrl;
  }

  // If it's a local /audio/ path, prefer it
  if (trackUrl.startsWith("/audio/")) {
    return trackUrl;
  }

  return trackUrl || sampleUrl;
}

/**
 * Return all candidate cache keys (relative and absolute URLs) for a track or URL
 */
export function getTrackCacheKeys(trackOrUrl) {
  const keys = new Set();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const addUrlVariants = (rawUrl) => {
    const norm = normalizeAudioUrl(rawUrl);
    if (!norm || norm.startsWith("blob:")) return;
    keys.add(norm);

    if (norm.startsWith("/") && origin) {
      keys.add(`${origin}${norm}`);
    } else if (origin && norm.startsWith(origin)) {
      keys.add(norm.slice(origin.length) || "/");
    }
  };

  if (typeof trackOrUrl === "string") {
    addUrlVariants(trackOrUrl);
  } else if (trackOrUrl && typeof trackOrUrl === "object") {
    const enriched = enrichTrackMetadata(trackOrUrl);
    addUrlVariants(enriched.sampleUrl);
    addUrlVariants(enriched.trackDownloadUrl);
    addUrlVariants(getPlayableTrackUrl(enriched));
  }

  return Array.from(keys);
}

/**
 * Verify that an ArrayBuffer actually contains audio data and not an HTML fallback page (index.html)
 */
export function isValidAudioBuffer(buffer, contentType = "") {
  if (!buffer || buffer.byteLength < 128) return false;
  if (contentType && contentType.toLowerCase().includes("text/html")) {
    return false;
  }

  // Check first 64 bytes to ensure it's not an HTML document from SPA fallback rewrites
  const headerBytes = new Uint8Array(buffer.slice(0, 64));
  let headerStr = "";
  for (let i = 0; i < headerBytes.length; i++) {
    headerStr += String.fromCharCode(headerBytes[i]);
  }
  const trimmed = headerStr.trimStart().toLowerCase();
  if (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<head") ||
    trimmed.startsWith("{\"error\"")
  ) {
    return false;
  }

  return true;
}

/**
 * Look up a track or URL across all audio caches and return a `blob:` URL with explicit `audio/mpeg` MIME type.
 * Automatically purges any poisoned HTML cache entries.
 */
export async function getCachedAudioBlobUrl(trackOrUrl) {
  if (typeof caches === "undefined") return null;

  const candidateKeys = getTrackCacheKeys(trackOrUrl);
  if (candidateKeys.length === 0) return null;

  for (const cacheName of AUDIO_CACHES) {
    try {
      const cache = await caches.open(cacheName);
      for (const key of candidateKeys) {
        const cachedResponse = await cache.match(key, { ignoreSearch: true });
        if (cachedResponse) {
          const contentType = cachedResponse.headers.get("content-type") || "";
          const buffer = await cachedResponse.arrayBuffer();

          if (!isValidAudioBuffer(buffer, contentType)) {
            console.warn(
              `[audioHelper] Removing invalid/HTML cached entry for ${key} in ${cacheName}`
            );
            await cache.delete(key);
            continue;
          }

          const mp3Blob = new Blob([buffer], { type: "audio/mpeg" });
          return URL.createObjectURL(mp3Blob);
        }
      }
    } catch (err) {
      console.warn(`[audioHelper] Error reading cache ${cacheName}:`, err);
    }
  }

  return null;
}

/**
 * Check quickly if a URL is already present in any audio cache
 */
export async function isAudioUrlCached(rawUrl) {
  if (typeof caches === "undefined" || !rawUrl) return false;
  const candidateKeys = getTrackCacheKeys(rawUrl);

  for (const cacheName of AUDIO_CACHES) {
    try {
      const cache = await caches.open(cacheName);
      for (const key of candidateKeys) {
        const match = await cache.match(key, { ignoreSearch: true });
        if (match) {
          const ct = match.headers.get("content-type") || "";
          if (!ct.toLowerCase().includes("text/html")) {
            return true;
          }
        }
      }
    } catch (e) {
      // Ignore cache read error
    }
  }
  return false;
}

/**
 * Fetch an audio URL cleanly (full 200 OK without Range header) and store it in the specified cache.
 */
export async function fetchAndCacheAudio(
  url,
  cacheName = OFFLINE_AUDIO_CACHE,
  extraCacheKeys = []
) {
  if (typeof caches === "undefined" || !url) return false;

  const normalizedUrl = normalizeAudioUrl(url);
  if (!normalizedUrl) return false;

  const response = await fetch(normalizedUrl, {
    method: "GET",
    cache: "no-cache",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const buffer = await response.arrayBuffer();

  if (!isValidAudioBuffer(buffer, contentType)) {
    throw new Error("Received non-audio response (HTML fallback)");
  }

  const cache = await caches.open(cacheName);
  const allKeys = new Set([
    ...getTrackCacheKeys(normalizedUrl),
    ...extraCacheKeys.filter(Boolean),
  ]);

  const headers = {
    "Content-Type": "audio/mpeg",
    "Content-Length": String(buffer.byteLength),
    "Accept-Ranges": "bytes",
  };

  for (const key of allKeys) {
    const cleanResponse = new Response(buffer.slice(0), {
      status: 200,
      statusText: "OK",
      headers,
    });
    await cache.put(key, cleanResponse);
  }

  return true;
}

/**
 * Play a sample MP3 URL on an HTMLAudioElement with full mobile offline support:
 * 1. Synchronously unlocks the HTMLAudioElement within the user tap gesture (iOS Safari / Android Chrome).
 * 2. Serves from Cache Storage (`audio/mpeg` Blob URL) first if cached so playback works identically offline & online.
 * 3. If not cached yet, streams directly and caches the full 200 OK MP3 in the background for offline use.
 */
export async function playSampleWithOfflineSupport(
  audioElement,
  rawSampleUrl,
  { onPlaySuccess, onPlayError, onEnded } = {}
) {
  const sampleUrl = normalizeAudioUrl(rawSampleUrl);
  if (!audioElement || !sampleUrl) return;

  try {
    audioElement.pause();
    audioElement.currentTime = 0;
    // Synchronously unlock the audio element during the user tap gesture on iOS Safari / mobile Chrome
    audioElement.load();
  } catch (e) {
    // Ignore pause/load errors
  }

  if (audioElement._blobUrl) {
    URL.revokeObjectURL(audioElement._blobUrl);
    audioElement._blobUrl = null;
  }

  audioElement.onended = () => {
    if (audioElement._blobUrl) {
      URL.revokeObjectURL(audioElement._blobUrl);
      audioElement._blobUrl = null;
    }
    if (onEnded) onEnded();
  };

  // 1. Check Cache Storage first so cached MP3s play from memory with zero network dependency
  try {
    const cachedBlobUrl = await getCachedAudioBlobUrl(sampleUrl);
    if (cachedBlobUrl) {
      audioElement._blobUrl = cachedBlobUrl;
      audioElement.src = cachedBlobUrl;
      await audioElement.play();
      if (onPlaySuccess) onPlaySuccess();
      return;
    }
  } catch (cachePlayError) {
    console.warn("[audioHelper] Cached blob playback attempt failed, trying direct URL:", cachePlayError);
  }

  // 2. Not in cache yet (or blob play failed): play sampleUrl directly and cache in background
  try {
    audioElement.src = sampleUrl;
    await audioElement.play();
    if (onPlaySuccess) onPlaySuccess();

    if (typeof navigator !== "undefined" && navigator.onLine !== false) {
      fetchAndCacheAudio(sampleUrl, SW_AUDIO_CACHE).catch(() => {});
    }
  } catch (primaryError) {
    console.error("[audioHelper] Error playing sample:", primaryError, "URL:", sampleUrl);
    if (onPlayError) onPlayError(primaryError);
  }
}

let isPrecachingRunning = false;

/**
 * Background pre-cacher for all speaker-icon sample MP3s (`/audio/*.mp3`).
 * Prioritizes the primary sample for each language first (Home page speaker icons),
 * followed by all remaining message sample MP3s, using a polite 3-at-a-time queue.
 */
export async function precacheAllAudioSamples() {
  if (isPrecachingRunning) return;
  if (typeof window === "undefined" || typeof caches === "undefined") return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;

  isPrecachingRunning = true;

  try {
    const priorityLanguageUrls = [];
    const seenLanguages = new Set();
    const allSampleUrls = [];
    const seenUrls = new Set();

    for (const item of staticContent) {
      const url = normalizeAudioUrl(item.sampleUrl);
      if (!url) continue;

      if (item.stableKey && !seenLanguages.has(item.stableKey)) {
        seenLanguages.add(item.stableKey);
        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          priorityLanguageUrls.push(url);
        }
      }
    }

    for (const item of staticContent) {
      const url = normalizeAudioUrl(item.sampleUrl);
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        allSampleUrls.push(url);
      }
    }

    const orderedQueue = [...priorityLanguageUrls, ...allSampleUrls];
    const CONCURRENCY = 3;
    let index = 0;

    const worker = async () => {
      while (index < orderedQueue.length) {
        if (typeof navigator !== "undefined" && navigator.onLine === false) {
          break;
        }
        const currentUrl = orderedQueue[index++];
        try {
          const alreadyCached = await isAudioUrlCached(currentUrl);
          if (!alreadyCached) {
            await fetchAndCacheAudio(currentUrl, SW_AUDIO_CACHE);
          }
        } catch (e) {
          // Ignore individual file errors so the queue continues
        }
      }
    };

    await Promise.all(
      Array.from({ length: CONCURRENCY }, () => worker())
    );
  } finally {
    isPrecachingRunning = false;
  }
}
