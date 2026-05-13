import React, { useState, useEffect } from "react";
import {
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
  Loader,
  X,
} from "./Icons";
import { useOfflineStorage } from "../hooks/useOfflineStorage";

const AudioPlayer = ({
  track,
  isMinimized,
  toggleMinimize,
  t,
  onGoBack,
  onGoForward,
  hasPrev,
  hasNext,
  onClose,
}) => {
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    const loadAudioSrc = async () => {
      if (!track || !track.trackDownloadUrl) {
        setAudioSrc(null);
        return;
      }

      try {
        const cache = await caches.open("offline-audio-v1");

        let urlToCheck = track.trackDownloadUrl;
        if (urlToCheck && !urlToCheck.startsWith("http")) {
          urlToCheck = "https://" + urlToCheck;
        }

        console.debug("AudioPlayer: Checking cache for URL:", urlToCheck);
        const cachedResponse = await cache.match(urlToCheck);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();

          if (blob.size === 0) {
            console.error(
              "AudioPlayer: Blob is empty! Falling back to online URL",
            );
            setAudioSrc(urlToCheck);
            return;
          }

          const url = URL.createObjectURL(blob);
          setAudioSrc(url);
        } else {
          setAudioSrc(urlToCheck);
        }
      } catch (error) {
        console.error("AudioPlayer: Error loading audio:", error);
        let fallbackUrl = track.trackDownloadUrl;
        if (fallbackUrl && !fallbackUrl.startsWith("http")) {
          fallbackUrl = "https://" + fallbackUrl;
        }
        setAudioSrc(fallbackUrl);
      }
    };

    loadAudioSrc();

    return () => {
      if (audioSrc && audioSrc.startsWith("blob:")) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [track]);

  if (!track || !track.trackDownloadUrl) {
    return (
      <div className="sticky bottom-0 w-full px-2 py-1.5 bg-gray-200 flex items-center justify-between text-sm text-gray-600 z-20">
        <button
          onClick={onGoBack}
          disabled={!hasPrev}
          className={`p-1 transition-colors ${
            hasPrev
              ? "text-gray-600 hover:text-gray-800 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Go Back"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-center flex-grow text-xs sm:text-sm truncate px-2">
          {t.select_message_to_listen || "Select a message to listen."}
        </span>

        <button
          onClick={onGoForward}
          disabled={!hasNext}
          className={`p-1 transition-colors ${
            hasNext
              ? "text-gray-600 hover:text-gray-800 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Go Forward"
          title="Forward"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const currentLang = t.lang || "en";

  const displayTitle =
    currentLang === "en"
      ? (track.title_en ?? "Unknown Title")
      : (track.title_th ?? "ข้อความไม่ทราบชื่อ");

  return (
    <div
      className={`sticky bottom-0 w-full p-0 bg-gray-800 shadow-inner transition-transform duration-300 ${
        isMinimized ? "translate-y-[calc(100%-42px)]" : "translate-y-0"
      } rounded-t-xl z-20`}
    >
      <div
        onClick={toggleMinimize}
        className="flex items-center px-3 py-2 cursor-pointer bg-gray-900 rounded-t-xl"
      >
        <PlayCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />
        <p className="text-sm font-bold text-white truncate">
          {isMinimized
            ? (t.playing || "Playing") + ": " + displayTitle
            : t.controls || "Audio Player"}
        </p>

        {onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-auto mr-2 p-1 hover:bg-gray-700 rounded-full transition-colors"
            title="Close Player"
            aria-label="Close Player"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        <ChevronLeft
          className={`w-5 h-5 text-white ${!onClose ? "ml-auto" : ""} transition-transform ${
            isMinimized ? "rotate-90" : "-rotate-90"
          }`}
        />
      </div>

      <div className={`${isMinimized ? "hidden" : "p-4"}`}>
        {audioSrc ? (
          <audio
            key={track.id + "-" + audioSrc}
            controls
            autoPlay
            src={audioSrc}
            className="w-full"
          >
            {t.audio_not_supported ||
              "Your browser does not support the audio element."}
          </audio>
        ) : (
          <div className="text-white text-center">Loading audio...</div>
        )}

        <div className="mt-3 flex justify-end">
          <DownloadButton track={track} t={t} />
        </div>
      </div>
    </div>
  );
};

const DownloadButton = ({ track, t }) => {
  const { downloadTrack, isTrackOffline, isTrackDownloading } =
    useOfflineStorage();
  const isOffline = isTrackOffline(track.id);
  const isDownloading = isTrackDownloading(track.id);

  return (
    <button
      onClick={() => !isOffline && !isDownloading && downloadTrack(track)}
      disabled={isOffline || isDownloading}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
        isOffline
          ? "text-amber-600 bg-amber-100 cursor-default"
          : isDownloading
            ? "text-gray-500 bg-gray-200 cursor-wait"
            : "text-brand-red bg-red-100 hover:bg-red-200"
      }`}
    >
      {isOffline ? (
        <>
          <CheckCircle className="w-4 h-4 mr-1.5" />
          {t.downloaded || "Downloaded"}
        </>
      ) : isDownloading ? (
        <>
          <Loader className="w-4 h-4 mr-1.5 animate-spin" />
          {t.downloading || "Downloading..."}
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-1.5" />
          {t.download || "Download"}
        </>
      )}
    </button>
  );
};

export default AudioPlayer;
