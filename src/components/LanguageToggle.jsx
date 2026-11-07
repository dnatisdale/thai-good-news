import React from "react";
import { LanguageIcon } from "./Icons";

const LanguageToggle = ({ lang, setLang, t }) => {
  const toggleLang = () => {
    const newLang = lang === "en" ? "th" : "en";
    setLang(newLang);
    localStorage.setItem("appLang", newLang);
  };

  return (
    <div className="flex items-center flex-shrink-0">
      <button
        onClick={toggleLang}
        className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover flex-shrink-0"
        title={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
        aria-label={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
      >
        <LanguageIcon className="w-[26px] h-[26px] md:w-[28px] md:h-[28px]" />
      </button>
    </div>
  );
};

export default LanguageToggle;
