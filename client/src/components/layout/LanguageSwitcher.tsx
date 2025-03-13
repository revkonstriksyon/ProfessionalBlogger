import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className={cn("language-switcher flex space-x-4 text-sm", className)}>
      <button
        className={`transition px-2 py-1 rounded hover:bg-gray-100 ${i18n.language === 'ht' ? 'text-[#FFC107] font-bold' : ''}`}
        onClick={() => changeLanguage('ht')}
        aria-label="Switch to Kreyòl"
      >
        Kreyòl
      </button>
      <button
        className={`transition px-2 py-1 rounded hover:bg-gray-100 ${i18n.language === 'fr' ? 'text-[#FFC107] font-bold' : ''}`}
        onClick={() => changeLanguage('fr')}
        aria-label="Switch to Français"
      >
        Français
      </button>
      <button
        className={`transition px-2 py-1 rounded hover:bg-gray-100 ${i18n.language === 'en' ? 'text-[#FFC107] font-bold' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  );
}
