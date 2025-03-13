import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import type { Article } from '@shared/schema';

const BreakingNews: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: breakingNews = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/breaking-news'],
  });

  useEffect(() => {
    if (breakingNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (isLoading || breakingNews.length === 0) return null;

  return (
    <div className="bg-[#D21034] text-white py-3">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center">
          <div className="bg-white text-[#D21034] font-bold py-1 px-3 rounded mr-3">
            <span>{t('breaking.title')}</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee inline-block">
              {breakingNews.map((article, index) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <a className={`inline-block px-4 ${index === currentIndex ? 'opacity-100' : 'opacity-0 absolute'}`}>
                    {article.title[language]}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
