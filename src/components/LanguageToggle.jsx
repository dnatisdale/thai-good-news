import React from "react";
import { LanguageIcon } from "./Icons";

const LanguageToggle = ({ lang, setLang, t }) => {
  const toggleLang = () => {
    const newLang = lang === "en" ? "th" : "en";
    setLang(newLang);
    localStorage.setItem("appLang", newLang);
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
      <button
        onClick={toggleLang}
        className="text-white p-1 rounded-lg hover:bg-red-800 transition-colors btn-hover flex-shrink-0"
        title={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
        aria-label={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
      >
        <LanguageIcon className="w-7 h-7 md:w-8 md:h-8" />
      </button>
    </div>
  );
};

export default LanguageToggle;
