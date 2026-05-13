// src/components/ContentCard.jsx
// =====================================
// Message Card
//
// Matches the LanguageCard pattern:
// - Only 3 main actions show first: Listen, Favorite, Share
// - The caret opens the other 3 actions: Open, Download, YouTube
// - This works on phone, tablet, and desktop so the message cards stay clean.

import React, { useState } from "react";
import { formatContentItem } from "../utils/contentFormatter";
import {
  Volume2,
  Pause,
  Qrcode,
  Heart,
  Download,
  YouTubeColor,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "./Icons";

const ACCENT_COLOR_CLASS = "text-brand-red";
const TEXT_COLOR_CLASS = "text-gray-800";

const ContentCard = ({
  item,
  lang,
  t,
  onSelect,
  showLanguageName = true,
  largeLanguage = false,
  isSelected,
  onToggle,
  isPlayingSample,
  onPlaySample,
  onShowQrForMessage,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { languageDisplay, messageTitle, programNumber } = formatContentItem(
    item,
    lang,
  );

  const getExternalMessageUrl = () => {
    let url =
      item.shareUrl ||
      item.streamUrl ||
      item.trackDownloadUrl ||
      item.sampleUrl;

    if (!url) {
      if (item.id) {
        url = `https://5fi.sh/T${item.id}`;
      } else if (item.programId) {
        url = `https://5fi.sh/T${item.programId}`;
      } else {
        return null;
      }
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    return url;
  };

  const formatDuration = (input) => {
    if (!input) return null;

    if (typeof input === "string" && /^\d+:\d{2}(:\d{2})?$/.test(input)) {
      return input;
    }

    const seconds = Number(input);
    if (Number.isNaN(seconds)) return null;

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const externalMessageUrl = getExternalMessageUrl();
  const audioDownloadUrl = item.downloadUrl || item.audioUrl || item.sampleUrl;
  const videoUrl = item.youtubeUrl || item.languageVideoUrl;
  const durationText = item.duration
    ? ` (${formatDuration(item.duration)})`
    : "";

  const circleButtonClass =
    "w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white text-gray-500 dark:text-gray-600 transition-all duration-200 shrink-0 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/30";

  const disabledCircleClass =
    "w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white text-gray-400 dark:text-gray-400 shrink-0 cursor-not-allowed opacity-50";

  const iconClass = "w-5 h-5 md:w-6 md:h-6";

  const caretTitle = isExpanded
    ? lang === "en"
      ? "Hide extra buttons"
      : "ซ่อนปุ่มเพิ่มเติม"
    : lang === "en"
      ? "Show extra buttons"
      : "แสดงปุ่มเพิ่มเติม";

  const openExternalUrl = (e) => {
    e.stopPropagation();
    if (externalMessageUrl) {
      window.open(externalMessageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#374151] px-2.5 py-1.5 md:px-4 md:py-2.5 mb-2 md:mb-3 rounded-xl shadow-md border-t-4 border-brand-red card-hover">
      <div className="flex items-start gap-2">
        {/* CHECKBOX */}
        {onToggle && (
          <div
            className="pt-1 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <input
              type="checkbox"
              className="w-6 h-6 accent-[#003366] dark:accent-[#a91b0d] cursor-pointer"
              checked={isSelected || false}
              onChange={() => {}}
            />
          </div>
        )}

        {/* MAIN TEXT */}
        <div
          className="flex-1 min-w-0 cursor-pointer pt-0 md:pt-0.5"
          onClick={() => onSelect && onSelect(item)}
        >
          {showLanguageName && (
            <p
              className={`${
                largeLanguage
                  ? lang === "th"
                    ? "text-xl"
                    : "text-lg"
                  : lang === "th"
                    ? "text-lg"
                    : "text-base"
              } font-semibold ${ACCENT_COLOR_CLASS} dark:text-white mb-0 leading-tight`}
            >
              {languageDisplay}
            </p>
          )}

          <div className="md:flex md:items-baseline md:gap-2">
            <h3
              className={`${
                lang === "th" ? "text-xl" : "text-lg"
              } font-bold ${TEXT_COLOR_CLASS} dark:text-white leading-tight ${
                showLanguageName ? "" : "mt-0"
              }`}
            >
              {externalMessageUrl ? (
                <button
                  type="button"
                  onClick={openExternalUrl}
                  className="underline decoration-dotted underline-offset-2 hover:decoration-solid bg-transparent border-none p-0 m-0 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand-red rounded-sm"
                  title={
                    t?.open_message_on_grn ||
                    (lang === "en"
                      ? "Open this message on 5fish / GRN"
                      : "เปิดข้อความนี้ใน 5fish / GRN")
                  }
                >
                  {messageTitle}
                </button>
              ) : (
                messageTitle
              )}
            </h3>

            <p className="text-xs text-gray-400 md:text-gray-500 dark:text-gray-200 md:dark:text-white mt-0 md:mt-0">
              {t?.program_number || "Message #"}
              {programNumber}
            </p>
          </div>
        </div>

        {/* ACTION AREA: same idea as LanguageCard */}
        <div className="relative shrink-0 w-[126px] md:w-[150px] pt-4 pr-0">
          {/* CARET */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((currentValue) => !currentValue);
            }}
            className="
              absolute -top-2 -right-1 z-20
              w-8 h-8 md:w-9 md:h-9
              flex items-center justify-center
              text-gray-500 dark:text-gray-200
              bg-transparent border-0 shadow-none
              outline-none ring-0
              hover:text-brand-red dark:hover:text-white
              active:scale-110
              focus:outline-none focus:ring-0
              transition-all duration-200 ease-out
            "
            title={caretTitle}
            aria-label={caretTitle}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="w-7 h-7 md:w-8 md:h-8" />
            ) : (
              <ChevronDown className="w-7 h-7 md:w-8 md:h-8" />
            )}
          </button>

          {/* TOP 3 ACTIONS */}
          <div className="grid grid-cols-3 gap-1 md:gap-1.5 justify-items-center pt-0">
            {/* LISTEN */}
            {item.sampleUrl ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlaySample && onPlaySample();
                }}
                className={`${circleButtonClass} ${
                  isPlayingSample
                    ? "bg-amber-100 dark:bg-amber-100 text-amber-600 dark:text-amber-600 animate-pulse"
                    : "hover:bg-orange-500 hover:text-white"
                }`}
                title={
                  isPlayingSample
                    ? `Stop Preview${durationText}`
                    : `Listen to Preview${durationText}`
                }
                aria-label={
                  isPlayingSample
                    ? `Stop Preview${durationText}`
                    : `Listen to Preview${durationText}`
                }
              >
                {isPlayingSample ? (
                  <Pause className={iconClass} />
                ) : (
                  <Volume2 className={iconClass} />
                )}
              </button>
            ) : (
              <div
                className={disabledCircleClass}
                title={
                  lang === "en" ? "No audio preview" : "ไม่มีตัวอย่างเสียง"
                }
                aria-label={
                  lang === "en" ? "No audio preview" : "ไม่มีตัวอย่างเสียง"
                }
              >
                <Volume2 className={iconClass} />
              </div>
            )}

            {/* FAVORITE */}
            {onToggleFavorite ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`${circleButtonClass} group hover:bg-brand-red`}
                title={
                  isFavorite
                    ? `Remove from Favorites${durationText}`
                    : `Add to Favorites${durationText}`
                }
                aria-label={
                  isFavorite
                    ? `Remove from Favorites${durationText}`
                    : `Add to Favorites${durationText}`
                }
              >
                <Heart
                  className={`${iconClass} transition-all group-hover:text-white`}
                  style={{
                    fill: isFavorite ? "#CC3333" : "none",
                    color: "#CC3333",
                    strokeWidth: "2",
                  }}
                />
              </button>
            ) : (
              <div
                className={disabledCircleClass}
                title="Favorites unavailable"
              >
                <Heart className={iconClass} />
              </div>
            )}

            {/* SHARE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowQrForMessage && onShowQrForMessage();
              }}
              className={`${circleButtonClass} hover:bg-brand-red hover:text-white`}
              title={
                t?.share_message
                  ? `${t.share_message}${durationText}`
                  : `Share Message${durationText}`
              }
              aria-label={
                t?.share_message
                  ? `${t.share_message}${durationText}`
                  : `Share Message${durationText}`
              }
            >
              <Qrcode className={iconClass} />
            </button>
          </div>

          {/* BOTTOM 3 ACTIONS */}
          {isExpanded && (
            <div className="mt-1 grid grid-cols-3 gap-1 md:gap-1.5 justify-items-center">
              {/* OPEN */}
              {externalMessageUrl ? (
                <a
                  href={externalMessageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-blue-500 hover:text-white`}
                  title={
                    t?.open_message_on_grn
                      ? `${t.open_message_on_grn}${durationText}`
                      : lang === "en"
                        ? `Open this message on 5fish / GRN${durationText}`
                        : `เปิดข้อความนี้ใน 5fish / GRN${durationText}`
                  }
                  aria-label={
                    t?.open_message_on_grn
                      ? `${t.open_message_on_grn}${durationText}`
                      : lang === "en"
                        ? `Open this message on 5fish / GRN${durationText}`
                        : `เปิดข้อความนี้ใน 5fish / GRN${durationText}`
                  }
                >
                  <ExternalLink className={iconClass} />
                </a>
              ) : (
                <div className={disabledCircleClass}>
                  <ExternalLink className={iconClass} />
                </div>
              )}

              {/* DOWNLOAD */}
              {audioDownloadUrl ? (
                <a
                  href={audioDownloadUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-green-500 hover:text-white`}
                  title={
                    t?.download_audio
                      ? `${t.download_audio}${durationText}`
                      : `Download${durationText}`
                  }
                  aria-label={
                    t?.download_audio
                      ? `${t.download_audio}${durationText}`
                      : `Download${durationText}`
                  }
                >
                  <Download className={iconClass} />
                </a>
              ) : (
                <div className={disabledCircleClass}>
                  <Download className={iconClass} />
                </div>
              )}

              {/* YOUTUBE */}
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-gray-300`}
                  title={
                    t?.watch_on_youtube
                      ? `${t.watch_on_youtube}${durationText}`
                      : `Watch on YouTube${durationText}`
                  }
                  aria-label={
                    t?.watch_on_youtube
                      ? `${t.watch_on_youtube}${durationText}`
                      : `Watch on YouTube${durationText}`
                  }
                >
                  <YouTubeColor className={iconClass} />
                </a>
              ) : (
                <div
                  className={disabledCircleClass}
                  title={`No video available${durationText}`}
                  aria-label={`No video available${durationText}`}
                >
                  <YouTubeColor className={iconClass} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
