import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PopularPosts from '@/components/sidebar/PopularPosts';
import Newsletter from '@/components/sidebar/Newsletter';
import PollWidget from '@/components/sidebar/PollWidget';
import TagsWidget from '@/components/sidebar/TagsWidget';
import SocialMedia from '@/components/sidebar/SocialMedia';
import type { Article, Category } from '@shared/schema';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  const limit = 5;

  // Reset page when slug changes
  useEffect(() => {
    setPage(1);
  }, [slug]);

  // Fetch category
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get the current category
  const currentCategory = categories?.find(cat => cat.slug === slug);

  // Fetch articles by category
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${slug}`, { limit: page * limit, offset: 0 }],
    enabled: !!slug,
  });

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const getCategoryName = () => {
    if (!currentCategory) return slug;
    // Convert first letter to uppercase
    return currentCategory.name.charAt(0).toUpperCase() + currentCategory.name.slice(1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">{getCategoryName()}</h1>
        <div className="h-1 w-20 bg-accent"></div>
      </div>

      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          {isLoading ? (
            Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row mb-6">
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
          ) : articles.length > 0 ? (
            <div className="space-y-6">
              {articles.map((article) => (
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
                      {getCategoryName().toUpperCase()}
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

              {/* Load More Button */}
              {articles.length >= page * limit && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    className="px-6 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition"
                  >
                    {t('latest.loadMore')} <i className="fas fa-angle-down ml-1"></i>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('categoryPage.noArticles')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('categoryPage.checkBackSoon')}
              </p>
              <Link href="/">
                <a className="inline-block px-5 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition">
                  {t('categoryPage.backToHome')}
                </a>
              </Link>
            </div>
          )}
        </div>
        
        <div className="md:w-1/3 space-y-8 mt-8 md:mt-0">
          <PopularPosts />
          <Newsletter />
          <PollWidget />
          <TagsWidget />
          <SocialMedia />
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
