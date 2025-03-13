import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PopularPosts from '@/components/sidebar/PopularPosts';
import Newsletter from '@/components/sidebar/Newsletter';
import TagsWidget from '@/components/sidebar/TagsWidget';
import type { Article } from '@shared/schema';

const Search: React.FC = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Extract search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location]);

  // Search articles
  const { data: searchResults = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/search', { q: searchQuery, lang: language }],
    enabled: searchQuery.length > 0,
  });

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const displayedResults = searchResults.slice(0, page * limit);
  const hasMore = displayedResults.length < searchResults.length;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">
          {t('search.results')}
        </h1>
        <p className="text-lg text-gray-600">
          {searchQuery ? (
            t('search.resultsFor', { query: searchQuery })
          ) : (
            t('search.enterQuery')
          )}
        </p>
        <div className="h-1 w-20 bg-accent mt-4"></div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get('search') as string;
            if (query.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
            }
          }}
          className="flex"
        >
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder={t('search.placeholder')}
            className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent/80 text-white px-4 rounded-r-lg"
          >
            <i className="fas fa-search"></i>
          </button>
        </form>
      </div>

      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          {!searchQuery ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('search.startSearching')}
              </h3>
              <p className="text-gray-600">
                {t('search.startSearchingDescription')}
              </p>
            </div>
          ) : isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
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
          ) : searchResults.length > 0 ? (
            <div className="space-y-6">
              {displayedResults.map((article) => (
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
                      {article.categoryId === 1 ? 'KILTI' : 
                       article.categoryId === 2 ? 'POLITIK' : 
                       article.categoryId === 3 ? 'EDIKASYON' : 'KATEGORI'}
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
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    className="px-6 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition"
                  >
                    {t('search.loadMore')} <i className="fas fa-angle-down ml-1"></i>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('search.noResults')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('search.tryDifferentQuery')}
              </p>
            </div>
          )}
        </div>
        
        <div className="md:w-1/3 space-y-8 mt-8 md:mt-0">
          <PopularPosts />
          <Newsletter />
          <TagsWidget />
        </div>
      </div>
    </main>
  );
};

export default Search;
