import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { translations } from "@/constants/translations";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    AsyncStorage.getItem("app_language")
      .then((savedLanguage) => {
        if (savedLanguage && translations[savedLanguage as Language]) {
          setLanguageState(savedLanguage as Language);
        }
      })
      .catch(() => {
        // Keep the default "fr" state if AsyncStorage can't be read.
      });
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("app_language", lang);
    } catch {
      // Best-effort persistence — still reflect the choice in-session even
      // if it couldn't be saved to disk.
    } finally {
      setLanguageState(lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] as Record<string, string> | undefined;
    const frDict = translations.fr as Record<string, string>;
    const raw = langDict?.[key] ?? frDict[key] ?? key;
    if (!params) return raw;
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replaceAll(`{{${k}}}`, String(v)),
      raw,
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
