import React, { useState, useEffect } from "react";
import { Download, X } from "./Icons";

const InstallBanner = ({ onInstall, onClose, t, lang }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay to be less intrusive
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const installMessage =
    lang === "th"
      ? "ติดตั้งแอพเพื่อใช้งานแบบออฟไลน์และโหลดเร็วขึ้น!"
      : "Install App for offline access and faster loading times!";

  const installButtonText = lang === "th" ? "ติดตั้งทันที" : "Install Now";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-[#FF8C00] text-white rounded-xl shadow-2xl border-2 border-white/20 overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-0 md:gap-3">
          {/* BIG INSTALL CLICK AREA */}
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-left hover:bg-white/10 active:scale-[0.99] transition-all"
            aria-label={installMessage}
          >
            {/* Left Side: Icon + Text */}
            <div className="flex items-center gap-4 flex-1 w-full">
              <div className="bg-white/20 p-3 rounded-full animate-wiggle shrink-0">
                <Download className="w-6 h-6 text-white" />
              </div>

              <div className="text-left">
                <h3 className="font-bold text-lg leading-tight animate-breathe origin-left">
                  {installMessage}
                </h3>
              </div>
            </div>

            {/* Install Now button-looking area */}
            <div className="w-full md:w-auto px-6 py-2.5 bg-white text-[#FF8C00] font-bold rounded-lg shadow-sm whitespace-nowrap animate-wiggle-subtle text-center">
              {installButtonText}
            </div>
          </button>

          {/* X CLOSE AREA - NOT INSTALL */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="absolute md:static top-5 right-5 p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
