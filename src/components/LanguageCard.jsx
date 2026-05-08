import React, { useState } from "react";
import {
  Volume2,
  Heart,
  Download,
  YouTubeColor,
  ExternalLink,
  Qrcode,
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
    "w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white text-gray-600 dark:text-gray-600 transition-all shrink-0";

  return (
    <div
      id={id}
      onMouseEnter={() => setHovering && setHovering(true)}
      onMouseLeave={() => setHovering && setHovering(false)}
      className="relative bg-white dark:bg-[#374151] px-2 py-3 mb-1 rounded-xl shadow-md border-b-4 border-brand-red card-hover transition-colors"
    >
      {/* CARET — TOP RIGHT CORNER, SAME SPOT, NO CIRCLE */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded((currentValue) => !currentValue);
        }}
        className="
          absolute top-1 right-2 z-10
          w-7 h-7
          flex items-center justify-center
          text-3xl leading-none
          text-gray-500 dark:text-gray-200
          hover:text-brand-red dark:hover:text-white
          hover:scale-125 active:scale-150
          transition-all duration-200 ease-out
        "
        title={
          isExpanded
            ? lang === "en"
              ? "Hide extra buttons"
              : "ซ่อนปุ่มเพิ่มเติม"
            : lang === "en"
              ? "Show extra buttons"
              : "แสดงปุ่มเพิ่มเติม"
        }
        aria-expanded={isExpanded}
      >
        {isExpanded ? "⌃" : "⌄"}
      </button>

      {/* TOP ROW */}
      <div className="flex items-start gap-1.5 pr-7">
        {/* CHECKBOX */}
        <div
          className="pt-2 shrink-0"
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
          className="flex-1 min-w-0 pt-1 cursor-pointer"
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

        {/* ALWAYS-VISIBLE 3 BUTTONS */}
        <div className="flex items-start gap-1.5 shrink-0">
          {/* LISTEN */}
          <button
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
          >
            <Volume2 className="w-6 h-6" />
          </button>

          {/* FAVORITE */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`${circleButtonClass} group hover:bg-brand-red`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart
                className="w-6 h-6 transition-all"
                style={{
                  fill: isFavorite ? "#CC3333" : "none",
                  color: "#CC3333",
                  strokeWidth: "2",
                }}
                onMouseEnter={(e) => {
                  if (isFavorite) {
                    e.currentTarget.style.fill = "white";
                    e.currentTarget.style.color = "white";
                  } else {
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFavorite) {
                    e.currentTarget.style.fill = "#CC3333";
                    e.currentTarget.style.color = "#CC3333";
                  } else {
                    e.currentTarget.style.color = "#CC3333";
                  }
                }}
              />
            </button>
          )}

          {/* QR SHARE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowQrForLanguage(languageName);
            }}
            className={`${circleButtonClass} hover:bg-brand-red hover:text-white`}
            title={i18n[lang].share_language_qr || "Show QR code / Share"}
          >
            <Qrcode className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* HIDDEN EXTRA BUTTONS */}
      {isExpanded && (
        <div className="mt-3 ml-8 mr-8 rounded-xl bg-gray-50 dark:bg-[#4b5563] px-2 py-2">
          <div className="flex justify-end gap-1.5">
            {/* OPEN */}
            {externalUrl && (
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
              >
                <ExternalLink className="w-6 h-6" />
              </a>
            )}

            {/* DOWNLOAD */}
            {sampleUrl && (
              <a
                href={sampleUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className={`${circleButtonClass} hover:bg-green-500 hover:text-white`}
                title="Download sample"
              >
                <Download className="w-6 h-6" />
              </a>
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
              >
                <YouTubeColor className="w-6 h-6" />
              </a>
            ) : (
              <div
                className={`${circleButtonClass} cursor-not-allowed opacity-60`}
                title={lang === "en" ? "No video available" : "ไม่มีวิดีโอ"}
              >
                <YouTubeColor className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
