import React from "react";
import { Download, X } from "./Icons";

const UpdateNotification = ({
  updateAvailable,
  newVersion,
  onUpdate,
  onDismiss,
  lang = "en",
}) => {
  if (!updateAvailable) return null;

  const messageText =
    lang === "th"
      ? `✨ มีเวอร์ชันใหม่${newVersion ? ` (v${newVersion})` : ""} พร้อมติดตั้ง!`
      : `✨ New version${newVersion ? ` (v${newVersion})` : ""} available!`;

  const buttonText = lang === "th" ? "ติดตั้งอัปเดต" : "Install Update";

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2.5 text-center z-[100] shadow-lg">
      <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
        <span className="text-sm md:text-base font-medium">{messageText}</span>
        <button
          type="button"
          onClick={onUpdate}
          className="bg-white text-blue-700 px-3.5 py-1.5 rounded-lg font-bold hover:bg-gray-100 active:scale-95 transition-all text-xs md:text-sm shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Download className="w-4 h-4" />
          {buttonText}
        </button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="p-1 text-white/80 hover:text-white rounded-full transition-colors ml-1"
            aria-label="Dismiss update notification"
            title={lang === "th" ? "ปิด" : "Dismiss"}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdateNotification;
