export interface LanguageOption {
  code: string; // ISO 639-1 code e.g. "en", "hi", "bn"
  name: string;
  nativeName: string;
  speechLocale: string; // Web Speech API locale string e.g. "en-IN", "hi-IN", "bn-IN"
  direction?: "ltr" | "rtl";
  isSupportedVoice: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English (India)",
    speechLocale: "en-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    speechLocale: "hi-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    speechLocale: "bn-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  // Architecture prepared for expanding to additional Indian languages
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    speechLocale: "te-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    speechLocale: "mr-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    speechLocale: "ta-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "gu",
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    speechLocale: "gu-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "kn",
    name: "Kannada",
    nativeName: "కన్నడ",
    speechLocale: "kn-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "ml",
    name: "Malayalam",
    nativeName: "മലയാളം",
    speechLocale: "ml-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
  {
    code: "pa",
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    speechLocale: "pa-IN",
    direction: "ltr",
    isSupportedVoice: true,
  },
];

export function getLanguageByCode(code: string): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}
