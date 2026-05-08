// src/pages/LanguageListPage.jsx
// ===============================
// Enhanced with search and A-Z navigation for faster browsing

import React, { useState, useRef } from "react";
import LanguageCard from "../components/LanguageCard";
import { getLanguageIndeterminateState } from "../utils/filterLogic";
import { Search } from "lucide-react";

const LanguageListPage = ({
  lang,
  t,
  onSelectLanguage,
  languageGroups,
  onShowQrForLanguage,
  selectedPrograms,
  onToggleLanguage,
  onHoverChange,
  userData,
  onToggleFavoriteLanguage,
  isSearchBarVisible = false,
  onToggleSearchBar,
}) => {
  // Local audio playback state for language samples
  const [playingLanguageKey, setPlayingLanguageKey] = useState(null);
  const audioRef = React.useRef(new Audio());

  // Ref for the scrollable container
  const scrollContainerRef = React.useRef(null);

  // Search state for filtering languages
  const [searchQuery, setSearchQuery] = useState("");

  const getLetterJumpLabel = (letter) => {
    if (lang === "th") {
      return `ไปที่ตัวอักษร ${letter}`;
    }

    return `Jump to ${letter}`;
  };

  // Filter languages based on search query (English or Thai)
  const filteredLanguages = languageGroups.filter((group) => {
    if (!searchQuery) return true;
    const nameEn = group.displayNameEn?.toLowerCase() || "";
    const nameTh = group.displayNameTh?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return nameEn.includes(query) || nameTh.includes(query);
  });

  // Sort languages based on current app language
  const sortedLanguages = React.useMemo(() => {
    return [...filteredLanguages].sort((a, b) => {
      if (lang === "th") {
        // Sort by Thai name in Thai mode
        const nameA = a.displayNameTh || a.displayNameEn;
        const nameB = b.displayNameTh || b.displayNameEn;
        return nameA.localeCompare(nameB, "th");
      } else {
        // Sort by English name in English mode
        return a.displayNameEn.localeCompare(b.displayNameEn, "en");
      }
    });
  }, [filteredLanguages, lang]);

  // Group languages by first letter
  const groupedByLetter = React.useMemo(() => {
    const groups = {};
    sortedLanguages.forEach((group) => {
      const name =
        lang === "th"
          ? group.displayNameTh || group.displayNameEn
          : group.displayNameEn;
      const firstLetter = name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(group);
    });
    return groups;
  }, [sortedLanguages, lang]);

  // Generate dynamic alphabet (only letters with languages)
  const alphabet = React.useMemo(() => {
    return Object.keys(groupedByLetter).sort((a, b) => {
      if (lang === "th") {
        return a.localeCompare(b, "th");
      } else {
        return a.localeCompare(b, "en");
      }
    });
  }, [groupedByLetter, lang]);

  // Responsive Honeycomb Logic
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getGridConfig = (width) => {
    if (width >= 1280) return { major: 12, minor: 11 };
    if (width >= 1024) return { major: 10, minor: 9 };
    if (width >= 640) return { major: 9, minor: 8 };
    return { major: 6, minor: 5 };
  };

  const { major, minor } = getGridConfig(windowWidth);

  // Chunk alphabet into alternating rows for honeycomb interlocking
  const honeycombRows = React.useMemo(() => {
    const rawRows = [];
    let currentIndex = 0;
    let isMajorRow = true;

    // First pass: Chunk the alphabet
    while (currentIndex < alphabet.length) {
      const rowSize = isMajorRow ? major : minor;
      rawRows.push(alphabet.slice(currentIndex, currentIndex + rowSize));
      currentIndex += rowSize;
      isMajorRow = !isMajorRow;
    }

    // Second pass: Add smart padding for centering + locking
    return rawRows.map((letters, index) => {
      let placeholders = 0;

      // If not the first row, check parity against previous row
      // Same parity (Even/Even or Odd/Odd) causes stacking (bad).
      // Different parity (Even/Odd) causes interlocking (good).
      if (index > 0) {
        const prevLength = rawRows[index - 1].length;
        const currentLength = letters.length;

        if (prevLength % 2 === currentLength % 2) {
          // Same parity -> Add 1 placeholder to shift center by 0.5
          placeholders = 1;
        }
      }

      return { letters, placeholders, isMajor: index % 2 === 0 };
    });
  }, [alphabet, major, minor]);

  // Scroll to letter header when clicking alphabet navigation
  // Scroll to letter header when clicking alphabet navigation
  const scrollToLetter = (letter) => {
    // Auto-hide the search bar first
    if (onToggleSearchBar) {
      // onToggleSearchBar(false); // Valid for auto-close, removed for sticky persistence
    }

    // Scroll after a brief delay to allow layout to settle
    setTimeout(() => {
      const element = document.getElementById(`letter-header-${letter}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Build external URL for a language
  const buildLanguageExternalUrl = (group) => {
    if (!group || !group.messages || group.messages.length === 0) return null;
    const firstMsg = group.messages[0];
    const langId = group.langId || firstMsg?.langId;
    const iso3 = group.iso3 || firstMsg?.iso3;

    if (langId) {
      return `https://globalrecordings.net/en/language/${langId}`;
    }
    if (iso3) {
      return `https://5fish.mobi/${iso3}`;
    }
    return null;
  };

  // Play / stop a short language sample
  const handlePlayLanguageSample = (group) => {
    if (!group || !group.messages || group.messages.length === 0) {
      return;
    }

    const firstMessageWithSample = group.messages.find((msg) => msg.sampleUrl);
    if (!firstMessageWithSample || !firstMessageWithSample.sampleUrl) {
      return;
    }

    if (playingLanguageKey === group.stableKey) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingLanguageKey(null);
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = firstMessageWithSample.sampleUrl;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => {
        setPlayingLanguageKey(group.stableKey);
      })
      .catch((err) => {
        console.error("Error playing language sample:", err);
        setPlayingLanguageKey(null);
      });
  };

  // Clean up audio when leaving page
  React.useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  // When audio finishes, clear the "now playing" state
  React.useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => setPlayingLanguageKey(null);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Right-side Rolodex Letter Index */}
      {isSearchBarVisible && (
        <div
          className="
      fixed right-1 top-32 bottom-24 z-40
      flex flex-col items-center justify-center
      pointer-events-none
    "
        >
          <div
            className="
        pointer-events-auto
        max-h-full overflow-y-auto
        rounded-full
        bg-white/90 dark:bg-[#374151]/95
        shadow-lg border border-gray-200 dark:border-gray-600
        px-1 py-2
        flex flex-col items-center gap-0.5
      "
          >
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="
            w-7 h-7
            flex items-center justify-center
            rounded-full
            text-sm font-bold
            text-[#003366] dark:text-white
            hover:bg-brand-red hover:text-white
            active:scale-110
            transition-all duration-150
          "
                title={getLetterJumpLabel(letter)}
                aria-label={getLetterJumpLabel(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Language Cards Container with Letter Headers */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto px-1 sm:px-4 relative ${
          isSearchBarVisible ? "pr-8 sm:pr-10" : ""
        }`}
      >
        {Object.keys(groupedByLetter).length > 0 ? (
          Object.entries(groupedByLetter).map(([letter, languages]) => (
            <div key={letter} className="mb-4">
              {/* Sticky Letter Header */}
              <div
                id={`letter-header-${letter}`}
                className="sticky top-0 bg-gray-100 dark:bg-[#374151] py-1 z-20 -mx-1 px-1 sm:-mx-4 sm:px-4 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-[#003366] dark:text-white ml-2 sm:ml-4">
                  {letter}
                </h2>
              </div>

              {/* Languages for this letter */}
              <div className="space-y-2 pt-2">
                {languages.map((group) => (
                  <LanguageCard
                    key={group.stableKey}
                    id={`lang-${group.stableKey}`}
                    languageName={
                      lang === "th"
                        ? group.displayNameTh || group.displayNameEn
                        : group.displayNameEn
                    }
                    lang={lang}
                    onSelect={() => onSelectLanguage(group.stableKey)}
                    messageCount={group.count}
                    onShowQrForLanguage={() =>
                      onShowQrForLanguage(group.stableKey)
                    }
                    selectionState={getLanguageIndeterminateState(
                      group,
                      selectedPrograms,
                    )}
                    onToggle={() =>
                      onToggleLanguage(group.stableKey, group.messages)
                    }
                    setHovering={onHoverChange}
                    onPlayLanguage={() => handlePlayLanguageSample(group)}
                    isPlayingLanguage={playingLanguageKey === group.stableKey}
                    isFavorite={
                      !!userData?.favoriteLanguages?.includes(group.stableKey)
                    }
                    onToggleFavorite={() =>
                      onToggleFavoriteLanguage(group.stableKey)
                    }
                    sampleUrl={
                      group.messages.find((msg) => msg.sampleUrl)?.sampleUrl
                    }
                    externalUrl={buildLanguageExternalUrl(group)}
                    languageVideoUrl={
                      group.messages.find((msg) => msg.languageVideoUrl)
                        ?.languageVideoUrl
                    }
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">
              {t.no_languages_found || "No languages found"}
            </p>
            <p className="text-sm mt-2">
              {t.try_different_search || "Try a different search term"}
            </p>
          </div>
        )}

        {/* Spacer at bottom */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default LanguageListPage;
