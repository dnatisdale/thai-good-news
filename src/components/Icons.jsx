import React from "react";
import {
  Home,
  Search,
  Heart,
  PenLine,
  Settings,
  Menu,
  List,
  X,
  Share2,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  BookOpen,
  Moon,
  Sun,
  ExternalLink,
  QrCode,
  PlayCircle,
  Pause,
  Volume2,
  CircleCheck,
  Loader,
  Trash2,
  Globe,
  Plus,
  Copy,
  Music,
  MessageSquare,
  Trash,
  Folder,
  FileText,
  Type,
  Languages as LucideLanguages,
  Youtube,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Standard Lucide icons
// -----------------------------------------------------------------------------
// These keep your OLD app icon names working,
// but now most icons come from lucide-react.

export {
  Home,
  Search,
  Heart,
  Settings,
  Menu,
  List,
  X,
  Share2,
  Zap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  BookOpen,
  Moon,
  Sun,
  ExternalLink,
  PlayCircle,
  Pause,
  Volume2,
  Loader,
  Trash2,
  Globe,
  Plus,
  Copy,
  Music,
  MessageSquare,
  Trash,
  Folder,
};

// Old name kept for your app
export const Pen = PenLine;

// Old name kept for your app
export const CheckCircle = CircleCheck;

// Old name kept for your app
export const Qrcode = QrCode;

// Optional standard Lucide language icon
export const Languages = LucideLanguages;

// Simple Lucide PDF-style file icon.
// Your old PdfFile had "PDF" text inside it.
// This version is cleaner and standard.
export const PdfFile = FileText;

// Standard font-size style icon
export const FontSize = Type;

// Standard YouTube icon from Lucide
export const YouTube = Youtube;

// -----------------------------------------------------------------------------
// Custom icons worth keeping
// -----------------------------------------------------------------------------
// These are special to Thai Good News PWA, so we keep them custom.

// A-Z index icon
export const AlphabetIndex = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <text
      x="12"
      y="7"
      textAnchor="middle"
      fontSize="8"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Arial Rounded MT Bold, Arial, sans-serif"
    >
      A
    </text>

    <line
      x1="12"
      y1="9.4"
      x2="12"
      y2="14.3"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <text
      x="12"
      y="22"
      textAnchor="middle"
      fontSize="8"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Arial Rounded MT Bold, Arial, sans-serif"
    >
      Z
    </text>
  </svg>
);

export const LanguageIcon = LucideLanguages;

// YouTube unavailable / disabled icon.
// Lucide does not have this exact custom one, so we keep it.
export const YouTubeOff = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <line x1="4" y1="20" x2="20" y2="4" />
  </svg>
);

// YouTube icon with your Thai Good News red play button.
// Kept because this is branded.
export const YouTubeColor = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
      stroke="#6B7280"
    />
    <polygon
      points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
      fill="#CC3333"
      stroke="none"
    />
  </svg>
);

// Custom Deaf / hard-of-hearing icon.
// Kept because your app already used this exact meaning.
export const Deaf = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 1.5-.5 3-2 4.5l-2 2A4 4 0 0 0 14 17.5v2" />
    <path d="M8.5 8.5c0-1.4 1.1-2.5 2.5-2.5" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

// Custom sign language hand icon.
// Kept because it is clearer than a generic Lucide hand.
export const SignLanguage = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 19 14 c 0 4 -2 7 -7 7 s -6.5 -2 -7 -6.5 l -2.5 -2 a 1.5 1.5 0 0 1 2.12 -2.12 L 7 13 V 5 a 1.5 1.5 0 0 1 3 0 V 14 V 11.5 a 1.5 1.5 0 0 1 3 0 V 14 V 11.5 a 1.5 1.5 0 0 1 3 0 V 14 V 7 a 1.5 1.5 0 0 1 3 0 V 14 Z" />
  </svg>
);
