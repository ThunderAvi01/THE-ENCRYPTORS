"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SUPPORTED_LANGUAGES, LanguageOption, getLanguageByCode } from "@/lib/i18n/languages";
import { getTranslationDictionary, translateKey } from "@/lib/i18n/index";
import { TranslationDictionary } from "@/lib/i18n/types";

interface LanguageContextType {
  language: string;
  languageOption: LanguageOption;
  setLanguage: (code: string) => void;
  dict: TranslationDictionary;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  isFirstVisit: boolean;
  completeFirstVisit: () => void;
}

const LANGUAGE_STORAGE_KEY = "arogyaintake_user_language";
const SESSION_PROMPT_KEY = "arogyaintake_session_language_asked";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Check saved language and session entry flag on client mount
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang && ["en", "hi", "bn"].includes(savedLang)) {
        setLanguageState(savedLang);
      }

      // Check if user has already confirmed language during this session
      const hasChosenInSession = sessionStorage.getItem(SESSION_PROMPT_KEY);
      if (!hasChosenInSession) {
        setIsFirstVisit(true);
      }
    } catch (e) {
      console.warn("Storage not accessible for i18n:", e);
      // Fallback: show language prompt if storage errors
      setIsFirstVisit(true);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    if (!["en", "hi", "bn"].includes(code)) return;
    setLanguageState(code);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      sessionStorage.setItem(SESSION_PROMPT_KEY, "true");
    } catch (e) {
      console.warn("Failed to persist language in storage:", e);
    }
  }, []);

  const completeFirstVisit = useCallback(() => {
    setIsFirstVisit(false);
    try {
      sessionStorage.setItem(SESSION_PROMPT_KEY, "true");
    } catch (e) {
      console.warn("Failed to persist session prompt flag:", e);
    }
  }, []);

  const languageOption = getLanguageByCode(language);
  const dict = getTranslationDictionary(language);

  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>) => {
      return translateKey(language, keyPath, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageOption,
        setLanguage,
        dict,
        t,
        isFirstVisit,
        completeFirstVisit,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
