import React, { useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "../components/Icons";
import ContentCard from "../components/ContentCard";
import { staticContent } from "../data/staticContent";

const SearchPage = ({
  lang,
  t,
  onSelect,
  searchTerm,
  onBack,
  onForward,
  hasPrev,
  hasNext,
  searchHistory = [],
  onClearHistory,
  onHistorySelect,
  userData,
  onToggleFavorite,
  onOpenSearch,
}) => {
  const filteredContent = useMemo(() => {
    if (!searchTerm) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    return staticContent.filter((item) => {
      const languageEn = item.languageEn?.toLowerCase() ?? "";
      const languageTh = item.langTh?.toLowerCase() ?? "";
      const titleEn = item.title_en?.toLowerCase() ?? "";
      const titleTh = item.title_th?.toLowerCase() ?? "";
      const verseEn = item.verse_en?.toLowerCase() ?? "";
      const verseTh = item.verse_th?.toLowerCase() ?? "";

      return (
        languageEn.includes(lowerSearchTerm) ||
        languageTh.includes(lowerSearchTerm) ||
        titleEn.includes(lowerSearchTerm) ||
        titleTh.includes(lowerSearchTerm) ||
        verseEn.includes(lowerSearchTerm) ||
        verseTh.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm]);

  const resultCount = filteredContent.length;

  useEffect(() => {
    if (!searchTerm && onOpenSearch) {
      onOpenSearch();
    }
  }, [searchTerm, onOpenSearch]);

  return (
    <div className="px-2 sm:px-4 pt-3 h-full overflow-y-auto">
      {/* Compact Navigation Header */}
      <div className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-white px-3 py-1.5 flex justify-between items-center mb-2 border-b border-slate-200 dark:border-slate-600">
        <button
          onClick={onBack}
          disabled={!hasPrev}
          className={`flex items-center text-sm font-semibold transition-colors ${
            hasPrev
              ? "hover:text-gray-900 dark:hover:text-gray-300"
              : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
          }`}
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
        >
          {t.forward || "Forward"}
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      <div className="flex items-center justify-center mb-2">
        <Search className="w-6 h-6 mr-2 text-brand-red dark:text-white" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          {t.search_results || "Search Results"}
        </h1>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-semibold px-1">
          {resultCount}{" "}
          {resultCount === 1 ? t.result || "Result" : t.results || "Results"}{" "}
          {t.found || "found"} {t.for_query || "for"} "{searchTerm}".
        </p>
      )}

      {resultCount > 0 ? (
        <div className="space-y-0">
          {filteredContent.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              lang={lang}
              t={t}
              onSelect={onSelect}
              showLanguageName={true}
              isFavorite={userData?.favorites?.includes(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300">
          <p>
            {t.no_results_for || "No results found for"} "{searchTerm}".
          </p>
          <p className="mt-2 text-sm">
            {t.search_tip ||
              "Try searching by title, language, or a verse snippet."}
          </p>
        </div>
      ) : (
        <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300">
          {searchHistory && searchHistory.length > 0 && (
            <div className="mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100">
                  {t.recent_searches || "Recent Searches"}
                </h2>
                <button
                  onClick={onClearHistory}
                  className="text-xs text-red-500 hover:text-red-700 underline"
                >
                  {t.clear_history || "Clear History"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => onHistorySelect(term)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <hr className="my-4 border-gray-200" />
            </div>
          )}

          <p>
            {t.search_prompt ||
              "Please use the Search box above to find any one of our"}{" "}
            {staticContent.length}{" "}
            {staticContent.length === 1
              ? t.message || "message"
              : t.messages || "messages"}
            !
          </p>
        </div>
      )}

      <div className="h-12"></div>
    </div>
  );
};

export default SearchPage;
