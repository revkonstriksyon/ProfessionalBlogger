import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@shared/schema';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
}

const defaultContext: LanguageContextType = {
  language: 'ht',
  changeLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('i18nextLng') as Language) || 'ht'
  );

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  // Set initial language from browser or localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['ht', 'fr', 'en'].includes(storedLang)) {
      setLanguage(storedLang as Language);
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  // Update language state when i18n language changes
  useEffect(() => {
    if (i18n.language && ['ht', 'fr', 'en'].includes(i18n.language)) {
      setLanguage(i18n.language as Language);
    }
  }, [i18n.language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
