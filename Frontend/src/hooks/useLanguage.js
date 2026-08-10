import { useAuth, LANGUAGES } from '../shared/context/AuthContext';

export const useLanguage = () => {
  const { currentLang, updateLanguage } = useAuth();
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return {
    currentLang,
    currentLangObj,
    updateLanguage,
    languages: LANGUAGES,
  };
};

export default useLanguage;
