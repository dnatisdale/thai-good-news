import React, { useEffect, useState, useRef } from "react";
import {
  Volume2,
  Pause,
  Heart,
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
  showCheckbox = false,
  onEnableSelectMode,
  setHovering,
  onPlayLanguage,
  isPlayingLanguage,
  isFavorite,
  onToggleFavorite,
  searchQuery,
  id,
}) => {
  const [localIsFavorite, setLocalIsFavorite] = useState(!!isFavorite);
  const longPressTimerRef = useRef(null);

  useEffect(() => {
    setLocalIsFavorite(!!isFavorite);
  }, [isFavorite]);

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
    "w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 dark:bg-white text-gray-600 dark:text-gray-600 transition-all duration-200 shrink-0 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red/30";

  const disabledCircleClass =
    "w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 dark:bg-white text-gray-400 dark:text-gray-400 shrink-0 cursor-not-allowed opacity-55";

  return (
    <div
      id={id}
      onMouseEnter={() => setHovering && setHovering(true)}
      onMouseLeave={() => setHovering && setHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndOrMove}
      onTouchMove={handleTouchEndOrMove}
      className="relative bg-white dark:bg-[#374151] px-[10px] py-[8px] mb-[6px] rounded-xl shadow-md border-b-4 border-brand-red card-hover transition-colors"
    >
      {/* MAIN CARD ROW */}
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
                checked={selectionState === "checked"}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = selectionState === "indeterminate";
                  }
                }}
                readOnly
              />
            </div>
          )}

          {/* LANGUAGE TEXT */}
          <div
            onClick={() => onSelect(languageName)}
            className="flex-1 min-w-0 cursor-pointer py-[2px]"
          >
            <h3
              className={`text-xl font-bold leading-snug break-words ${ACCENT_COLOR_CLASS} dark:text-white`}
            >
              {highlightText(languageName, searchQuery)}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5 leading-snug">
              {lang === "en" ? "Tap to view" : "แตะเพื่อดู"} ({messageCount}{" "}
              {messageWord})
            </p>
          </div>
        </div>

        {/* RIGHT BUTTON AREA (3 Primary Actions: Listen, Favorite, QR/More) */}
        <div className="card-responsive-actions shrink-0 flex items-center gap-[6px]">
          {/* 1. LISTEN */}
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
            title={
              isPlayingLanguage
                ? lang === "en"
                  ? "Stop sample"
                  : "หยุดตัวอย่าง"
                : lang === "en"
                  ? "Listen to sample"
                  : "ฟังตัวอย่าง"
            }
            aria-label={
              isPlayingLanguage
                ? lang === "en"
                  ? "Stop sample"
                  : "หยุดตัวอย่าง"
                : lang === "en"
                  ? "Listen to sample"
                  : "ฟังตัวอย่าง"
            }
          >
            {isPlayingLanguage ? (
              <Pause className="w-[22px] h-[22px]" />
            ) : (
              <Volume2 className="w-[22px] h-[22px]" />
            )}
          </button>

          {/* 2. FAVORITE */}
          {onToggleFavorite ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLocalIsFavorite((currentValue) => !currentValue);
                onToggleFavorite();
              }}
              className={`${circleButtonClass} group hover:bg-brand-red`}
              title={
                localIsFavorite
                  ? lang === "en"
                    ? "Remove from Favorites"
                    : "ลบออกจากรายการโปรด"
                  : lang === "en"
                    ? "Add to Favorites"
                    : "เพิ่มในรายการโปรด"
              }
              aria-label={
                localIsFavorite
                  ? lang === "en"
                    ? "Remove from Favorites"
                    : "ลบออกจากรายการโปรด"
                  : lang === "en"
                    ? "Add to Favorites"
                    : "เพิ่มในรายการโปรด"
              }
            >
              <Heart
                className="w-[22px] h-[22px] transition-all group-hover:text-white"
                style={{
                  fill: localIsFavorite ? "#CC3333" : "none",
                  color: "#CC3333",
                  strokeWidth: "2",
                }}
              />
            </button>
          ) : (
            <div
              className={disabledCircleClass}
              title={
                lang === "en" ? "Favorites unavailable" : "ไม่พร้อมใช้งาน"
              }
              aria-label={
                lang === "en" ? "Favorites unavailable" : "ไม่พร้อมใช้งาน"
              }
            >
              <Heart className="w-[22px] h-[22px]" />
            </div>
          )}

          {/* 3. QR SHARE & MORE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowQrForLanguage(languageName);
            }}
            className={`${circleButtonClass} hover:bg-brand-red hover:text-white`}
            title={
              i18n[lang]?.share_language_qr ||
              (lang === "en"
                ? "QR Code, Share & More"
                : "คิวอาร์โค้ด แชร์ และอื่นๆ")
            }
            aria-label={
              i18n[lang]?.share_language_qr ||
              (lang === "en"
                ? "QR Code, Share & More"
                : "คิวอาร์โค้ด แชร์ และอื่นๆ")
            }
          >
            <Qrcode className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageCard;
