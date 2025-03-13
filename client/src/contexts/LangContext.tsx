import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageType = 'ht' | 'fr' | 'en';

interface LangContextType {
  currentLang: LanguageType;
  changeLang: (lang: LanguageType) => void;
  getLocalizedContent: <T>(content: Record<string, T>) => T;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

interface LangProviderProps {
  children: ReactNode;
}

export const LangProvider = ({ children }: LangProviderProps) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<LanguageType>(
    (localStorage.getItem('language') as LanguageType) || 'ht'
  );

  const changeLang = (lang: LanguageType) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Function to get localized content based on current language
  const getLocalizedContent = <T,>(content: Record<string, T>): T => {
    const langMap = {
      ht: 'titleHt' as keyof typeof content,
      fr: 'titleFr' as keyof typeof content,
      en: 'titleEn' as keyof typeof content
    };
    
    // For content fields
    const contentLangMap = {
      ht: 'contentHt' as keyof typeof content,
      fr: 'contentFr' as keyof typeof content,
      en: 'contentEn' as keyof typeof content
    };
    
    // For option fields
    const optionLangMap = {
      ht: 'optionHt' as keyof typeof content,
      fr: 'optionFr' as keyof typeof content,
      en: 'optionEn' as keyof typeof content
    };
    
    // For name fields
    const nameLangMap = {
      ht: 'nameHt' as keyof typeof content,
      fr: 'nameFr' as keyof typeof content,
      en: 'nameEn' as keyof typeof content
    };

    // For question fields
    const questionLangMap = {
      ht: 'questionHt' as keyof typeof content,
      fr: 'questionFr' as keyof typeof content,
      en: 'questionEn' as keyof typeof content
    };
    
    // For description fields
    const descriptionLangMap = {
      ht: 'descriptionHt' as keyof typeof content,
      fr: 'descriptionFr' as keyof typeof content,
      en: 'descriptionEn' as keyof typeof content
    };

    if (content[langMap[currentLang]]) {
      return content[langMap[currentLang]];
    } else if (content[contentLangMap[currentLang]]) {
      return content[contentLangMap[currentLang]];
    } else if (content[optionLangMap[currentLang]]) {
      return content[optionLangMap[currentLang]];
    } else if (content[nameLangMap[currentLang]]) {
      return content[nameLangMap[currentLang]];
    } else if (content[questionLangMap[currentLang]]) {
      return content[questionLangMap[currentLang]];
    } else if (content[descriptionLangMap[currentLang]]) {
      return content[descriptionLangMap[currentLang]];
    }
    
    // Fallback to content itself if no localized version found
    return Object.values(content)[0];
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const value = {
    currentLang,
    changeLang,
    getLocalizedContent
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

export const useLang = () => {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
};
