import React, { useState, useMemo, useEffect } from "react";
import html2canvas from "html2canvas";
import ContentView from "./pages/ContentView";
import { useFirebase } from "./hooks/useFirebase";
import { useOfflineStorage } from "./hooks/useOfflineStorage"; // 👈 IMPORTED
import {
  precacheAllAudioSamples,
  getPlayableTrackUrl,
  playSampleWithOfflineSupport,
} from "./utils/audioHelper";
import { BUILD_INFO } from "./buildInfo";
import { i18n } from "./i18n";
import { useContentFilter } from "./hooks/useContentFilter";
import { getFilteredMessages } from "./utils/filterLogic";
import {
  Home,
  Search,
  Heart,
  Pen,
  Settings,
  Menu,
  X,
  ExternalLink,
  Download,
  CheckCircle,
  Loader,
  YouTubeColor,
  YouTubeOff,
  Upload,
  Zap,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Languages, // ✅ NEW
  SignLanguage, // NEW
  MessageSquare, // NEW
  Music,
  Globe,
  AlphabetIndex,
  Copy, // NEW
  Share2, // NEW
} from "./components/Icons";

import { staticContent } from "./data/staticContent";
import QRCodeDisplay from "./components/QRCodeDisplay";
import { QRCodeSVG } from "qrcode.react";
import AppLogo from "./assets/logo.png";
import BannerLogo from "./assets/logo.png";
import { jsPDF } from "jspdf";
import { formatContentItem } from "./utils/contentFormatter";
import LanguageToggle from "./components/LanguageToggle";
import FloatingUtilityBar from "./components/FloatingUtilityBar";
import AudioPlayer from "./components/AudioPlayer";
import LanguageListPage from "./pages/LanguageListPage";
import SelectedContentPage from "./pages/SelectedContentPage";

import MessagesByLanguagePage from "./pages/MessagesByLanguagePage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import NotesPage from "./pages/NotesPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import ImportPage from "./pages/ImportPage";
import FeedbackPage from "./pages/FeedbackPage";
import SignLanguagePage from "./pages/SignLanguagePage";
import SharePage from "./pages/SharePage"; // NEW
import SelectionBadge from "./components/SelectionBadge";
import UpdateNotification from "./components/UpdateNotification";
// import SettingsPage from "./pages/SettingsPage"; // REMOVED
import StorageManagementPage from "./pages/StorageManagementPage"; // NEW
import InstallBanner from "./components/InstallBanner"; // NEW: Install Banner

// --- CONSTANTS ---
const PRIMARY_COLOR_CLASS = "bg-gradient-to-r from-brand-red to-brand-red-dark";
const ACCENT_COLOR_CLASS = "text-brand-red";
const DEFAULT_FONT_SIZE = "16px";

export default function App() {
  // --- Swipe to Close Sidebar Logic ---
  const [customBackHandler, setCustomBackHandler] = useState(null); // NEW: Allow pages to intercept Back

  // --- STATE LIFTING: Shared Offline Storage ---
  const {
    offlineTracks,
    downloadTrack,
    deleteTrack,
    clearLibrary,
    isTrackOffline,
    isTrackDownloading,
  } = useOfflineStorage();

  const touchStartRef = React.useRef(null);
  const touchStartYRef = React.useRef(null);
  const touchEndRef = React.useRef(null);
  const minSwipeDistance = 35; // Minimum distance (px) for a left swipe to close drawer

  const onTouchStart = (e) => {
    const touch = e.touches?.[0] || e.targetTouches?.[0];
    if (!touch) return;
    touchEndRef.current = null;
    touchStartRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const onTouchMove = (e) => {
    if (touchStartRef.current === null) return;
    const touch = e.touches?.[0] || e.targetTouches?.[0];
    if (!touch) return;
    touchEndRef.current = touch.clientX;

    const deltaX = touchStartRef.current - touch.clientX;
    const deltaY = Math.abs((touchStartYRef.current ?? touch.clientY) - touch.clientY);

    // Close immediately during a clear horizontal left-swipe so scrollable children don't swallow it
    if (deltaX > minSwipeDistance && deltaX > deltaY * 1.2) {
      setIsDrawerOpen(false);
      touchStartRef.current = null;
      touchStartYRef.current = null;
      touchEndRef.current = null;
    }
  };

  const onTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const endX =
      touchEndRef.current ??
      e.changedTouches?.[0]?.clientX ??
      null;

    if (endX !== null) {
      const distance = touchStartRef.current - endX;
      if (distance > minSwipeDistance) {
        setIsDrawerOpen(false);
      }
    }
    // Reset refs
    touchStartRef.current = null;
    touchStartYRef.current = null;
    touchEndRef.current = null;
  };

  // --- NEW HELPER: Combine all selected programs into a single text string ---
  const getShareableContent = () => {
    const isThai = lang === "th";

    // 1. Get the list of actual message objects based on selectedPrograms
    const filteredContent = getFilteredMessages(
      staticContent,
      selectedPrograms,
    );

    if (filteredContent.length === 0) return null;

    const divider = "━━━━━━━━━━━━━━━━";

    // 2. Map the selected programs to an array of formatted strings
    const shareableItems = filteredContent.map((item) => {
      const { languageDisplay, messageTitle, trackTitle, programNumber } =
        formatContentItem(item, lang);
      const cardUrl = `https://5fi.sh/T${item.id}`;

      // Get verse text and reference
      const verseText = isThai ? item.verse_th : item.verse_en;
      let verseQuote = "";
      let verseRef = "";
      if (verseText) {
        const match = verseText.match(/^([^\.]+\d+:\d+)\s+(.+)$/);
        if (match) {
          verseRef = match[1];
          verseQuote = match[2];
        } else {
          verseQuote = verseText;
        }
      }

      // Format each message with decorative lines
      return `${divider}\n${languageDisplay} | ${messageTitle} | ${
        isThai ? "ข้อความ" : "Message"
      } #${programNumber}\n${divider}\n\n${
        isThai ? "ฟัง • แบ่งปัน • ดาวน์โหลด" : "Listen • Share • Download"
      }\nListen on 5fish: ${cardUrl}\n\n${
        verseQuote ? `${verseQuote}  ${verseRef}\n` : ""
      }`;
    });

    // 3. Combine the items with footer
    const combinedText = [
      ...shareableItems,
      `${divider}\n${
        isThai
          ? "ค้นพบภาษามากกว่า 6,000+ ภาษาที่ 5fish.mobi หรือ globalrecordings.net\nส่งความคิดเห็นไปที่: Thai@globalrecordings.net"
          : "Discover 6,000+ languages at 5fish.mobi or globalrecordings.net\nEmail any feedback to: Thai@globalrecordings.net"
      }`,
    ].join("\n\n");

    return combinedText;
  };

  // --- NEW: PDF Export (Browser Native Print) ---
  const handleDownloadSelectedPDF = () => {
    const filteredContent = getFilteredMessages(
      staticContent,
      selectedPrograms,
    );
    if (filteredContent.length === 0) {
      alert(t.select_content_first || "Please select some content first!");
      return;
    }

    const isThai = lang === "th";
    const titleText = isThai ? "รายการข้อความที่เลือก" : "Selected Messages";

    // --- NEW: Custom Filename with Timestamp ---
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now
      .toTimeString()
      .split(" ")[0]
      .replace(/:/g, "-")
      .slice(0, 5); // HH-mm
    const filename = `TGN_Selected_Messages_${dateStr}_${timeStr}`;
    const dateText = now.toLocaleString(isThai ? "th-TH" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Generate HTML list items
    const listItemsHtml = filteredContent
      .map((item, index) => {
        const { languageDisplay, messageTitle, trackTitle, programNumber } =
          formatContentItem(item, lang);
        const cardUrl = `https://5fi.sh/T${item.id}`;

        return `
        <div class="message-item">
          <div class="item-header">
            <span class="item-index">${index + 1}.</span>
            <span class="item-lang">[${languageDisplay}]</span>
            <span class="item-title">${messageTitle}</span>
          </div>
          <div class="item-track">${trackTitle}</div>
          <div class="item-meta">
            Message #: ${programNumber} | <a href="${cardUrl}">${cardUrl}</a>
          </div>
        </div>
      `;
      })
      .join("");

    const printHtml = `
      <html>
        <head>
          <title>${filename}</title>
          <style>
            @page {
              size: A4;
              margin: 0.75in; /* --- CHANGED: 0.75in Margins --- */
            }
            body {
              font-family: "Sarabun", "Prompt", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 0; /* Padding handled by @page */
            }
            /* --- NEW: Header Layout with Logo --- */
            .print-header {
              display: flex;
              align-items: center;
              border-bottom: 2px solid #eee;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header-logo {
              height: 50px;
              margin-right: 20px;
            }
            h1 {
              color: #003366; /* --- CHANGED: Thai Blue --- */
              margin: 0;
              font-size: 24px;
            }
            .date {
              color: #666;
              font-size: 0.9em;
              margin-left: auto; /* Push to right */
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              font-weight: bold;
            }
            .print-btn:hover {
              background: #b32d2d;
            }
          </style>
        </head>
        <body>
          <div class="control-bar no-print">
             <button class="print-btn" onclick="window.print()">🖨️ ${
               isThai ? "พิมพ์ / บันทึกเป็น PDF" : "Print / Save as PDF"
             }</button>
             <p style="margin-top:10px; font-size:0.9em; color:#666;">
               ${
                 isThai
                   ? "เลือก 'บันทึกเป็น PDF' ในหน้าต่างพิมพ์"
                   : "Choose 'Save as PDF' in the print destination."
               }
             </p>
          </div>

          <h1>${titleText}</h1>
          <div class="date">${dateText}</div>
          
          <div class="content">
            ${listItemsHtml}
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(t.allow_popups || "Please allow pop-ups to print.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  };
  // --- NEW: Filtered Message Helper ---
  const getSelectedContent = () => {
    // 1. Get the list of actual message objects based on selectedPrograms
    const filteredContent = getFilteredMessages(
      staticContent,
      selectedPrograms,
    );

    if (filteredContent.length === 0) {
      alert(
        t.please_select_messages ||
          "Please select some messages first by checking the boxes next to them!",
      );
      return null;
    }

    return filteredContent;
  };

  // --- NEW: Share Filtered Content (TEXT LIST) ---
  const handleShareSelected = async () => {
    // 1. Get the combined text list
    const contentToShare = getShareableContent();
    if (!contentToShare) {
      alert(t.select_content_first || "Please select some content first!");
      return;
    }

    const isThai = lang === "th";
    const shareTitle = isThai
      ? "ข่าวดี — รายการที่เลือก"
      : "Thai — Good News - Selected List";

    try {
      if (navigator.share) {
        // Use the native share sheet for the combined text
        await navigator.share({
          title: shareTitle,
          text: contentToShare,
        });
      } else {
        // Fallback: Copy to clipboard if Web Share API is not available
        await navigator.clipboard.writeText(contentToShare);
        alert(
          t.list_copied_to_clipboard || "Selected list copied to clipboard!",
        );
      }
    } catch (error) {
      console.error("Sharing selected list failed:", error);
      // Ignore user cancellation (AbortError)
      if (error.name !== "AbortError") {
        alert(t.share_failed || "Sharing failed or was cancelled.");
      }
    }
  };

  // --- NEW: Copy Filtered Content (TEXT LIST) ---
  const handleCopySelected = async () => {
    // 1. Get the combined text list
    const contentToCopy = getShareableContent();
    if (!contentToCopy) {
      alert(t.select_content_first || "Please select some content first!");
      return;
    }

    try {
      // Copy the text list directly to the clipboard
      await navigator.clipboard.writeText(contentToCopy);
      alert(t.list_copied_to_clipboard || "Selected list copied to clipboard!");
    } catch (error) {
      console.error("Copying selected list failed:", error);
      alert(t.copy_failed || "Failed to copy selected list.");
    }
  };

  // --- NEW: Download/Print Filtered Content (single language) ---
  // --- Download/Print SELECTED QR CARDS (3x3 grid, shrunk) ---
  const handleDownloadSelected = () => {
    const selectedContent = getSelectedContent();
    if (!selectedContent) return;

    // group into pages of 9 items
    const pages = [];
    for (let i = 0; i < selectedContent.length; i += 9) {
      pages.push(selectedContent.slice(i, i + 9));
    }

    const isThai = lang === "th";

    const htmlPages = pages
      .map((pageItems) => {
        const cardsHtml = pageItems
          .map((item) => {
            const title = isThai
              ? item.title_th || "ไม่มีชื่อ"
              : item.title_en || "Untitled";
            const verse = isThai ? item.verse_th || "" : item.verse_en || "";
            const languageDisplay = isThai
              ? item.langTh || ""
              : item.languageEn || "";
            const readMoreLabel = isThai
              ? "ฟัง แบ่งปัน ดาวน์โหลดที่:"
              : "Listen, Share, Download at:";
            const cardUrl = `https://5fi.sh/T${item.id}`;

            // simple QR image (200x200) for the card
            const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              cardUrl,
            )}`;

            return `
              <div class="qr-card">
                <div class="qr-header">
                  <div class="logo-wrap">
                    <img src="${AppLogo}" class="logo" />
                  </div>
                  <div class="header-text">
                    <div class="language">${languageDisplay}</div>
                    <div class="series">${title}</div>
                    <div class="program">Message # ${item.id}</div>
                  </div>
                </div>

          <!-- ✅ QR ABOVE VERSE -->
          <div class="qr-wrap">
            <img src="${qrImg}" class="qr-img" />
          </div>

          <!-- ✅ VERSE UNDER QR -->
          <div class="verse">
            ${verse}
          </div>

          <div class="read-more">
            ${readMoreLabel}<br />
            <span class="url">${cardUrl}</span>
          </div>
          <div class="footer">${
            t.scan_qr_tip ||
            "Scan the QR code or visit the link to access this content."
          }</div>
        </div>
      `;
          })
          .join("");

        return `
          <div class="page">
            ${cardsHtml}
          </div>
        `;
      })
      .join("");

    const printHtml = `
      <html>
        <head>
          <title>${t.export_title || "QR Cards"}</title>
          <style>
            @page {
              size: A4;
              margin: 0.3in; /* Reduced margin */
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              margin: 0;
              padding: 0.25in;
              background: #f3f4f6;
            }
            /* HIDE ELEMENTS WHEN PRINTING */
            @media print {
              .no-print { display: none !important; }
              body { background: white; padding: 0; }
            }
            .page {
              page-break-after: always;
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-template-rows: repeat(3, 1fr); /* Force 3 rows */
              gap: 0.2in; /* Reduced gap */
              height: 10.8in; /* Fix height to ensure 3 rows fit */
              align-content: start;
              background: white;
              padding: 0;
            }
            .page:last-child {
              page-break-after: auto;
            }
            .qr-card {
              border-radius: 12px;
              border: 1px solid #eee; /* Light border for definition */
              padding: 5px 5px 8px; /* Reduced padding */
              text-align: center;
              background: #ffffff;
              break-inside: avoid;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 3.3in; /* Fixed height for 3 rows */
            }
            .qr-header {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 4px;
            }
            .logo-wrap .logo {
              width: 20px;
              height: 20px;
            }
            .header-text {
              margin-left: 6px;
              text-align: center;
            }
            .language {
              font-size: 11px;
              font-weight: 700;
              color: #111827;
              line-height: 1.1;
            }
            .series {
              font-size: 10px;
              font-weight: 700;
              color: #CC3333;
              line-height: 1.1;
            }
            .program {
              font-size: 8px;
              color: #4B5563;
            }
            .verse {
              font-size: 8px;
              font-style: italic;
              color: #374151;
              margin: 4px 4px;
              min-height: 24px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .qr-wrap {
              background: #F9FAFB;
              border-radius: 8px;
              padding: 4px;
              margin-bottom: 4px;
              display: flex;
              justify-content: center;
            }
            .qr-img {
              width: 90px;
              height: 90px;
            }
            .read-more {
              font-size: 7px;
              color: #4B5563;
              margin-bottom: 2px;
              line-height: 1.1;
            }
            .url {
              color: #CC3333;
              word-break: break-all;
              font-weight: 600;
            }
            .footer {
              font-size: 6px;
              color: #9CA3AF;
            }
            /* Close Button Style */
            .control-bar {
              text-align: center;
              margin-bottom: 20px;
              padding: 10px;
              background: #333;
              color: white;
              border-radius: 8px;
            }
            .close-btn {
              background: #CC3333;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="control-bar no-print">
             <p>Printing may not start automatically on some devices.</p>
             <button class="close-btn" onclick="window.print()">🖨️ Print Cards</button>
             <button class="close-btn" onclick="window.close()" style="background:#555; margin-left:10px;">Close Window</button>
          </div>

          ${htmlPages}

          <script>
            window.onload = function() {
              // Attempt to print automatically
              setTimeout(function() {
                window.print();
              }, 500); // Small delay to ensure images render
              
              // ❌ REMOVED THE AUTO-CLOSE TIMEOUT
              // The user must now close the window manually.
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    // Mobile browser pop-up blocker check
    if (!printWindow) {
      alert("Please allow pop-ups to print your cards.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  // --- State Management ---
  const initialLang = localStorage.getItem("appLang") || "th";
  const initialFontSize =
    localStorage.getItem("appFontSize") || DEFAULT_FONT_SIZE;

  const [lang, setLang] = useState(initialLang);
  const t = i18n[lang]; // Restored translation object
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [pageStack, setPageStack] = useState([{ name: "Home" }]);
  const mainScrollRef = React.useRef(null); // 👈 NEW: main scroll container
  const mainAudioRef = React.useRef(null); // 👈 Persistent main audio element ref
  const [track, setTrack] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isHoveringContent, setIsHoveringContent] = useState(false);
  const [isAudioMinimized, setIsAudioMinimized] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangSearchBarVisible, setIsLangSearchBarVisible] = useState(false); // start hidden; toggle with header button

  // --- NEW: Search History State ---
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToSearchHistory = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    setSearchHistory((prev) => {
      // Remove if exists, then add to front
      const filtered = prev.filter((item) => item !== cleanTerm);
      return [cleanTerm, ...filtered].slice(0, 10); // Keep max 10
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // --- Audio Player Minimize Toggle ---
  const toggleAudioMinimize = () => {
    setIsAudioMinimized((prev) => !prev);
  };

  // --- Theme State (Dark Mode) ---
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });
  // Apply theme to html element (Tailwind + CSS variables)
  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      // Tailwind dark:
      root.classList.add("dark");
      // CSS variables dark:
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.removeAttribute("data-theme");
    }

    // Persist preference
    localStorage.setItem("theme", theme);
    // Compatibility with the patch guide key:
    localStorage.setItem("darkMode", String(theme === "dark"));
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false); // Install Prompt state
  const [isInstallClicked, setIsInstallClicked] = useState(false); // Hide install button immediately on click
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState(null);
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [isTopUpdateBannerDismissed, setIsTopUpdateBannerDismissed] =
    useState(false);
  const waitingWorkerRef = React.useRef(null);
  // --- NEW FUNCTION: navigateToHome ---
  const navigateToHome = () => {
    // Reset to a fresh Home page
    setPageStack([{ name: "Home", key: Date.now() }]);

    // Close the global search overlay and clear any old search text
    setIsSearchOpen(false);
    setSearchTerm("");

    // Scroll the main content area back to the very top
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Extra safety: also scroll the window (in case browser uses window scroll)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --------------------------------------------------------------------------
  // *** FIX: Changed from array to object destructuring and passed  // --- HOOKS ---
  const { isAuthReady, userId, userData, saveUserData, error, logOut, signUp } =
    useFirebase(setLang); // Modified to include signUp
  // const { offlineTracks } = useOfflineStorage(); // REMOVED: Managed at top level

  // --- NEW: Toggle Favorite (Message) ---
  const handleToggleFavorite = (id) => {
    if (!userData) return;
    const currentFavorites = userData.favorites || [];
    let newFavorites;
    if (currentFavorites.includes(id)) {
      newFavorites = currentFavorites.filter((favId) => favId !== id);
    } else {
      newFavorites = [...currentFavorites, id];
    }
    saveUserData({ ...userData, favorites: newFavorites });
  };

  // --- NEW: Toggle Favorite Language ---
  const favoriteLanguagesRef = React.useRef([]);

  useEffect(() => {
    favoriteLanguagesRef.current = Array.isArray(userData?.favoriteLanguages)
      ? userData.favoriteLanguages
      : [];
  }, [userData?.favoriteLanguages]);

  // --- NEW: Toggle Favorite Language ---
  const handleToggleFavoriteLanguage = (stableKey) => {
    if (!userData || !stableKey) return;

    const clickedKey = String(stableKey);
    const currentFavorites = Array.isArray(favoriteLanguagesRef.current)
      ? favoriteLanguagesRef.current
      : [];

    const alreadyFavorite = currentFavorites.some(
      (key) => String(key) === clickedKey,
    );

    const newFavorites = alreadyFavorite
      ? currentFavorites.filter((key) => String(key) !== clickedKey)
      : [...currentFavorites, stableKey];

    favoriteLanguagesRef.current = newFavorites;

    saveUserData({
      ...userData,
      favoriteLanguages: newFavorites,
    });
  };

  // NEW: Global Search State
  const [searchTerm, setSearchTerm] = useState("");
  // --- NEW: Content Filter Logic ---
  const {
    selectedLangs,
    selectedPrograms,
    handleLanguageToggle,
    handleProgramToggle,
    clearSelection,
  } = useContentFilter();

  // --- Consolidated Share QR & Actions Modal ---
  const ShareQrModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    url,
    footerText,
    item,
    externalUrl,
    videoUrl,
  }) => {
    const [copiedFeedback, setCopiedFeedback] = useState(false);

    if (!isOpen) return null;

    const isOffline = item ? isTrackOffline(item.id) : false;
    const isDownloading = item ? isTrackDownloading(item.id) : false;
    const openTargetUrl = externalUrl || url;

    const handleShareOrCopy = async () => {
      const shareTitle =
        lang === "th" ? `ข่าวดี — ${subtitle}` : `Thai Good News — ${subtitle}`;
      const shareText = `${subtitle}\n${url}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: url,
          });
          return;
        } catch (err) {
          if (err.name === "AbortError") return;
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopiedFeedback(true);
        setTimeout(() => setCopiedFeedback(false), 2500);
      } catch (e) {
        alert(
          lang === "th"
            ? "คัดลอกลิงก์ไม่สำเร็จ"
            : "Failed to copy link to clipboard.",
        );
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-[#1e293b] p-5 rounded-xl shadow-2xl max-w-sm w-full relative border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-800 dark:text-white font-bold"
            aria-label={lang === "th" ? "ปิด" : "Close"}
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xs text-gray-500 dark:text-gray-300 text-center pr-6 mb-0.5">
            {title}
          </h2>

          {/* Subtitle (Language Name or Message Title) */}
          <h3 className="text-lg font-bold text-brand-red dark:text-white mb-3 text-center pr-4 leading-snug">
            {subtitle}
          </h3>

          {/* --- QR CODE DISPLAY --- */}
          <div className="flex justify-center mb-3 p-3 bg-white rounded-xl shadow-inner border border-gray-100">
            <QRCodeDisplay
              url={url}
              size={170}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>

          {/* --- CONSOLIDATED ACTION BUTTONS --- */}
          <div className="space-y-2 mt-3">
            {/* 1. Save Offline to PWA Library */}
            {item && (item.sampleUrl || item.trackDownloadUrl) && (
              <button
                type="button"
                onClick={() =>
                  !isOffline && !isDownloading && downloadTrack(item)
                }
                disabled={isOffline || isDownloading}
                className={`w-full py-2.5 px-3 rounded-lg font-bold text-sm text-white flex items-center justify-center gap-2 shadow transition-all ${
                  isOffline
                    ? "bg-amber-500 cursor-default"
                    : isDownloading
                      ? "bg-gray-400 cursor-wait"
                      : "bg-brand-red hover:bg-red-800 active:scale-95"
                }`}
              >
                {isOffline ? (
                  <>
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>
                      {t?.downloaded ||
                        (lang === "th"
                          ? "บันทึกออฟไลน์แล้ว"
                          : "Saved in Offline Library")}
                    </span>
                  </>
                ) : isDownloading ? (
                  <>
                    <Loader className="w-5 h-5 shrink-0 animate-spin" />
                    <span>
                      {t?.downloading ||
                        (lang === "th"
                          ? "กำลังดาวน์โหลด..."
                          : "Downloading...")}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 shrink-0" />
                    <span>
                      {lang === "th"
                        ? "บันทึกไว้ฟังออฟไลน์ (My Library)"
                        : "Save for Offline (Library)"}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* 2. Share / Copy Link */}
            <button
              type="button"
              onClick={handleShareOrCopy}
              style={{ backgroundColor: "#003366" }}
              className="w-full py-2.5 px-3 rounded-lg font-bold text-sm text-white hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 shadow transition-all"
            >
              <Share2 className="w-5 h-5 shrink-0" />
              <span>
                {copiedFeedback
                  ? lang === "th"
                    ? "✓ คัดลอกลิงก์แล้ว!"
                    : "✓ Link Copied!"
                  : lang === "th"
                    ? "แชร์ / คัดลอกลิงก์"
                    : "Share / Copy Link"}
              </span>
            </button>

            {/* 3. YouTube & 5fish / GRN External Links */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <YouTubeColor className="w-5 h-5 shrink-0" />
                  <span>{lang === "th" ? "ดูวิดีโอ YouTube" : "YouTube"}</span>
                </a>
              ) : (
                <div
                  className="py-2 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-semibold text-xs flex items-center justify-center gap-1.5 opacity-60 cursor-not-allowed"
                  title={lang === "th" ? "ไม่มีวิดีโอ" : "No video available"}
                >
                  <YouTubeOff className="w-5 h-5 shrink-0" />
                  <span>{lang === "th" ? "ไม่มีวิดีโอ" : "No Video"}</span>
                </div>
              )}

              {openTargetUrl && (
                <a
                  href={openTargetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>{lang === "th" ? "เปิด 5fish / GRN" : "5fish / GRN"}</span>
                </a>
              )}
            </div>
          </div>

          {/* URL under the buttons */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center break-all mt-3">
            {footerText}
            <a
              href={url}
              className="text-brand-red dark:text-red-400 underline break-all text-xs block mt-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </p>
        </div>
      </div>
    );
  };

  // --- Unified Share Modal State ---
  const [shareModalState, setShareModalState] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    url: "",
    footerText: "",
    item: null,
    externalUrl: null,
    videoUrl: null,
  });

  const handleCloseShareModal = () => {
    setShareModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleShowQrForLanguage = (stableKey) => {
    const group = languageGroups.find((g) => g.stableKey === stableKey);
    if (group) {
      const name = lang === "en" ? group.displayNameEn : group.displayNameTh;

      const firstMsg =
        group.messages.find((m) => m.sampleUrl || m.trackDownloadUrl) ||
        group.messages[0];
      const iso3 = firstMsg?.iso3 || "";
      const langId = group.langId || firstMsg?.langId;
      const url = `https://5fish.mobi/${iso3}`;
      const externalUrl = langId
        ? `https://globalrecordings.net/en/language/${langId}`
        : url;
      const videoUrl =
        group.messages.find((m) => m.languageVideoUrl || m.youtubeUrl)
          ?.languageVideoUrl ||
        group.messages.find((m) => m.youtubeUrl)?.youtubeUrl ||
        null;

      setShareModalState({
        isOpen: true,
        title:
          t?.scan_qr_to_view_messages ||
          (lang === "th"
            ? "สแกนคิวอาร์โค้ด แชร์ หรือบันทึกออฟไลน์:"
            : "Scan QR, Share, or Save Offline:"),
        subtitle: name,
        url: url,
        footerText: t?.language_qr_title || "",
        item: firstMsg || null,
        externalUrl,
        videoUrl,
      });
    }
  };

  const handleShowQrForMessage = (item, languageDisplayName) => {
    const title = lang === "en" ? item.title_en : item.title_th;
    const langName =
      languageDisplayName || (lang === "en" ? item.languageEn : item.langTh);

    // Construct URL
    let url = `https://5fish.mobi/T${item.id}`;
    if (item.shareUrl) {
      url = item.shareUrl.startsWith("http")
        ? item.shareUrl
        : `https://${item.shareUrl}`;
    }

    const videoUrl = item.youtubeUrl || item.languageVideoUrl || null;

    setShareModalState({
      isOpen: true,
      title:
        t?.scan_qr_to_download ||
        (lang === "th"
          ? "สแกนคิวอาร์โค้ด แชร์ หรือบันทึกออฟไลน์:"
          : "Scan QR, Share, or Save Offline:"),
      subtitle: `${langName} — ${title}`,
      url: url,
      footerText: "",
      item: item,
      externalUrl: url,
      videoUrl: videoUrl,
    });
  };

  // Group Messages by Language (Memoized for performance)
  const languageGroups = useMemo(() => {
    const groups = {};
    staticContent.forEach((item) => {
      const stableKey = item.stableKey; // e.g., 'Central Thai'

      // Check if the item matches the global search term
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const languageEn = item.languageEn?.toLowerCase() ?? "";
        const languageTh = item.langTh?.toLowerCase() ?? "";
        const titleEn = item.title_en?.toLowerCase() ?? "";
        const titleTh = item.title_th?.toLowerCase() ?? "";
        const verseEn = item.verse_en?.toLowerCase() ?? "";
        const verseTh = item.verse_th?.toLowerCase() ?? "";

        const matches =
          languageEn.includes(lowerSearchTerm) ||
          languageTh.includes(lowerSearchTerm) ||
          titleEn.includes(lowerSearchTerm) ||
          titleTh.includes(lowerSearchTerm) ||
          verseEn.includes(lowerSearchTerm) ||
          verseTh.includes(lowerSearchTerm);

        if (!matches) {
          return; // Skip this item if it doesn't match the search
        }
      }

      if (!groups[stableKey]) {
        groups[stableKey] = {
          stableKey,
          displayNameEn: item.languageEn,
          displayNameTh: item.langTh,
          langId: item.langId,
          count: 0,
          messages: [],
          programIds: new Set(),
        };
      }

      // --- DATA FLATTENING & CLEANUP ---
      // 1. Check if this Program ID has already been added to this group
      const progId = item.programId || item.id;
      if (groups[stableKey].programIds.has(progId)) {
        return; // SKIP duplicates (tracks)
      }

      // 2. Mark this Program ID as seen
      groups[stableKey].programIds.add(progId);

      // 3. Clean the Title (Remove "(Mxxx)" suffix)
      // Create a shallow copy to avoid mutating the original staticContent if needed,
      // but for display purposes in this list, we can modify a copy.
      const cleanedItem = { ...item };
      if (cleanedItem.title_en) {
        cleanedItem.title_en = cleanedItem.title_en
          .replace(/\s*\(M\d+\)/, "")
          .trim();
      }
      if (cleanedItem.title_th) {
        cleanedItem.title_th = cleanedItem.title_th
          .replace(/\s*\(M\d+\)/, "")
          .trim();
      }

      // 4. Add the unique, cleaned message
      groups[stableKey].count += 1;
      groups[stableKey].messages.push(cleanedItem);
    });

    // Convert object to array and sort by display name in the current language
    return Object.values(groups).sort((a, b) => {
      const nameA = lang === "en" ? a.displayNameEn : a.displayNameTh;
      const nameB = lang === "en" ? b.displayNameEn : b.displayNameTh;
      return nameA.localeCompare(nameB, lang);
    });
  }, [lang, searchTerm]); // Recalculate if language or searchTerm changes

  // Memoize the flat list of content for current language message view
  const currentMessageList = useMemo(() => {
    const currentPage = pageStack[pageStack.length - 1];
    if (currentPage.name === "MessagesByLanguage") {
      const group = languageGroups.find((g) => g.stableKey === currentPage.key);
      return group ? group.messages : [];
    }
    return [];
  }, [pageStack, languageGroups]);

  // Memoize the total flat list of content (used for navigation in message view)
  const flatContentList = useMemo(() => {
    // Only generate the full list when viewing a specific language
    const currentPage = pageStack[pageStack.length - 1];
    if (
      currentPage.name === "ContentView" &&
      currentPage.sourceList === "language"
    ) {
      // The item ID is currentPage.key. Find the group it belongs to.
      const targetItem = staticContent.find((i) => i.id === currentPage.key);
      if (!targetItem) return [];

      const targetGroup = languageGroups.find(
        (g) => g.stableKey === targetItem.stableKey,
      );
      return targetGroup ? targetGroup.messages : [];
    } else if (
      currentPage.name === "ContentView" &&
      currentPage.sourceList === "search"
    ) {
      // Re-use the search page's filtering logic
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
    }
    // Fallback for other contexts (e.g., favorites or direct content view)
    return staticContent;
  }, [pageStack, languageGroups, searchTerm]);

  // --- Navigation and State Logic ---

  const navigateTo = (pageName, key = null, sourceList = null) => {
    setPageStack((prev) => [...prev, { name: pageName, key, sourceList }]);
    setIsDrawerOpen(false);

    // Keep the search bar open when we are navigating to Search.
    // Close it for every other page.
    if (pageName !== "Search") {
      setIsSearchOpen(false);
    }

    // Always jump to the top of the main content when navigating
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear search term when navigating away from Home/Search
    if (pageName !== "Search" && pageName !== "Home") {
      setSearchTerm("");
    }
  };

  // ✅ PASTE YOUR NEW FUNCTION HERE:
  const navigateToSelectedContent = () => {
    setPageStack((prev) => [...prev, { name: "SelectedContent" }]);
    setSearchTerm(""); // Clear search just in case
    setIsDrawerOpen(false); // Close sidebar if open
    setIsSearchOpen(false); // Close search bar
  };

  const goBack = () => {
    if (customBackHandler) {
      customBackHandler();
      return;
    }

    // Leaving Search should also clear the old search text so Home is not secretly filtered.
    if (currentPage.name === "Search") {
      setSearchTerm("");
    }
    setIsSearchOpen(false);

    if (pageStack.length > 1) {
      setPageStack((prev) => prev.slice(0, -1));
    } else {
      // Safety net: If we try to go back from the root, reset to Home.
      setPageStack([{ name: "Home" }]);
    }
  };

  const goForward = () => {
    // Not used for navigation stack but kept for consistency
    console.log("Forward navigation not implemented in stack model.");
  };

  const hasPrev = pageStack.length > 1;
  const hasNext = false; // Always false in this stack implementation

  // Handler for Language Card click
  const handleSelectLanguage = (stableKey) => {
    navigateTo("MessagesByLanguage", stableKey);
  };

  // Handler for Message Card click
  // Handler for Message Card click
  const handleSelectMessage = (item, sourceList = "language") => {
    navigateTo("ContentView", item.id, sourceList);
  };

  // Handler for Content View navigation (Next/Prev)
  const handleNextPrevMessage = (direction) => {
    const currentPage = pageStack[pageStack.length - 1];
    if (currentPage.name !== "ContentView") return;

    const currentItemId = currentPage.key;
    const currentIndex = flatContentList.findIndex(
      (item) => item.id === currentItemId,
    );

    let newIndex;
    if (direction === "next" && currentIndex < flatContentList.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return; // Cannot move
    }

    const newItem = flatContentList[newIndex];
    // Replace current item in stack instead of pushing a new one
    setPageStack((prev) => {
      const newStack = [...prev];
      newStack[newStack.length - 1] = {
        name: "ContentView",
        key: newItem.id,
        sourceList: currentPage.sourceList,
      };
      return newStack;
    });
    setTrack(newItem); // Auto-play next track if audio player is active
  };

  // Handler for LanguageCard / ContentCard / ContentView play button
  const handlePlayMessage = (item) => {
    if (!item) return;

    // If tapping the speaker icon for the currently loaded track, toggle play/pause
    if (track && String(track.id) === String(item.id) && mainAudioRef.current) {
      if (!mainAudioRef.current.paused) {
        mainAudioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        const playableUrl = getPlayableTrackUrl(item);
        if (!mainAudioRef.current.src && playableUrl) {
          mainAudioRef.current._activeTrackId = item.id;
          playSampleWithOfflineSupport(mainAudioRef.current, playableUrl, {
            onPlaySuccess: () => setIsAudioPlaying(true),
            onPlayError: () => setIsAudioPlaying(false),
            onEnded: () => setIsAudioPlaying(false),
          });
        } else {
          mainAudioRef.current
            .play()
            .then(() => setIsAudioPlaying(true))
            .catch(() => {});
        }
      }
      return;
    }

    setTrack(item);

    // Synchronously start playback on the persistent <audio> element inside the user tap gesture
    const playableUrl = getPlayableTrackUrl(item);
    if (mainAudioRef.current && playableUrl) {
      mainAudioRef.current._activeTrackId = item.id;
      playSampleWithOfflineSupport(mainAudioRef.current, playableUrl, {
        onPlaySuccess: () => setIsAudioPlaying(true),
        onPlayError: () => setIsAudioPlaying(false),
        onEnded: () => setIsAudioPlaying(false),
      });
    }
  };

  // --- NEW: PWA Install Click Handler ---

  // --- Current Content and Navigation Status ---
  const currentPage = pageStack[pageStack.length - 1];
  const currentItem =
    currentPage.name === "ContentView"
      ? staticContent.find((item) => item.id === currentPage.key)
      : null;

  // Show the search bar whenever the user opened it OR when we are on Search page
  const shouldShowSearchBar = isSearchOpen || currentPage.name === "Search";

  // Open search from the header search icon
  const openSearchPage = () => {
    setIsSearchOpen(true);
    setIsDrawerOpen(false);

    if (currentPage.name !== "Search") {
      navigateTo("Search");
    }
  };

  // Clear search text, return to Home, but keep the search box visible and ready
  const clearSearchAndStayOpen = () => {
    setSearchTerm("");
    setIsSearchOpen(true);
    setPageStack([{ name: "Home", key: Date.now() }]);

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close the search bar completely and return to Home
  const closeSearchCompletely = () => {
    setSearchTerm("");
    setIsSearchOpen(false);
    setPageStack([{ name: "Home", key: Date.now() }]);

    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Real form submit so Android keyboard Enter/Search actually works
  const submitSearch = (e) => {
    if (e) e.preventDefault();

    const cleanTerm = searchTerm.trim();

    if (!cleanTerm) {
      clearSearchAndStayOpen();
      return;
    }

    setSearchTerm(cleanTerm);
    setIsSearchOpen(true);
    addToSearchHistory(cleanTerm);

    if (currentPage.name !== "Search") {
      navigateTo("Search");
    }
  };

  // Shared Search handler (used by header + floating bar)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setIsSearchOpen(true);

    if (value.trim()) {
      // Move to the Search page only once
      if (currentPage.name !== "Search") {
        navigateTo("Search");
      }
    } else {
      // If the search box is empty, stay open but show Home again
      if (currentPage.name === "Search") {
        setPageStack([{ name: "Home", key: Date.now() }]);
      }
    }
  };

  // Determine current index and next/prev status for ContentView
  const currentItemIndex = currentItem
    ? flatContentList.findIndex((item) => item.id === currentItem.id)
    : -1;
  const canGoPrev = currentItemIndex > 0;
  const canGoNext =
    currentItemIndex !== -1 && currentItemIndex < flatContentList.length - 1;

  // --- Effects ---

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Quietly pre-cache all speaker-icon sample MP3s in the background for offline use
      precacheAllAudioSamples();
    }, 2000); // 2 seconds

    const handleOnline = () => {
      precacheAllAudioSamples();
    };
    window.addEventListener("online", handleOnline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // URL Parameter Effect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const langKey = urlParams.get("langKey");

    if (langKey) {
      const decodedLangKey = decodeURIComponent(langKey);
      const group = languageGroups.find((g) => g.stableKey === decodedLangKey);

      if (group) {
        setPageStack([
          { name: "Home" },
          { name: "MessagesByLanguage", key: decodedLangKey },
        ]);

        // --- REMOVED window.history.replaceState(...) ---
        // By removing the replaceState, the browser history remains intact,
        // allowing the <Back button to function correctly.
      }
    }
    // ... rest of useEffect
  }, [languageGroups]); // Depend on languageGroups to ensure data is loaded

  // --- NEW: PWA Install Prompt Listener & Standalone Detection ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log("beforeinstallprompt event captured.");
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed.");
      setIsPwaInstalled(true);
      setIsInstallClicked(true);
      setIsBannerDismissed(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setIsPwaInstalled(true);
    }

    // Listen for mode changes
    const mediaQueryLocal = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e) => setIsPwaInstalled(e.matches);

    try {
      mediaQueryLocal.addEventListener("change", handleChange);
    } catch (e) {
      // Create a fallback for Safari < 14
      mediaQueryLocal.addListener(handleChange);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      try {
        mediaQueryLocal.removeEventListener("change", handleChange);
      } catch (e) {
        mediaQueryLocal.removeListener(handleChange);
      }
    };
  }, []);

  // --- NEW: Detect App Updates via Service Worker AND /version.json ---
  const checkForAppUpdate = React.useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;

    // 1. Check /version.json (bypasses browser caches)
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const data = await res.json();
          if (data.buildId && data.buildId !== BUILD_INFO.buildId) {
            setUpdateAvailable(true);
            setNewVersionLabel(data.version || null);
          }
        }
      }
    } catch (e) {
      // Ignore network errors while checking version.json
    }

    // 2. Check Service Worker registration
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update().catch(() => {});
          if (registration.waiting) {
            waitingWorkerRef.current = registration.waiting;
            setUpdateAvailable(true);
          }
        }
      } catch (e) {
        // Ignore SW update check error
      }
    }
  }, []);

  useEffect(() => {
    checkForAppUpdate();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          waitingWorkerRef.current = registration.waiting;
          setUpdateAvailable(true);
        }
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              waitingWorkerRef.current = newWorker;
              setUpdateAvailable(true);
            }
          });
        });
      });
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkForAppUpdate();
      }
    };

    window.addEventListener("online", checkForAppUpdate);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("online", checkForAppUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkForAppUpdate]);

  // Also check for updates whenever the user opens the pullout menu
  useEffect(() => {
    if (isDrawerOpen) {
      checkForAppUpdate();
    }
  }, [isDrawerOpen, checkForAppUpdate]);

  // --- NEW: Apply App Update Handler (Button vanishes immediately on click) ---
  const handleApplyUpdate = async () => {
    // Immediately hide update buttons so user doesn't keep pushing it
    setIsUpdateClicked(true);
    setUpdateAvailable(false);
    setIsDrawerOpen(false);

    try {
      if (waitingWorkerRef.current) {
        waitingWorkerRef.current.postMessage({ type: "SKIP_WAITING" });
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          if (key.startsWith("app-shell-cache")) {
            await caches.delete(key);
          }
        }
      }
    } catch (e) {
      console.warn("Error preparing app update:", e);
    }

    window.location.reload();
  };

  // --- NEW: PWA Install Click Handler (Button vanishes immediately on click) ---
  const handleInstallClick = async () => {
    // Immediately hide the install button & banner so the user doesn't keep pushing it
    setIsInstallClicked(true);
    setIsBannerDismissed(true);
    setIsDrawerOpen(false);

    if (deferredPrompt) {
      // Show the install prompt (Android / Chrome Desktop)
      const promptEvent = deferredPrompt;
      setDeferredPrompt(null);
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the PWA install prompt");
        setIsPwaInstalled(true);
      } else {
        console.log("User dismissed the PWA install prompt");
      }
    } else {
      // iOS / Safari / Existing PWA logic where prompt isn't supported
      // Show instructions instead of false "Installed"
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert(
          lang === "th"
            ? "ในการติดตั้ง: แตะปุ่มแชร์ด้านล่าง แล้วเลือก 'เพิ่มไปยังหน้าจอหลัก'"
            : "To install: Tap the Share button below and select 'Add to Home Screen'",
        );
      } else {
        // Fallback for other browsers
        alert(
          lang === "th"
            ? "ติดตั้งแอพนี้ได้จากเมนูของเบราว์เซอร์ (เพิ่มไปยังหน้าจอหลัก)"
            : "Install this app from your browser menu (Add to Home Screen)",
        );
      }
    }
  };

  // --- ADDED: New Global Font Size Effect ---
  useEffect(() => {
    // Apply the selected font size to the root <html> element
    // This will scale all rem-based Tailwind classes for reading text.
    if (fontSize) {
      document.documentElement.style.fontSize = fontSize;
      const numericSize = parseInt(fontSize, 10) || 16;
      document.documentElement.setAttribute(
        "data-large-font",
        numericSize >= 20 ? "true" : "false",
      );
      // We also consolidate saving to localStorage here
      localStorage.setItem("appFontSize", fontSize);
    }
  }, [fontSize]); // Rerun this effect whenever fontSize changes
  // --- END of new block ---

  // *** FIX: Added Firebase Loading Check ***
  // If the app is not ready (Firebase has not loaded user state), show a loading screen.
  if (!isAuthReady && !isLoading) {
    // Only show auth loading AFTER splash screen
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
        <Zap className="w-12 h-12 text-brand-red animate-pulse mb-4" />
        <p className="text-xl font-semibold text-gray-700">
          {t.loading_app || "Loading application and connecting..."}
        </p>
        {error && <p className="mt-4 text-red-500 text-sm">Error: {error}</p>}
      </div>
    );
  }

  // --- Render Logic ---
  let PageContent;
  switch (currentPage.name) {
    case "Home":
      PageContent = (
        <LanguageListPage
          lang={lang}
          t={t}
          onSelectLanguage={handleSelectLanguage}
          languageGroups={languageGroups}
          onShowQrForLanguage={handleShowQrForLanguage}
          // --- NEW WIRING ---
          selectedPrograms={selectedPrograms}
          onToggleLanguage={handleLanguageToggle}
          showCheckboxes={isSelectMode}
          onEnableSelectMode={() => setIsSelectMode(true)}
          onPlayTrack={handlePlayMessage}
          activeTrack={track}
          isAudioPlaying={isAudioPlaying}
          onHoverChange={setIsHoveringContent} // 👈 GIVE IT THE CONTROLLER
          userData={userData} // 👇 NEW
          onToggleFavoriteLanguage={handleToggleFavoriteLanguage} // 👇 NEW
          isSearchBarVisible={isLangSearchBarVisible}
          onToggleSearchBar={setIsLangSearchBarVisible}
          key={currentPage.key || "home"} // Force remount on Home click
        />
      );
      break;

    case "SelectedContent":
      PageContent = (
        <SelectedContentPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          selectedPrograms={selectedPrograms}
          languageGroups={languageGroups}
          allMessages={staticContent}
          onClearSelection={clearSelection}
          onShare={handleShareSelected}
          onCopy={handleCopySelected}
          onDownload={handleDownloadSelected} // This is the "Print" button (using Download icon)
          onDownloadPDF={handleDownloadSelectedPDF} // This is the actual PDF button
          userData={userData}
          onToggleFavorite={handleToggleFavorite}
          onPlayTrack={handlePlayMessage}
          activeTrack={track}
          isAudioPlaying={isAudioPlaying}
          onShowQrForMessage={handleShowQrForMessage}
        />
      );
      break;

    // --- THIS IS THE MISSING BLOCK THAT FIXES THE 404 ERROR ---
    case "ContentView":
      PageContent = (
        <ContentView
          item={currentItem}
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={() => handleNextPrevMessage("next")}
          hasPrev={hasPrev}
          hasNext={hasNext}
          userData={userData}
          saveUserData={saveUserData}
          onPlay={handlePlayMessage}
          pageStack={pageStack}
        />
      );
      break;

    case "MessagesByLanguage":
      PageContent = (
        <MessagesByLanguagePage
          lang={lang}
          t={t}
          selectedLanguageKey={currentPage.key}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onSelectMessage={(item) => handleSelectMessage(item, "language")}
          currentMessageList={currentMessageList}
          languageGroups={languageGroups}
          pageStack={pageStack}
          // --- NEW WIRING ---
          selectedPrograms={selectedPrograms}
          onToggleProgram={handleProgramToggle}
          showCheckboxes={isSelectMode}
          onEnableSelectMode={() => setIsSelectMode(true)}
          onPlayTrack={handlePlayMessage}
          activeTrack={track}
          isAudioPlaying={isAudioPlaying}
          onShowQrForMessage={handleShowQrForMessage} // 👈 PASSED DOWN
          userData={userData}
          onToggleFavorite={handleToggleFavorite}
        />
      );
      break;

    case "Search":
      PageContent = (
        <SearchPage
          lang={lang}
          t={t}
          onSelect={(item) => handleSelectMessage(item, "search")}
          searchTerm={searchTerm}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          // --- FIX: ADDED pageStack PROP ---
          pageStack={pageStack}
          // --- NEW: Search History Props ---
          searchHistory={searchHistory}
          onClearHistory={clearSearchHistory}
          onHistorySelect={(term) => {
            setSearchTerm(term);
            addToSearchHistory(term); // Refresh position
          }}
          userData={userData}
          onToggleFavorite={handleToggleFavorite}
          onPlayTrack={handlePlayMessage}
          activeTrack={track}
          isAudioPlaying={isAudioPlaying}
          onShowQrForMessage={handleShowQrForMessage}
          onOpenSearch={() => setIsSearchOpen(true)} // Auto-open search bar
        />
      );
      break;

    case "Favorites":
      PageContent = (
        <FavoritesPage
          lang={lang}
          t={t}
          userData={userData}
          onSelect={(item) => handleSelectMessage(item, "favorite")}
          setLang={setLang}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          pageStack={pageStack}
          onToggleFavorite={handleToggleFavorite}
          onPlayTrack={handlePlayMessage}
          activeTrack={track}
          isAudioPlaying={isAudioPlaying}
          onShowQrForMessage={handleShowQrForMessage}
          // 🔴 NEW: give FavoritesPage what it needs for LANGUAGES
          languageGroups={languageGroups}
          onToggleFavoriteLanguage={handleToggleFavoriteLanguage}
          onSelectLanguage={(stableKey) =>
            navigateTo("MessagesByLanguage", stableKey)
          }
          onGoHome={() => navigateTo("Home")}
        />
      );
      break;

    case "Notes":
      PageContent = (
        <NotesPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          userData={userData}
          saveUserData={saveUserData}
        />
      );
      break;

    case "MyLibrary":
      PageContent = (
        <MyLibraryPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPlay={handlePlayMessage}
          onGoHome={navigateToHome}
          // Shared Storage Props
          offlineTracks={offlineTracks}
          deleteTrack={deleteTrack}
          clearLibrary={clearLibrary}
        />
      );
      break;

    // case "Settings": // REMOVED
    //   PageContent = (
    //     <SettingsPage
    //       lang={lang}
    //       t={t}
    //       setLang={setLang}
    //       fontSize={fontSize}
    //       setFontSize={setFontSize}
    //       onBack={goBack}
    //       onForward={goForward}
    //       hasPrev={hasPrev}
    //       hasNext={hasNext}
    //       onNavigate={navigateTo}
    //     />
    //   );
    //   break;

    case "StorageManagement": // NEW ROUTE
      PageContent = (
        <StorageManagementPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          offlineTracks={offlineTracks}
          deleteTrack={deleteTrack}
          clearLibrary={clearLibrary}
        />
      );
      break;

    case "Import":
      PageContent = (
        <ImportPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          setCustomBackHandler={setCustomBackHandler}
          onNavigate={navigateTo} // 👈 NEW
          // Shared Storage Props
          offlineTracks={offlineTracks}
          downloadTrack={downloadTrack}
        />
      );
      break;

    case "SignLanguage": // NEW
      PageContent = (
        <SignLanguagePage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      );
      break;

    case "Feedback": // NEW
      PageContent = (
        <FeedbackPage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      );
      break;

    case "Share": // NEW
      PageContent = (
        <SharePage
          lang={lang}
          t={t}
          onBack={goBack}
          onForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      );
      break;

    default:
      PageContent = (
        <div className="p-4 pt-8 text-center text-red-500">
          404: Page not found.
          <button
            onClick={() => setPageStack([{ name: "Home" }])}
            className="mt-4 p-2 bg-red-100 rounded"
          >
            Go Home
          </button>
        </div>
      );
  }

  // Determine if the search bar should be fully visible or just an icon
  const isSearchPage = currentPage.name === "Search";

  // --- START OF MAIN RETURN ---
  return (
    // 💡 CONDITIONAL RENDER: Show Splash Screen OR the App
    isLoading ? (
      // 1. --- SPLASH SCREEN COMPONENT (Visible while isLoading is TRUE) ---
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black z-50`}
      >
        <img
          src={AppLogo} // Your optimized square logo source
          alt={t.app_name || "App Loading"}
          className="
            w-72 h-72 
            lg:w-96 lg:h-96 
            rounded-full shadow-2xl 
            object-cover
            brightness-125
            animate-windy
          "
        />
      </div>
    ) : (
      // 2. --- NORMAL APPLICATION START (Visible while isLoading is FALSE) ---
      <div className="min-h-screen bg-gray-100 dark:bg-[#374151] flex flex-col">
        {/* --- UPDATE NOTIFICATION BANNER --- */}
        <UpdateNotification
          updateAvailable={
            updateAvailable && !isUpdateClicked && !isTopUpdateBannerDismissed
          }
          newVersion={newVersionLabel}
          onUpdate={handleApplyUpdate}
          onDismiss={() => setIsTopUpdateBannerDismissed(true)}
          lang={lang}
        />

        {/* --- UNIFIED SHARE QR MODAL --- */}
        <ShareQrModal
          isOpen={shareModalState.isOpen}
          onClose={handleCloseShareModal}
          title={shareModalState.title}
          subtitle={shareModalState.subtitle}
          url={shareModalState.url}
          footerText={shareModalState.footerText}
          item={shareModalState.item}
          externalUrl={shareModalState.externalUrl}
          videoUrl={shareModalState.videoUrl}
        />

        {/* --- HEADER (Banner - locked in px so font-size changes never distort or overlap icons) --- */}
        <header
          className={`sticky top-0 w-full ${PRIMARY_COLOR_CLASS} shadow-lg z-40 rounded-b-xl md:py-[10px] md:px-[12px]`}
        >
          {/* Mobile/Tablet: Clean left-to-right flex bar (no colliding 3-column grid) */}
          <div className="flex items-center justify-between h-[72px] md:hidden px-[8px]">
            {/* LEFT: Menu + Logo + Home */}
            <div className="flex items-center gap-[4px] flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover flex items-center"
                  aria-label="Open Sidebar Menu"
                >
                  <Menu className="w-[24px] h-[24px]" />
                </button>
                <SelectionBadge
                  selectionCount={selectedPrograms.length}
                  isHovering={isHoveringContent}
                  navigateToSelectedContent={navigateToSelectedContent}
                  t={t}
                  lang={lang}
                />
              </div>
              <a
                href="https://5fish.mobi/th?r=Asia&country=Thailand"
                target="_blank"
                rel="noopener noreferrer"
                title="5fish.mobi/th?r=Asia&country=Thailand"
                className="flex items-center text-white rounded-lg hover:bg-red-800 transition-colors flex-shrink-0"
              >
                <img
                  src={BannerLogo}
                  alt={t.app_name}
                  className="w-auto flex-shrink-0 object-cover rounded-lg brightness-125 animate-windy"
                  style={{ height: "54px" }}
                />
              </a>
              <button
                onClick={navigateToHome}
                className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover flex items-center"
                title={t.home || "Home"}
                aria-label={t.home || "Home"}
              >
                <Home className="w-[22px] h-[22px]" />
              </button>
            </div>

            {/* RIGHT MOBILE: Controls (pixel-sized so they never overlap at any font size) */}
            <div className="flex items-center justify-end gap-[2px] flex-shrink-0">
              {(currentPage.name === "Home" ||
                currentPage.name === "MessagesByLanguage") && (
                <button
                  type="button"
                  onClick={() => setIsSelectMode((prev) => !prev)}
                  className={`p-[6px] rounded-lg text-[13px] font-bold flex items-center gap-[4px] transition-colors ${
                    isSelectMode
                      ? "bg-amber-400 text-gray-900 shadow-sm"
                      : "text-white hover:bg-red-800"
                  }`}
                  title={
                    isSelectMode
                      ? lang === "th"
                        ? "ซ่อนช่องทำเครื่องหมาย"
                        : "Hide selection checkboxes"
                      : lang === "th"
                        ? "เลือกหลายรายการ"
                        : "Select multiple items"
                  }
                  aria-label={
                    isSelectMode
                      ? lang === "th"
                        ? "ซ่อนช่องทำเครื่องหมาย"
                        : "Hide selection checkboxes"
                      : lang === "th"
                        ? "เลือกหลายรายการ"
                        : "Select multiple items"
                  }
                >
                  <svg
                    className="w-[22px] h-[22px] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <span className="hidden sm:inline">
                    {isSelectMode
                      ? lang === "th"
                        ? "เสร็จ"
                        : "Done"
                      : lang === "th"
                        ? "เลือก"
                        : "Select"}
                  </span>
                </button>
              )}

              <LanguageToggle lang={lang} setLang={setLang} t={t} />

              <FloatingUtilityBar
                t={t}
                lang={lang}
                setLang={setLang}
                selectionCount={selectedPrograms.length}
                onClearSelection={clearSelection}
                fontSize={fontSize}
                setFontSize={setFontSize}
                navigateToSelectedContent={navigateToSelectedContent}
              />

              {!isPwaInstalled && !isInstallClicked && (
                <button
                  onClick={handleInstallClick}
                  title={t.install_app || "Install App"}
                  className="p-[6px] rounded-lg transition-colors btn-hover text-white hover:bg-red-800"
                  aria-label={t.install_app || "Install App"}
                >
                  <Download className="w-[22px] h-[22px]" />
                </button>
              )}

              {/* A-Z / Thai alphabet side rolodex toggle - only on Home page */}
              {currentPage.name === "Home" && (
                <button
                  onClick={() => setIsLangSearchBarVisible((prev) => !prev)}
                  className="text-white p-[4px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                  title={
                    isLangSearchBarVisible
                      ? lang === "th"
                        ? "ซ่อนรายการตัวอักษร"
                        : "Hide A-Z index"
                      : lang === "th"
                        ? "แสดงรายการตัวอักษร"
                        : "Show A-Z index"
                  }
                  aria-label={
                    isLangSearchBarVisible
                      ? lang === "th"
                        ? "ซ่อนรายการตัวอักษร"
                        : "Hide A-Z index"
                      : lang === "th"
                        ? "แสดงรายการตัวอักษร"
                        : "Show A-Z index"
                  }
                >
                  <AlphabetIndex className="w-[32px] h-[32px]" />
                </button>
              )}

              <button
                onClick={openSearchPage}
                className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                aria-label="Open Search"
                title={lang === "th" ? "ค้นหา" : "Search"}
              >
                <Search className="w-[24px] h-[24px]" />
              </button>
            </div>
          </div>

          {/* Desktop: Flexbox layout */}
          <div className="hidden md:flex justify-between items-center relative">
            {/* Left: Menu & Logo */}
            <div className="flex items-center gap-[8px]">
              <div className="relative">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                  aria-label="Open Sidebar Menu"
                >
                  <Menu className="w-[28px] h-[28px]" />
                </button>
                <SelectionBadge
                  selectionCount={selectedPrograms.length}
                  isHovering={isHoveringContent}
                  navigateToSelectedContent={navigateToSelectedContent}
                  t={t}
                  lang={lang}
                />
              </div>
              <a
                href="https://5fish.mobi/th?r=Asia&country=Thailand"
                target="_blank"
                rel="noopener noreferrer"
                title="5fish.mobi/th?r=Asia&country=Thailand"
                className="flex items-center text-white rounded-lg hover:bg-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white flex-shrink-0"
              >
                <img
                  src={BannerLogo}
                  alt={t.app_name}
                  className="w-auto flex-shrink-0 rounded-lg brightness-125 animate-windy"
                  style={{ height: "58px" }}
                />
              </a>
              <button
                onClick={() => {
                  navigateToHome();
                  setIsDrawerOpen(false);
                }}
                className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                title={t.home || "Home"}
                aria-label={t.home || "Home"}
              >
                <Home className="w-[22px] h-[22px]" />
              </button>
            </div>

            {/* Center: Navigation Buttons (Desktop only) */}
            <div className="flex items-center justify-center gap-[8px]">
              {currentPage.name !== "Home" && (
                <>
                  <button
                    onClick={goBack}
                    disabled={!hasPrev}
                    className={`p-[4px] rounded-lg transition-colors flex items-center ${
                      hasPrev
                        ? "text-white hover:bg-white/20"
                        : "text-red-200 opacity-50 cursor-not-allowed"
                    }`}
                    title={t.back || "Back"}
                  >
                    <ChevronLeft className="w-[30px] h-[30px]" />
                  </button>
                  <button
                    onClick={goForward}
                    disabled={!hasNext}
                    className={`p-[4px] rounded-lg transition-colors flex items-center ${
                      hasNext
                        ? "text-white hover:bg-white/20"
                        : "text-red-200 opacity-50 cursor-not-allowed"
                    }`}
                    title={t.forward || "Forward"}
                  >
                    <ChevronRight className="w-[30px] h-[30px]" />
                  </button>
                </>
              )}
            </div>

            {/* Right Desktop: Controls */}
            <div className="flex items-center gap-[10px] flex-shrink-0">
              {(currentPage.name === "Home" ||
                currentPage.name === "MessagesByLanguage") && (
                <button
                  type="button"
                  onClick={() => setIsSelectMode((prev) => !prev)}
                  className={`px-[10px] py-[6px] rounded-lg text-[14px] font-bold flex items-center gap-[6px] transition-colors ${
                    isSelectMode
                      ? "bg-amber-400 text-gray-900 shadow-sm"
                      : "text-white bg-white/15 hover:bg-red-800"
                  }`}
                  title={
                    isSelectMode
                      ? lang === "th"
                        ? "ซ่อนช่องทำเครื่องหมาย"
                        : "Hide selection checkboxes"
                      : lang === "th"
                        ? "เลือกหลายรายการ"
                        : "Select multiple items"
                  }
                  aria-label={
                    isSelectMode
                      ? lang === "th"
                        ? "ซ่อนช่องทำเครื่องหมาย"
                        : "Hide selection checkboxes"
                      : lang === "th"
                        ? "เลือกหลายรายการ"
                        : "Select multiple items"
                  }
                >
                  <svg
                    className="w-[18px] h-[18px] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <span>
                    {isSelectMode
                      ? lang === "th"
                        ? "เสร็จสิ้น"
                        : "Done"
                      : lang === "th"
                        ? "เลือกหลายรายการ"
                        : "Select"}
                  </span>
                </button>
              )}

              <FloatingUtilityBar
                t={t}
                lang={lang}
                setLang={setLang}
                selectionCount={selectedPrograms.length}
                onClearSelection={clearSelection}
                fontSize={fontSize}
                setFontSize={setFontSize}
                navigateToSelectedContent={navigateToSelectedContent}
                isHovering={isHoveringContent}
              />

              <LanguageToggle lang={lang} setLang={setLang} t={t} />

              {!isPwaInstalled && !isInstallClicked && (
                <button
                  onClick={handleInstallClick}
                  title={t.install_app || "Install App"}
                  className="p-[6px] rounded-lg transition-colors btn-hover text-white hover:bg-red-800"
                  aria-label={t.install_app || "Install App"}
                >
                  <Download className="w-[24px] h-[24px]" />
                </button>
              )}

              {/* A-Z / Thai alphabet side rolodex toggle - only on Home page */}
              {currentPage.name === "Home" && (
                <button
                  onClick={() =>
                    setIsLangSearchBarVisible((prev) => {
                      const next = !prev;

                      if (!prev && mainScrollRef.current) {
                        mainScrollRef.current.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }

                      if (!prev) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }

                      return next;
                    })
                  }
                  className="text-white p-[4px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                  title={
                    isLangSearchBarVisible
                      ? lang === "th"
                        ? "ซ่อนรายการตัวอักษร"
                        : "Hide A-Z index"
                      : lang === "th"
                        ? "แสดงรายการตัวอักษร"
                        : "Show A-Z index"
                  }
                  aria-label={
                    isLangSearchBarVisible
                      ? lang === "th"
                        ? "ซ่อนรายการตัวอักษร"
                        : "Hide A-Z index"
                      : lang === "th"
                        ? "แสดงรายการตัวอักษร"
                        : "Show A-Z index"
                  }
                >
                  <AlphabetIndex className="w-[34px] h-[34px]" />
                </button>
              )}

              <button
                onClick={openSearchPage}
                className="text-white p-[6px] rounded-lg hover:bg-red-800 transition-colors btn-hover"
                aria-label="Open Search"
                title={lang === "th" ? "ค้นหา" : "Search"}
              >
                <Search
                  className="w-[26px] h-[26px]"
                  circleFill="#b9483b"
                  circleStroke="currentColor"
                  handleStroke="currentColor"
                />
              </button>
            </div>
          </div>
        </header>

        {/* --- TOGGLED SEARCH BAR (Below Header) --- */}
        {shouldShowSearchBar && (
          <div className="sticky top-14 w-full px-2 py-1.5 bg-white shadow-xl z-20">
            <form
              onSubmit={submitSearch}
              className="relative w-full flex items-center gap-2"
              role="search"
            >
              {/* Search Input Field */}
              <div className="relative flex-1">
                <input
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  placeholder={
                    t.search_placeholder || "Search languages or messages..."
                  }
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full p-2 pl-10 pr-3 text-gray-800 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-150"
                  style={{ fontSize: "1.1rem" }}
                  autoFocus
                />

                <Search
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 ${ACCENT_COLOR_CLASS}`}
                />
              </div>

              {/* Clear text button */}
              <button
                type="button"
                onClick={clearSearchAndStayOpen}
                disabled={!searchTerm}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  searchTerm
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                }`}
                aria-label={t.clear_search || "Clear"}
                title={t.clear_search || "Clear"}
              >
                {t.clear_search || "Clear"}
              </button>

              {/* Close Search Button */}
              <button
                type="button"
                onClick={closeSearchCompletely}
                className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t.close_search || "Close Search"}
                title={t.close_search || "Close Search"}
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <main ref={mainScrollRef} className="flex-grow overflow-y-auto pb-20">
          {PageContent}
        </main>

        {/* --- AUDIO PLAYER --- */}
        <AudioPlayer
          track={track}
          audioRef={mainAudioRef}
          isPlaying={isAudioPlaying}
          setIsPlaying={setIsAudioPlaying}
          isMinimized={isAudioMinimized}
          toggleMinimize={toggleAudioMinimize}
          t={t}
          lang={lang}
          onGoBack={goBack}
          onGoForward={goForward}
          hasPrev={hasPrev}
          hasNext={hasNext}
          onClose={() => {
            setIsAudioPlaying(false);
            setTrack(null);
          }}
        />

        {/* --- NAVIGATION DRAWER (Sidebar) --- */}
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            isDrawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Overlay (Click to close) */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          {/* Drawer Content (locked in px + max-w-[85vw] so large fonts never push the X button off-screen) */}
          <div
            className={`absolute left-0 top-0 w-[288px] max-w-[85vw] h-full bg-white dark:bg-[#374151] shadow-2xl transition-transform duration-300 transform ${
              isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            } rounded-tr-xl flex flex-col z-10`}
          >
            {/* Header - Match PWA header height */}
            <div
              className={`${PRIMARY_COLOR_CLASS} px-[10px] py-[8px] rounded-r-xl flex-shrink-0 flex items-center justify-between gap-[8px]`}
            >
              {/* Left: Logo and Title */}
              <div className="flex items-center gap-[8px] min-w-0">
                {/* 1. The Square Logo */}
                <button
                  type="button"
                  onClick={() => {
                    navigateToHome();
                    setIsDrawerOpen(false);
                  }}
                  className="focus:outline-none transition-transform active:scale-95 flex-shrink-0"
                  title={t.home || "Home"}
                >
                  <img
                    src={AppLogo}
                    alt="Logo"
                    className="h-[48px] w-[48px] flex-shrink-0 object-cover brightness-125 animate-windy"
                  />
                </button>

                {/* Title Column */}
                <div className="flex flex-col items-start justify-center min-w-0">
                  {/* 2. App Title */}
                  <h2 className="text-[22px] font-bold text-white leading-tight truncate">
                    {t.app_name}
                  </h2>
                </div>
              </div>

              {/* 4. Close Button (Large, easy-to-tap 38px target) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDrawerOpen(false);
                }}
                aria-label={lang === "th" ? "ปิดเมนู" : "Close Menu"}
                title={lang === "th" ? "ปิดเมนู" : "Close Menu"}
                className="text-white w-[38px] h-[38px] flex items-center justify-center bg-white/15 hover:bg-red-800 active:scale-95 rounded-full flex-shrink-0 transition-all"
              >
                <X className="w-[22px] h-[22px]" />
              </button>
            </div>

            {/* Navigation Links (Scrollable) - Tighter spacing */}
            <nav className="p-4 space-y-0.5 overflow-y-auto flex-grow">
              {/* Navigation Items */}
              {[
                { name: "Search", icon: Search, target: "Search" },
                {
                  name: "Sign_Language",
                  icon: SignLanguage,
                  target: "SignLanguage",
                },
                { name: "Favorites", icon: Heart, target: "Favorites" },
                { name: "Notes", icon: Pen, target: "Notes" },
                {
                  name: "Selected_Messages",
                  icon: Music,
                  target: "SelectedContent",
                },
                { name: "My_Library", icon: Download, target: "MyLibrary" },
                {
                  name: "storage_management",
                  icon: Settings,
                  target: "StorageManagement",
                },
                { name: "Import", icon: Upload, target: "Import" },
                { name: "Feedback", icon: MessageSquare, target: "Feedback" },
                {
                  name: "Share_App_Menu",
                  icon: Share2,
                  target: "Share",
                },
              ].map((item) => {
                // --- NEW: Logic to render a link or a button ---
                if (item.url) {
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center p-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#004d99] transition-colors"
                    >
                      <item.icon className="mr-3 w-6 h-6 shrink-0" />
                      <span className="text-base whitespace-nowrap">
                        {t[item.name.toLowerCase()]}
                      </span>
                    </a>
                  );
                }

                // Original button logic
                const isFavorites = item.name === "Favorites";
                const isNotes = item.name === "Notes";
                const isLibrary = item.name === "My_Library"; // 👈 NEW CHECK

                // Calculate counts safely
                const favoritesCount =
                  (userData?.favorites?.length || 0) +
                  (userData?.favoriteLanguages?.length || 0);

                const notesCount = userData?.notes?.length || 0;
                const libraryCount = offlineTracks.length || 0; // 👈 NEW COUNT

                const count = isFavorites
                  ? favoritesCount
                  : isNotes
                    ? notesCount
                    : isLibrary // 👈 NEW CONDITION
                      ? libraryCount
                      : 0;

                return (
                  <button
                    key={item.name}
                    onClick={() => navigateTo(item.target)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg font-semibold transition-colors ${
                      currentPage.name === item.target
                        ? `${ACCENT_COLOR_CLASS} bg-red-100 dark:bg-red-900/30`
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#004d99]"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`mr-3 w-6 h-6 shrink-0 ${
                          currentPage.name === item.target
                            ? ""
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      />
                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-base">
                          {t[item.name.toLowerCase()]}
                        </span>
                        {item.target === "SignLanguage" && (
                          <span
                            className="comic-pow shrink-0 inline-flex items-center justify-center bg-[#FF8C00] text-white text-[8px] font-black italic px-1 py-0.5 ml-1 leading-none"
                            style={{ minWidth: "32px", minHeight: "16px" }}
                          >
                            {lang === "th" ? "ใหม่" : "NEW"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Counter Badge */}
                    {(isFavorites || isNotes || isLibrary) && count > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* --- Language Toggle --- */}
              <button
                onClick={() => {
                  const newLang = lang === "th" ? "en" : "th";
                  setLang(newLang);
                  localStorage.setItem("appLang", newLang);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#004d99] transition-colors"
                title={
                  lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
                }
              >
                <div className="flex items-center">
                  <Globe className="w-6 h-6 mr-3 shrink-0" />
                  <span className="text-base whitespace-nowrap">
                    {lang === "th" ? "English / ภาษาไทย" : "ภาษาไทย / English"}
                  </span>
                </div>
              </button>

              {/* --- Dark Mode Toggle --- */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-2 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#004d99] transition-colors"
              >
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <Sun className="w-6 h-6 mr-3 shrink-0" />
                  ) : (
                    <Moon className="w-6 h-6 mr-3 shrink-0" />
                  )}
                  <span className="text-base whitespace-nowrap">
                    {theme === "dark"
                      ? t.light_mode || "Light Mode"
                      : t.dark_mode || "Dark Mode"}
                  </span>
                </div>
              </button>
            </nav>

            {/* Bottom Controls (Sticky) */}
            <div className="p-2 pt-3 border-t border-gray-200 flex-shrink-0 space-y-2">
              {/* --- PWA Share QR Code --- */}
              <div className="">
                {/* Label removed as requested */}
                <div className="flex justify-center">
                  <div
                    className="bg-white p-1.5 rounded shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      // Create modal for enlarged QR
                      const modal = document.createElement("div");
                      modal.className =
                        "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4";
                      modal.onclick = () => modal.remove();
                      document.body.appendChild(modal);

                      // Create container with minimal padding
                      const container = document.createElement("div");
                      container.className =
                        "bg-white p-3 rounded-lg shadow-2xl";
                      container.onclick = (e) => e.stopPropagation();

                      // Clone and scale the existing QR code
                      const originalQR =
                        document.querySelector(".sidebar-qr-code");
                      const clonedQR = originalQR.cloneNode(true);
                      clonedQR.setAttribute("width", "256");
                      clonedQR.setAttribute("height", "256");
                      clonedQR.style.display = "block";

                      container.appendChild(clonedQR);
                      modal.appendChild(container);
                    }}
                    title="Click to enlarge"
                  >
                    <QRCodeSVG
                      value="https://thaigoodnews.org"
                      size={parseInt(fontSize || "16") * 3.5}
                      level="M"
                      includeMargin={false}
                      className="sidebar-qr-code"
                    />
                  </div>
                </div>
              </div>

              {/* --- Update / Install Buttons in Pullout Menu --- */}
              {updateAvailable && !isUpdateClicked && (
                <button
                  type="button"
                  onClick={handleApplyUpdate}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 animate-pulse"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === "th"
                      ? `✨ มีเวอร์ชันใหม่${newVersionLabel ? ` (v${newVersionLabel})` : ""} — แตะเพื่อติดตั้ง`
                      : `✨ New Version${newVersionLabel ? ` (v${newVersionLabel})` : ""} — Tap to Install`}
                  </span>
                </button>
              )}

              {!isPwaInstalled && !isInstallClicked && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full py-2 px-3 bg-[#FF8C00] hover:bg-orange-600 text-white font-bold text-sm rounded-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === "th" ? "ติดตั้งแอป (Install App)" : "Install App"}
                  </span>
                </button>
              )}

              {/* --- Bottom Information --- */}
              <div className="text-xs text-gray-500 dark:text-white dark:bg-[#374151] pt-2 space-y-2">
                {/* Build Information */}
                <div className="text-center space-y-1">
                  <p className="text-gray-600 dark:text-white font-medium">
                    Build: {BUILD_INFO.buildDate || process.env.REACT_APP_BUILD_DATE || "local dev"}{" "}
                    <span className="opacity-75">
                      (v{BUILD_INFO.version || process.env.REACT_APP_VERSION || "1.0.3"})
                    </span>
                    {updateAvailable && !isUpdateClicked ? (
                      <span className="ml-1.5 inline-block px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                        {lang === "th" ? "มีอัปเดต!" : "Update Ready!"}
                      </span>
                    ) : (
                      <span className="ml-1.5 text-green-600 dark:text-green-400 font-semibold">
                        ✓
                      </span>
                    )}
                  </p>
                  <p className="text-gray-600 dark:text-white flex items-center justify-center gap-2">
                    {
                      [...new Set(staticContent.map((item) => item.stableKey))]
                        .length
                    }{" "}
                    Languages | {staticContent.length} Messages | Status
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isAuthReady
                          ? "bg-green-500 animate-pulse"
                          : "bg-red-500 animate-pulse"
                      }`}
                      title={
                        isAuthReady
                          ? t.auth_ready || "Ready"
                          : t.auth_pending || "Pending"
                      }
                    ></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- INSTALL BANNER --- */}
        {!isPwaInstalled && !isBannerDismissed && !isInstallClicked && (
          <InstallBanner
            onInstall={handleInstallClick}
            t={t}
            lang={lang}
            onClose={() => {
              setIsBannerDismissed(true);
            }}
          />
        )}
      </div>
    ) // This is the closing parenthesis for the entire application UI block
  ); // This is the closing parenthesis for the main return
}
