import React, { useMemo } from "react";
import ContentCard from "../components/ContentCard";
import { ChevronLeft, ChevronRight } from "../components/Icons";

const ACCENT_COLOR_CLASS = "text-brand-red";

const MessagesByLanguagePage = ({
  lang,
  t,
  selectedLanguageKey,
  onBack,
  onForward,
  hasPrev,
  hasNext,
  onSelectMessage,
  currentMessageList,
  languageGroups,
  pageStack,
  selectedPrograms,
  onToggleProgram,
  onShowQrForMessage,
  userData,
  onToggleFavorite,
}) => {
  const languageDisplayName = useMemo(() => {
    const group = languageGroups.find(
      (g) => g.stableKey === selectedLanguageKey,
    );
    if (!group) return selectedLanguageKey;
    return lang === "en" ? group.displayNameEn : group.displayNameTh;
  }, [lang, selectedLanguageKey, languageGroups]);

  const languageMessageCount = useMemo(() => {
    const group = languageGroups.find(
      (g) => g.stableKey === selectedLanguageKey,
    );
    if (!group) return currentMessageList?.length || 0;
    return group.count ?? currentMessageList?.length ?? 0;
  }, [languageGroups, selectedLanguageKey, currentMessageList]);

  const languageExternalUrl = useMemo(() => {
    const group = languageGroups.find(
      (g) => g.stableKey === selectedLanguageKey,
    );
    if (!group || !group.messages || group.messages.length === 0) {
      return null;
    }

    const firstMsg = group.messages[0];
    const langId = group.langId || firstMsg.langId;
    const iso3 = firstMsg.iso3;

    if (langId) {
      return `https://globalrecordings.net/en/language/${langId}`;
    }

    if (iso3) {
      return `https://5fish.mobi/${iso3}`;
    }

    return null;
  }, [languageGroups, selectedLanguageKey]);

  const [playingSampleId, setPlayingSampleId] = React.useState(null);
  const audioRef = React.useRef(new Audio());

  const handlePlaySample = (item) => {
    if (playingSampleId === item.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingSampleId(null);
      return;
    }

    if (item.sampleUrl) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = item.sampleUrl;

      audioRef.current
        .play()
        .then(() => {
          setPlayingSampleId(item.id);
        })
        .catch((e) => {
          console.error("Error playing sample:", e);
          console.error("Sample URL:", item.sampleUrl);
          setPlayingSampleId(null);
        });

      audioRef.current.onended = () => setPlayingSampleId(null);
    }
  };

  React.useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  if (!currentMessageList || currentMessageList.length === 0) {
    return (
      <div className="px-1 sm:px-4 pt-4">
        <h1 className={`text-lg font-semibold mb-2 ${ACCENT_COLOR_CLASS}`}>
          {languageDisplayName}
        </h1>
        <p className="text-sm text-slate-600">
          {t.no_messages_for_language ||
            "No messages available for this language yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-1 sm:px-4 pt-4">
      {/* Compact Navigation Bar */}
      <div className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-white px-3 py-1 flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-slate-600">
        <button
          onClick={onBack}
          disabled={!hasPrev}
          className={`flex items-center text-sm font-semibold transition-colors ${
            hasPrev
              ? "hover:text-gray-900 dark:hover:text-gray-300"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
          title={t.back || "Back"}
          aria-label={t.back || "Back"}
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          {t.back || "Back"}
        </button>

        <button
          onClick={onForward}
          disabled={!hasNext}
          className={`flex items-center text-sm font-semibold transition-colors ${
            hasNext
              ? "hover:text-gray-900 dark:hover:text-gray-300"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
          title={t.forward || "Forward"}
          aria-label={t.forward || "Forward"}
        >
          {t.forward || "Forward"}
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Compact Page Header */}
      <div className="px-3 pt-2 pb-1.5 border-b border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          {languageExternalUrl ? (
            <button
              type="button"
              onClick={() =>
                window.open(
                  languageExternalUrl,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className={`text-lg font-semibold ${ACCENT_COLOR_CLASS} dark:text-white hover:underline hover:decoration-solid focus:outline-none focus:ring-2 focus:ring-brand-red rounded-sm`}
              title={
                t.open_language_on_grn || "Open this language on GRN / 5fish"
              }
            >
              {languageDisplayName}
            </button>
          ) : (
            <div
              className={`text-lg font-semibold ${ACCENT_COLOR_CLASS} dark:text-white`}
            >
              {languageDisplayName}
            </div>
          )}

          <div className="text-sm text-slate-500 dark:text-slate-400">
            ({languageMessageCount}{" "}
            {languageMessageCount === 1
              ? t.message || "message"
              : t.messages || "messages"}
            )
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 px-0 py-1.5">
        {currentMessageList.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            lang={lang}
            t={t}
            onSelect={onSelectMessage}
            showLanguageName={false}
            isSelected={selectedPrograms.includes(item.id)}
            onToggle={() =>
              onToggleProgram(item.id, selectedLanguageKey, currentMessageList)
            }
            isPlayingSample={playingSampleId === item.id}
            onPlaySample={() => handlePlaySample(item)}
            onShowQrForMessage={() =>
              onShowQrForMessage(item, languageDisplayName)
            }
            isFavorite={userData?.favorites?.includes(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        ))}
        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default MessagesByLanguagePage;
