import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import type { Language } from '@shared/schema';

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'header' }) => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const isHeader = variant === 'header';
  const isFooter = variant === 'footer';

  return (
    <div className={`flex ${isHeader ? 'space-x-1 border rounded-full px-3 py-1' : 'space-x-1'}`}>
      <button
        className={`text-sm font-semibold ${
          language === 'ht'
            ? isHeader
              ? 'text-white bg-primary px-3 py-1 rounded-full'
              : 'text-white bg-primary px-3 py-1 rounded-full'
            : isHeader
            ? 'text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100'
            : 'text-gray-300 border border-gray-600 px-3 py-1 rounded-full hover:bg-white hover:text-primary transition'
        }`}
        onClick={() => changeLanguage('ht')}
      >
        Kreyòl
      </button>
      <button
        className={`text-sm font-semibold ${
          language === 'fr'
            ? isHeader
              ? 'text-white bg-primary px-3 py-1 rounded-full'
              : 'text-white bg-primary px-3 py-1 rounded-full'
            : isHeader
            ? 'text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100'
            : 'text-gray-300 border border-gray-600 px-3 py-1 rounded-full hover:bg-white hover:text-primary transition'
        }`}
        onClick={() => changeLanguage('fr')}
      >
        Français
      </button>
      <button
        className={`text-sm font-semibold ${
          language === 'en'
            ? isHeader
              ? 'text-white bg-primary px-3 py-1 rounded-full'
              : 'text-white bg-primary px-3 py-1 rounded-full'
            : isHeader
            ? 'text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100'
            : 'text-gray-300 border border-gray-600 px-3 py-1 rounded-full hover:bg-white hover:text-primary transition'
        }`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
