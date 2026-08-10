import React, { createContext, useContext } from 'react';
import { useAuth, LANGUAGES } from '../shared/context/AuthContext';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { currentLang, updateLanguage } = useAuth();
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ currentLang, currentLangObj, updateLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
export default LanguageContext;
