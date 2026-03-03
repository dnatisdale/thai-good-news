import React from "react";
import { ChevronLeft, ChevronRight, SignLanguage } from "../components/Icons";

const SignLanguagePage = ({ lang, t, onBack, onForward, hasPrev, hasNext }) => {
  return (
    <div className="p-4 pt-8 h-full flex flex-col items-center">
      {/* Navigation Header */}
      <div className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-white px-4 py-2 flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-600 w-full rounded-lg">
        <button
          onClick={onBack}
          disabled={!hasPrev}
          className={`flex items-center text-base font-semibold transition-colors ${
            hasPrev
              ? "hover:text-gray-900 dark:hover:text-gray-300"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {t.back || "Back"}
        </button>
        <button
          onClick={onForward}
          disabled={!hasNext}
          className={`flex items-center text-base font-semibold transition-colors ${
            hasNext
              ? "hover:text-gray-900 dark:hover:text-gray-300"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {t.forward || "Forward"}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
        <div className="flex items-center gap-3 mb-6">
            <SignLanguage className="w-8 h-8 text-brand-red dark:text-white" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t.sign_language || "Sign Language Video"}
            </h2>
        </div>

        {/* Video Player */}
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-inner flex justify-center aspect-video relative">
            <video 
                controls 
                controlsList="nodownload" 
                className="w-full h-full object-contain"
                poster="/logo.png"
            >
                <source src="/videos/Thai_Bible_Sign_Lang.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          {lang === "th" 
            ? "วิดีโอนี้สามารถรับชมแบบออฟไลน์ได้โดยไม่ต้องใช้อินเทอร์เน็ต" 
            : "This video is available for offline viewing without an internet connection."}
        </p>
      </div>
    </div>
  );
};

export default SignLanguagePage;
