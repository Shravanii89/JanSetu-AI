"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Language,
  Translations,
  translations,
  languageNames,
  normalizeLanguage,
  getTranslation,
} from "../translations";

interface LanguageContextType {
  language: Language;
  languageName: string;
  setLanguage: (lang: Language | string) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  tObj: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "jansetu_language";

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage / cookies on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang) {
        setLanguageState(normalizeLanguage(savedLang));
      } else {
        // Check document cookie as fallback
        const match = document.cookie.match(new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`));
        if (match) {
          setLanguageState(normalizeLanguage(decodeURIComponent(match[1])));
        }
      }
    } catch (e) {
      console.warn("Could not read language from storage:", e);
    }
  }, []);

  const setLanguage = (newLangInput: Language | string) => {
    const normalized = normalizeLanguage(newLangInput);
    setLanguageState(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
      document.cookie = `${STORAGE_KEY}=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.warn("Could not save language to storage:", e);
    }
  };

  const t = (path: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, path, params);
  };

  const tObj: Translations = translations[language] || translations.en;

  const value: LanguageContextType = {
    language,
    languageName: languageNames[language] || "English",
    setLanguage,
    t,
    tObj,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, language, setLanguage, languageName, tObj } = useLanguage();
  return { t, language, setLanguage, languageName, tObj };
}

export default LanguageContext;
