import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLang } from '@/contexts/LangContext';

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const { t } = useTranslation();
  const { currentLang, changeLang } = useLang();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ht', name: 'Kreyòl', flag: 'ht' },
    { code: 'fr', name: 'Français', flag: 'fr' },
    { code: 'en', name: 'English', flag: 'us' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const handleLanguageChange = (code: 'ht' | 'fr' | 'en') => {
    changeLang(code);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="flex space-x-2">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'ht' | 'fr' | 'en')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentLang === lang.code ? 'text-[#00209F]' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm font-medium text-gray-700 hover:text-[#00209F]"
      >
        <span className={`fi fi-${currentLanguage.flag} mr-1`}></span>
        <span>{currentLanguage.name}</span>
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as 'ht' | 'fr' | 'en')}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className={`fi fi-${lang.flag} mr-2`}></span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
