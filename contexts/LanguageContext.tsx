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
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("app_language");
        if (savedLanguage && translations[savedLanguage as Language]) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        throw error;
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("app_language", lang);
      setLanguageState(lang);
    } catch (error) {
      throw error;
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
