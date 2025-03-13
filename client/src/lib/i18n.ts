import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import htTranslation from '../locales/ht.json';
import frTranslation from '../locales/fr.json';
import enTranslation from '../locales/en.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ht: {
        translation: htTranslation
      },
      fr: {
        translation: frTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    lng: localStorage.getItem('language') || 'ht', // Default language
    fallbackLng: 'ht',
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
