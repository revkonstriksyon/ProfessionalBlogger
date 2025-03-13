import React, { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Article } from '@shared/schema';

const LatestNews: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data: latestArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/latest', { limit: page * 3 }],
  });

  const filteredArticles = filter === 'all' 
    ? latestArticles 
    : latestArticles.filter(article => {
        if (filter === 'politics') return article.categoryId === 2;
        if (filter === 'economy') return article.categoryId === 3;
        return true;
      });

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-primary">{t('latest.title')}</h2>
        <div className="flex space-x-1">
          <button 
            className={`px-3 py-1 text-sm ${filter === 'all' 
              ? 'border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition' 
              : 'border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition'}`}
            onClick={() => setFilter('all')}
          >
            {t('latest.all')}
          </button>
          <button 
            className={`px-3 py-1 text-sm ${filter === 'politics' 
              ? 'border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition' 
              : 'border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition'}`}
            onClick={() => setFilter('politics')}
          >
            {t('latest.politics')}
          </button>
          <button 
            className={`px-3 py-1 text-sm ${filter === 'economy' 
              ? 'border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition' 
              : 'border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition'}`}
            onClick={() => setFilter('economy')}
          >
            {t('latest.economy')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading 
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
                <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                  <Skeleton className="w-full h-32 md:h-full rounded-lg" />
                </div>
                <div className="md:w-3/4">
                  <Skeleton className="h-5 w-20 rounded-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))
          : filteredArticles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row">
                <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                  <img
                    src={article.imageUrl}
                    alt={article.title[language]}
                    className="w-full h-32 md:h-full object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-3/4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full mb-2">
                    {article.categoryId === 5 ? 'AGRIKILTI' : 
                     article.categoryId === 7 ? 'TEKNOLOJI' : 
                     article.categoryId === 6 ? 'SANTE' : 'KATEGORI'}
                  </span>
                  <Link href={`/article/${article.slug}`}>
                    <a>
                      <h3 className="font-heading font-bold text-lg mb-2 hover:text-accent">
                        {article.title[language]}
                      </h3>
                    </a>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3">{article.excerpt[language]}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <img
                        src={article.authorImageUrl || 'https://via.placeholder.com/40'}
                        alt={article.author}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-gray-700">{article.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      <i className="far fa-clock mr-1"></i> 
                      {new Date(article.publishedAt).toLocaleDateString(
                        language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht'
                      )}
                    </span>
                  </div>
                </div>
              </article>
            ))}

        {filteredArticles.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => setPage(prev => prev + 1)}
              className="px-6 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition"
            >
              {t('latest.loadMore')} <i className="fas fa-angle-down ml-1"></i>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestNews;
