import { TranslationDictionary } from "./types";
import { en } from "./dictionaries/en";
import { hi } from "./dictionaries/hi";
import { bn } from "./dictionaries/bn";

export const DICTIONARIES: Record<string, TranslationDictionary> = {
  en,
  hi,
  bn,
};

export function getTranslationDictionary(languageCode: string): TranslationDictionary {
  return DICTIONARIES[languageCode] || DICTIONARIES.en;
}

/**
 * Safely resolves nested keys with English fallback.
 * e.g. t('common.save') -> "Save" or "सहेजें"
 */
export function translateKey(
  lang: string,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  const currentDict = DICTIONARIES[lang] || DICTIONARIES.en;
  const fallbackDict = DICTIONARIES.en;

  const getNested = (obj: any, path: string): string | undefined => {
    const keys = path.split(".");
    let curr = obj;
    for (const k of keys) {
      if (curr && typeof curr === "object" && k in curr) {
        curr = curr[k];
      } else {
        return undefined;
      }
    }
    return typeof curr === "string" ? curr : undefined;
  };

  let text = getNested(currentDict, keyPath) || getNested(fallbackDict, keyPath) || keyPath;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{${k}}}`, "g"), String(v));
    });
  }

  return text;
}
