import React, { useEffect, useRef } from "react";
import {
  PlayCircle,
  Pause,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
  Loader,
  X,
} from "./Icons";
import { useOfflineStorage } from "../hooks/useOfflineStorage";
import {
  enrichTrackMetadata,
  getPlayableTrackUrl,
  getCachedAudioBlobUrl,
  normalizeAudioUrl,
  playSampleWithOfflineSupport,
} from "../utils/audioHelper";

const AudioPlayer = ({
  track,
  audioRef: externalAudioRef,
  isPlaying,
  setIsPlaying,
  isMinimized,
  toggleMinimize,
  t,
  lang = "th",
  onGoBack,
  onGoForward,
  hasPrev,
  hasNext,
  onClose,
}) => {
  const internalAudioRef = useRef(null);
  const audioRef = externalAudioRef || internalAudioRef;
  const lastPlayedTrackIdRef = useRef(null);

  const playableUrl = track ? getPlayableTrackUrl(track) : null;

  // Fallback effect if track was changed without a direct synchronous handler (e.g. Next/Prev in ContentView)
  useEffect(() => {
    if (!track || !playableUrl || !audioRef.current) {
      lastPlayedTrackIdRef.current = null;
      return;
    }

    if (
      lastPlayedTrackIdRef.current === track.id ||
      audioRef.current._activeTrackId === track.id
    ) {
      lastPlayedTrackIdRef.current = track.id;
      return;
    }
    lastPlayedTrackIdRef.current = track.id;
    audioRef.current._activeTrackId = track.id;

    playSampleWithOfflineSupport(audioRef.current, playableUrl, {
      onPlaySuccess: () => setIsPlaying && setIsPlaying(true),
      onPlayError: () => setIsPlaying && setIsPlaying(false),
      onEnded: () => setIsPlaying && setIsPlaying(false),
    });
  }, [track, playableUrl, audioRef, setIsPlaying]);

  const handleAudioError = async () => {
    if (!track || !audioRef.current) return;
    const enriched = enrichTrackMetadata(track);
    const sampleFallback = normalizeAudioUrl(enriched.sampleUrl);
    const currentSrc = audioRef.current.src || "";

    if (currentSrc && !currentSrc.startsWith("blob:")) {
      const cachedBlobUrl = await getCachedAudioBlobUrl(enriched);
      if (cachedBlobUrl && audioRef.current) {
        if (audioRef.current._blobUrl) {
          URL.revokeObjectURL(audioRef.current._blobUrl);
        }
        audioRef.current._blobUrl = cachedBlobUrl;
        audioRef.current.src = cachedBlobUrl;
        audioRef.current.play().catch(() => {});
        return;
      }
      if (sampleFallback && !currentSrc.endsWith(sampleFallback)) {
        audioRef.current.src = sampleFallback;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleTogglePlayPause = (e) => {
    e.stopPropagation();
    if (!audioRef.current || !track) return;

    if (!audioRef.current.paused) {
      audioRef.current.pause();
      if (setIsPlaying) setIsPlaying(false);
    } else {
      if (!audioRef.current.src && playableUrl) {
        lastPlayedTrackIdRef.current = track.id;
        playSampleWithOfflineSupport(audioRef.current, playableUrl, {
          onPlaySuccess: () => setIsPlaying && setIsPlaying(true),
          onPlayError: () => setIsPlaying && setIsPlaying(false),
          onEnded: () => setIsPlaying && setIsPlaying(false),
        });
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying && setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const currentLang = lang || t?.lang || "en";

  const languageName = track
    ? currentLang === "en"
      ? track.languageEn || track.stableKey || ""
      : track.langTh || track.languageEn || ""
    : "";

  const messageTitle = track
    ? currentLang === "en"
      ? track.title_en || "Unknown Title"
      : track.title_th || track.title_en || "ข้อความไม่ทราบชื่อ"
    : "";

  const displayTitle = languageName
    ? `${languageName} — ${messageTitle}`
    : messageTitle;

  return (
    <div
      className={`sticky bottom-0 w-full p-0 ${
        track && playableUrl
          ? "bg-gray-800 shadow-inner rounded-t-xl"
          : "bg-gray-200 dark:bg-slate-800 border-t border-gray-300 dark:border-slate-700"
      } transition-all duration-300 z-20`}
    >
      {/* Idle Bar when no track is selected */}
      {(!track || !playableUrl) && (
        <div className="w-full px-[8px] py-[6px] flex items-center justify-between text-[14px] text-gray-600 dark:text-gray-300">
          <button
            onClick={onGoBack}
            disabled={!hasPrev}
            className={`p-[4px] transition-colors ${
              hasPrev
                ? "text-gray-600 dark:text-gray-200 hover:text-gray-800 cursor-pointer"
                : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Go Back"
            title={t?.back || "Back"}
          >
            <ChevronLeft className="w-[20px] h-[20px]" />
          </button>

          <span className="text-center flex-grow text-[13px] sm:text-[14px] truncate px-[8px]">
            {t?.select_message_to_listen ||
              (currentLang === "th"
                ? "แตะไอคอนลำโพง 🔊 เพื่อฟังข้อความ"
                : "Select a message to listen.")}
          </span>

          <button
            onClick={onGoForward}
            disabled={!hasNext}
            className={`p-[4px] transition-colors ${
              hasNext
                ? "text-gray-600 dark:text-gray-200 hover:text-gray-800 cursor-pointer"
                : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
            aria-label="Go Forward"
            title={t?.forward || "Forward"}
          >
            <ChevronRight className="w-[20px] h-[20px]" />
          </button>
        </div>
      )}

      {/* Active Player Header Bar */}
      {track && playableUrl && (
        <div
          onClick={toggleMinimize}
          className="flex items-center px-[12px] py-[8px] cursor-pointer bg-[#003366] dark:bg-gray-900 rounded-t-xl gap-[8px]"
        >
          <button
            type="button"
            onClick={handleTogglePlayPause}
            className="w-[32px] h-[32px] rounded-full bg-amber-400 hover:bg-amber-300 text-gray-900 flex items-center justify-center flex-shrink-0 shadow transition-transform active:scale-95"
            title={
              isPlaying
                ? currentLang === "th"
                  ? "หยุดชั่วคราว"
                  : "Pause"
                : currentLang === "th"
                  ? "เล่น"
                  : "Play"
            }
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-[16px] h-[16px]" />
            ) : (
              <PlayCircle className="w-[20px] h-[20px]" />
            )}
          </button>

          <p className="text-[14px] font-bold text-white truncate flex-1">
            {displayTitle}
          </p>

          {onClose && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                if (setIsPlaying) setIsPlaying(false);
                lastPlayedTrackIdRef.current = null;
                onClose();
              }}
              className="p-[4px] hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              title={currentLang === "th" ? "ปิดเครื่องเล่น" : "Close Player"}
              aria-label="Close Player"
            >
              <X className="w-[20px] h-[20px] text-white" />
            </button>
          )}

          <ChevronLeft
            className={`w-[20px] h-[20px] text-white flex-shrink-0 transition-transform ${
              isMinimized ? "rotate-90" : "-rotate-90"
            }`}
          />
        </div>
      )}

      {/* Persistent <audio> element (Always in DOM for mobile gesture unlocking!) */}
      <div
        className={
          track && playableUrl && !isMinimized ? "p-3 bg-gray-800" : "hidden"
        }
      >
        <audio
          ref={audioRef}
          controls
          playsInline
          preload="none"
          onPlay={() => setIsPlaying && setIsPlaying(true)}
          onPause={() => setIsPlaying && setIsPlaying(false)}
          onEnded={() => setIsPlaying && setIsPlaying(false)}
          onError={handleAudioError}
          className="w-full"
        >
          {t?.audio_not_supported ||
            "Your browser does not support the audio element."}
        </audio>

        {track && (
          <div className="mt-2.5 flex justify-end">
            <DownloadButton track={track} t={t} lang={currentLang} />
          </div>
        )}
      </div>
    </div>
  );
};

const DownloadButton = ({ track, t, lang }) => {
  const { downloadTrack, isTrackOffline, isTrackDownloading } =
    useOfflineStorage();
  const isOffline = isTrackOffline(track.id);
  const isDownloading = isTrackDownloading(track.id);

  return (
    <button
      onClick={() => !isOffline && !isDownloading && downloadTrack(track)}
      disabled={isOffline || isDownloading}
      className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
        isOffline
          ? "text-amber-700 bg-amber-100 cursor-default"
          : isDownloading
            ? "text-gray-500 bg-gray-200 cursor-wait"
            : "text-brand-red bg-red-100 hover:bg-red-200"
      }`}
    >
      {isOffline ? (
        <>
          <CheckCircle className="w-4 h-4 mr-1.5" />
          {t?.downloaded || (lang === "th" ? "ดาวน์โหลดแล้ว" : "Downloaded")}
        </>
      ) : isDownloading ? (
        <>
          <Loader className="w-4 h-4 mr-1.5 animate-spin" />
          {t?.downloading ||
            (lang === "th" ? "กำลังดาวน์โหลด..." : "Downloading...")}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-1.5" />
          {t?.download_audio ||
            t?.download ||
            (lang === "th" ? "บันทึกไว้ฟังออฟไลน์" : "Save Offline")}
        </>
      )}
    </button>
  );
};

export default AudioPlayer;
