import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';
import type { Article } from '@shared/schema';

const FeaturedArticles: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const { data: featuredArticles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-primary">{t('featured.title')}</h2>
        <Link href="/articles">
          <a className="text-accent hover:underline font-semibold">
            {t('featured.viewAll')} <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          : featuredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={article.imageUrl}
                    alt={article.title[language]}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-secondary text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {article.categoryId === 1
                      ? 'KILTI'
                      : article.categoryId === 2
                      ? 'EKONOMI'
                      : article.categoryId === 3
                      ? 'EDIKASYON'
                      : 'KATEGORI'}
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/article/${article.slug}`}>
                    <a>
                      <h3 className="font-heading font-bold text-lg mb-2 hover:text-accent">
                        {article.title[language]}
                      </h3>
                    </a>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3">{article.excerpt[language]}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      <i className="far fa-clock mr-1"></i>{' '}
                      {new Date(article.publishedAt).toLocaleDateString(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht')}
                    </span>
                    <span>
                      <i className="far fa-comment mr-1"></i> {article.commentCount} {t('blog.comments')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};

export default FeaturedArticles;
