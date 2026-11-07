// src/components/ContentCard.jsx
// =====================================
// Message Card
//
// Consolidated 3-icon layout:
// - 3 main actions in a single row: Listen, Favorite, QR / More
// - Optional multi-select checkbox (shown when Select mode is active)

import React, { useRef } from "react";
import { formatContentItem } from "../utils/contentFormatter";
import {
  Volume2,
  Pause,
  Qrcode,
  Heart,
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
  showCheckbox = false,
  onEnableSelectMode,
  isPlayingSample,
  onPlaySample,
  onShowQrForMessage,
  isFavorite,
  onToggleFavorite,
}) => {
  const longPressTimerRef = useRef(null);

  const { languageDisplay, messageTitle, programNumber } = formatContentItem(
    item,
    lang,
  );

  const handleTouchStart = () => {
    if (!onEnableSelectMode && !onToggle) return;
    longPressTimerRef.current = setTimeout(() => {
      if (onEnableSelectMode) onEnableSelectMode();
      if (onToggle) onToggle();
    }, 550);
  };

  const handleTouchEndOrMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
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

  const durationText = item.duration
    ? ` (${formatDuration(item.duration)})`
    : "";

  const circleButtonClass =
    "w-[38px] h-[38px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full bg-gray-100 dark:bg-white text-gray-500 dark:text-gray-600 transition-all duration-200 shrink-0 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/30";

  const disabledCircleClass =
    "w-[38px] h-[38px] md:w-[40px] md:h-[40px] flex items-center justify-center rounded-full bg-gray-100 dark:bg-white text-gray-400 dark:text-gray-400 shrink-0 cursor-not-allowed opacity-50";

  const iconClass = "w-[20px] h-[20px] md:w-[22px] md:h-[22px]";

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndOrMove}
      onTouchMove={handleTouchEndOrMove}
      className="w-full bg-white dark:bg-[#374151] px-[10px] py-[8px] md:px-[16px] md:py-[10px] mb-[8px] md:mb-[12px] rounded-xl shadow-md border-t-4 border-brand-red card-hover"
    >
      <div className="card-responsive-row flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          {/* CHECKBOX (Hidden unless Select mode is active or items are selected) */}
          {showCheckbox && onToggle && (
            <div
              className="shrink-0 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              <input
                type="checkbox"
                className="w-[22px] h-[22px] accent-[#003366] dark:accent-[#a91b0d] cursor-pointer"
                checked={isSelected || false}
                onChange={() => {}}
              />
            </div>
          )}

          {/* MAIN TEXT */}
          <div
            className="flex-1 min-w-0 cursor-pointer py-[2px]"
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
                } font-semibold ${ACCENT_COLOR_CLASS} dark:text-white mb-0 leading-snug break-words`}
              >
                {languageDisplay}
              </p>
            )}

            <div className="md:flex md:items-baseline md:gap-2">
              <h3
                className={`${
                  lang === "th" ? "text-xl" : "text-lg"
                } font-bold ${TEXT_COLOR_CLASS} dark:text-white leading-snug break-words ${
                  showLanguageName ? "" : "mt-0"
                }`}
              >
                {messageTitle}
              </h3>

              <p className="text-xs text-gray-400 md:text-gray-500 dark:text-gray-200 md:dark:text-white mt-0.5 md:mt-0">
                {t?.program_number || (lang === "th" ? "ข้อความ #" : "Message #")}
                {programNumber}
                {durationText}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION AREA: 3 Primary Actions in a Single Row */}
        <div className="card-responsive-actions shrink-0 flex items-center gap-[6px]">
          {/* 1. LISTEN */}
          {item.sampleUrl || item.trackDownloadUrl ? (
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
                  ? lang === "th"
                    ? `หยุดฟัง${durationText}`
                    : `Stop${durationText}`
                  : lang === "th"
                    ? `ฟังข้อความ${durationText}`
                    : `Listen${durationText}`
              }
              aria-label={
                isPlayingSample
                  ? lang === "th"
                    ? `หยุดฟัง${durationText}`
                    : `Stop${durationText}`
                  : lang === "th"
                    ? `ฟังข้อความ${durationText}`
                    : `Listen${durationText}`
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

          {/* 2. FAVORITE */}
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
                  ? lang === "th"
                    ? `ลบออกจากรายการโปรด${durationText}`
                    : `Remove from Favorites${durationText}`
                  : lang === "th"
                    ? `เพิ่มในรายการโปรด${durationText}`
                    : `Add to Favorites${durationText}`
              }
              aria-label={
                isFavorite
                  ? lang === "th"
                    ? `ลบออกจากรายการโปรด${durationText}`
                    : `Remove from Favorites${durationText}`
                  : lang === "th"
                    ? `เพิ่มในรายการโปรด${durationText}`
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
              title={
                lang === "th" ? "ไม่พร้อมใช้งาน" : "Favorites unavailable"
              }
            >
              <Heart className={iconClass} />
            </div>
          )}

          {/* 3. QR SHARE & MORE */}
          {onShowQrForMessage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowQrForMessage();
              }}
              className={`${circleButtonClass} hover:bg-brand-red hover:text-white`}
              title={
                t?.share_message
                  ? `${t.share_message}${durationText}`
                  : lang === "th"
                    ? `คิวอาร์โค้ด แชร์ และดาวน์โหลด${durationText}`
                    : `QR Code, Share & Download${durationText}`
              }
              aria-label={
                t?.share_message
                  ? `${t.share_message}${durationText}`
                  : lang === "th"
                    ? `คิวอาร์โค้ด แชร์ และดาวน์โหลด${durationText}`
                    : `QR Code, Share & Download${durationText}`
              }
            >
              <Qrcode className={iconClass} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
