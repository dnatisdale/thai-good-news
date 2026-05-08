import React, { useState } from "react";
import {
  Volume2,
  Heart,
  Download,
  YouTubeColor,
  ExternalLink,
  Qrcode,
  ChevronDown,
  ChevronUp,
} from "./Icons";
import { i18n } from "../i18n";

const ACCENT_COLOR_CLASS = "text-brand-red";

const LanguageCard = ({
  languageName,
  lang,
  onSelect,
  messageCount,
  onShowQrForLanguage,
  selectionState,
  onToggle,
  setHovering,
  onPlayLanguage,
  isPlayingLanguage,
  isFavorite,
  onToggleFavorite,
  sampleUrl,
  externalUrl,
  languageVideoUrl,
  searchQuery,
  id,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-900 text-black dark:text-white rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const messageWord =
    messageCount === 1
      ? lang === "en"
        ? "message"
        : "ข้อความ"
      : lang === "en"
        ? "messages"
        : "ข้อความ";

  const circleButtonClass =
    "w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white text-gray-600 dark:text-gray-600 transition-all duration-200 shrink-0 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/30";

  const disabledCircleClass =
    "w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white text-gray-400 dark:text-gray-400 shrink-0 cursor-not-allowed opacity-55";

  const caretTitle = isExpanded
    ? lang === "en"
      ? "Hide extra buttons"
      : "ซ่อนปุ่มเพิ่มเติม"
    : lang === "en"
      ? "Show extra buttons"
      : "แสดงปุ่มเพิ่มเติม";

  return (
    <div
      id={id}
      onMouseEnter={() => setHovering && setHovering(true)}
      onMouseLeave={() => setHovering && setHovering(false)}
      className="relative bg-white dark:bg-[#374151] px-2 py-1.5 mb-1 rounded-xl shadow-md border-b-4 border-brand-red card-hover transition-colors"
    >
      {/* MAIN CARD ROW */}
      <div className="flex items-start gap-1.5">
        {/* CHECKBOX */}
        <div
          className="pt-4 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <input
            type="checkbox"
            className="w-6 h-6 accent-[#003366] dark:accent-[#a91b0d] cursor-pointer"
            checked={selectionState === "checked"}
            ref={(input) => {
              if (input) {
                input.indeterminate = selectionState === "indeterminate";
              }
            }}
            readOnly
          />
        </div>

        {/* LANGUAGE TEXT */}
        <div
          onClick={() => onSelect(languageName)}
          className="flex-1 min-w-0 pt-3 cursor-pointer"
        >
          <h3
            className={`text-xl font-bold leading-tight ${ACCENT_COLOR_CLASS} dark:text-white`}
          >
            {highlightText(languageName, searchQuery)}
          </h3>

          <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
            {lang === "en" ? "Tap to view" : "แตะเพื่อดู"} ({messageCount}{" "}
            {messageWord})
          </p>
        </div>

        {/* RIGHT BUTTON AREA */}
        <div className="relative shrink-0 w-[132px] pt-5 pr-0">
          {/* CARET: HIGHER, FAR RIGHT, ABOVE QR BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((currentValue) => !currentValue);
            }}
            className="
              absolute -top-4 right-0 z-20
              w-10 h-8
              flex items-center justify-center
              text-gray-500 dark:text-gray-200
              bg-transparent border-0 shadow-none
              outline-none ring-0
              hover:text-brand-red dark:hover:text-white
              hover:scale-150 active:scale-175
              focus:outline-none focus:ring-0
              transition-all duration-200 ease-out
            "
            title={caretTitle}
            aria-label={caretTitle}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="w-8 h-8" />
            ) : (
              <ChevronDown className="w-8 h-8" />
            )}
          </button>

          {/* TOP 3 BUTTONS */}
          <div className="grid grid-cols-3 gap-1.5 justify-items-center">
            {/* LISTEN */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayLanguage && onPlayLanguage();
              }}
              className={`${circleButtonClass} ${
                isPlayingLanguage
                  ? "bg-amber-100 dark:bg-amber-100 text-amber-600 dark:text-amber-600 animate-pulse"
                  : "hover:bg-amber-500 hover:text-white"
              }`}
              title={lang === "en" ? "Listen to sample" : "ฟังตัวอย่าง"}
              aria-label={lang === "en" ? "Listen to sample" : "ฟังตัวอย่าง"}
            >
              <Volume2 className="w-6 h-6" />
            </button>

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
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
                aria-label={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                <Heart
                  className="w-6 h-6 transition-all group-hover:text-white"
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
                aria-label="Favorites unavailable"
              >
                <Heart className="w-6 h-6" />
              </div>
            )}

            {/* QR SHARE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowQrForLanguage(languageName);
              }}
              className={`${circleButtonClass} hover:bg-brand-red hover:text-white`}
              title={i18n[lang].share_language_qr || "Show QR code / Share"}
              aria-label={
                i18n[lang].share_language_qr || "Show QR code / Share"
              }
            >
              <Qrcode className="w-6 h-6" />
            </button>
          </div>

          {/* BOTTOM 3 BUTTONS: SAME GRID, NO BACKGROUND BOX */}
          {isExpanded && (
            <div className="mt-1 grid grid-cols-3 gap-1.5 justify-items-center">
              {/* OPEN */}
              {externalUrl ? (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-blue-500 hover:text-white`}
                  title={
                    i18n[lang].open_language_on_grn ||
                    "Open this language on GRN / 5fish"
                  }
                  aria-label={
                    i18n[lang].open_language_on_grn ||
                    "Open this language on GRN / 5fish"
                  }
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              ) : (
                <div
                  className={disabledCircleClass}
                  title={
                    lang === "en"
                      ? "No external link available"
                      : "ไม่มีลิงก์ภายนอก"
                  }
                  aria-label={
                    lang === "en"
                      ? "No external link available"
                      : "ไม่มีลิงก์ภายนอก"
                  }
                >
                  <ExternalLink className="w-6 h-6" />
                </div>
              )}

              {/* DOWNLOAD */}
              {sampleUrl ? (
                <a
                  href={sampleUrl}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-green-500 hover:text-white`}
                  title="Download sample"
                  aria-label="Download sample"
                >
                  <Download className="w-6 h-6" />
                </a>
              ) : (
                <div
                  className={disabledCircleClass}
                  title={
                    lang === "en"
                      ? "No download available"
                      : "ไม่มีไฟล์ดาวน์โหลด"
                  }
                  aria-label={
                    lang === "en"
                      ? "No download available"
                      : "ไม่มีไฟล์ดาวน์โหลด"
                  }
                >
                  <Download className="w-6 h-6" />
                </div>
              )}

              {/* VIDEO */}
              {languageVideoUrl ? (
                <a
                  href={languageVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`${circleButtonClass} hover:bg-gray-300`}
                  title={lang === "en" ? "Watch video" : "ดูวิดีโอ"}
                  aria-label={lang === "en" ? "Watch video" : "ดูวิดีโอ"}
                >
                  <YouTubeColor className="w-6 h-6" />
                </a>
              ) : (
                <div
                  className={disabledCircleClass}
                  title={lang === "en" ? "No video available" : "ไม่มีวิดีโอ"}
                  aria-label={
                    lang === "en" ? "No video available" : "ไม่มีวิดีโอ"
                  }
                >
                  <YouTubeColor className="w-6 h-6" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;
