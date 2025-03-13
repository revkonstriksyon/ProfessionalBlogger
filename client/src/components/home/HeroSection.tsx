import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-[#00209F] to-primary py-8 md:py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t('hero.welcome')}
            </h1>
            <p className="text-lg mb-6">{t('hero.subtitle')}</p>
            <div className="flex space-x-3">
              <Link href="/category/actualite">
                <a className="bg-[#D21034] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
                  {t('hero.latestNews')}
                </a>
              </Link>
              <Link href="#newsletter">
                <a className="bg-white hover:bg-gray-100 text-primary font-semibold py-2 px-4 rounded-lg transition duration-200">
                  {t('hero.subscribe')}
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=450&fit=crop"
              alt="Peyizaj Ayiti"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
