import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer';
}

export default function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      document.documentElement.lang = lng;
      localStorage.setItem('i18nextLng', lng);
      setCurrentLang(lng);
    });
  };

  const buttonClass = variant === 'footer' 
    ? 'text-sm text-white hover:text-gray-200' 
    : 'text-sm';

  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`${buttonClass} ${currentLang === 'ht' ? 'font-bold' : ''}`}
        onClick={() => changeLanguage('ht')}
      >
        Kreyòl
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`${buttonClass} ${currentLang === 'fr' ? 'font-bold' : ''}`}
        onClick={() => changeLanguage('fr')}
      >
        Français
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`${buttonClass} ${currentLang === 'en' ? 'font-bold' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </Button>
    </div>
  );
}