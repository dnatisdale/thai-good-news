import React from "react";
import { ChevronLeft, ChevronRight, SignLanguage } from "../components/Icons";

const SignLanguagePage = ({ lang, t, onBack, onForward, hasPrev, hasNext }) => {
  return (
    <div className="p-4 pt-8 h-full flex flex-col items-center justify-center">
      {/* Navigation Header */}
      <div className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-white px-4 py-2 flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-600 w-full rounded-lg">
        <button
          onClick={onBack}
          disabled={!hasPrev}
          className={`flex items-center text-base font-semibold transition-colors ${
            hasPrev ? "hover:text-gray-900 dark:hover:text-gray-300" : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {t.back || "Back"}
        </button>
        <button
          onClick={onForward}
          disabled={!hasNext}
          className={`flex items-center text-base font-semibold transition-colors ${
            hasNext ? "hover:text-gray-900 dark:hover:text-gray-300" : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {t.forward || "Forward"}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex-grow flex flex-col items-center justify-center">
        <SignLanguage className="w-24 h-24 text-brand-red dark:text-white mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {t.sign_language || "Sign Language"}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {lang === "th"
            ? "เนื้อหาภาษามือกำลังจะมาเร็วๆ นี้!"
            : "Sign Language content is coming soon!"}
        </p>
      </div>
    </div>
  );
};

export default SignLanguagePage;
