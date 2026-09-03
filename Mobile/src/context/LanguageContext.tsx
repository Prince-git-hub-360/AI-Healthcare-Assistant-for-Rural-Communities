import React, { createContext, useContext, useState, useEffect } from 'react';
import { SafeStorage } from '../services/safeStorage';
import { SUPPORTED_LANGUAGES, UI_STRINGS, LanguageOption } from '../constants/languages';
import { STORAGE_KEYS } from '../api/client';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => Promise<void>;
  languages: LanguageOption[];
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<string>('hi'); // Default Hindi for rural India

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await SafeStorage.getItem(STORAGE_KEYS.ACTIVE_LANGUAGE);
        if (savedLang) {
          setCurrentLanguageState(savedLang);
        }
      } catch {
        // Silently handled
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (code: string) => {
    setCurrentLanguageState(code);
    try {
      await SafeStorage.setItem(STORAGE_KEYS.ACTIVE_LANGUAGE, code);
    } catch {
      // Silently handled
    }
  };

  const t = (key: string, defaultText: string = ''): string => {
    const langDict = UI_STRINGS[currentLanguage] || UI_STRINGS['hi'] || UI_STRINGS['en'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary
    if (UI_STRINGS['en'] && UI_STRINGS['en'][key]) {
      return UI_STRINGS['en'][key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: SUPPORTED_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
