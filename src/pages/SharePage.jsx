import React from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "../components/Icons";
import fiveFishLogo from "../assets/5fish-trans-logo.png";

const SharePage = ({ lang, t, onBack, onForward, hasPrev, hasNext }) => {
  const handleNativeShare = async () => {
    const urlString = `${window.location.origin}/listen`;
    const shareData = {
      title: t.app_name || "Thai: Good News",
      text: `${t.share_app_text || "Check out this app for Good News messages in multiple languages!"}\n\n${urlString}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert(t.link_copied || "Link copied to clipboard!");
    }
  };

  const handleMailShare = () => {
    const appUrl = "https://thai-good-news.netlify.app/listen";
    const defaultSubject = "A great tool for sharing Jesus in Thailand (100+ languages) \uD83D\uDE4C\uD83C\uDFFC\uD83C\uDDF9\uD83C\uDDED";
    const emailSubject = encodeURIComponent(t.share_email_subject || defaultSubject);
    
    const defaultBody = `Greetings!\n\nA great tool for sharing Jesus in Thailand: Thai Good News. It lets someone hear the Good News in Thai and 100+ languages spoken in Thailand, even if you don't speak their language.\n\nTry it here:\n${appUrl}\n\nQuestions/feedback: Kow-D@globalrecordings.net\n\nSent via the Thai Good News App \uD83C\uDDF9\uD83C\uDDED\nGlobal Recordings Network • 5fish.mobi`;
    
    const emailBodyText = t.share_email_body ? t.share_email_body.replace("{{appUrl}}", appUrl) : defaultBody;
    const emailBody = encodeURIComponent(emailBodyText);
    
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleCopyLink = () => {
    const appUrl = "https://thai-good-news.netlify.app";
    navigator.clipboard.writeText(appUrl)
      .then(() => alert(t.link_copied || "Link copied to clipboard!"))
      .catch((err) => {
        console.error("Could not copy link:", err);
        alert(t.copy_failed || "Could not copy link");
      });
  };

  return (
    <div className="p-4 pt-8 h-full overflow-y-auto">
      {/* Navigation Header */}
      <div className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-white px-4 py-2 flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-600">
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

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center justify-center">
        <ExternalLink className="w-8 h-8 mr-3 text-brand-red dark:text-white" />
        {t.share || "Share"}
      </h1>

      <div className="max-w-lg mx-auto space-y-4">
        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
        >
          <span className="text-lg">{t.copy_link || "Copy App Link"}</span>
        </button>

        {/* Share App Button */}
        <button
          onClick={handleNativeShare}
          className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
        >
          <span className="text-lg">{t.share_app || "Share App"}</span>
        </button>

        {/* Share via Email Button */}
        <button
          onClick={handleMailShare}
          className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
        >
          <span className="text-lg">{t.copy_for_email || "Share via Email"}</span>
        </button>

        {/* LinkTree Button */}
        <a
          href="https://linktr.ee/Thai.Good.News"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
        >
          <span className="text-lg">Share on LinkTree</span>
        </a>

        {/* LINE Button */}
        <a
          href="https://line.me/R/ti/p/@391haoyo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold py-4 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center"
        >
          <span className="text-lg">Share on LINE</span>
        </a>

        {/* 5fish Website Button */}
        <a
          href="https://5fish.mobi/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center mt-8"
        >
          <img src={fiveFishLogo} alt="5fish" className="w-8 h-8 mr-3 object-contain invert dark:invert-0" />
          <span className="text-lg">{t["5fish website"] || "5fish Website"}</span>
        </a>
      </div>
    </div>
  );
};

export default SharePage;
