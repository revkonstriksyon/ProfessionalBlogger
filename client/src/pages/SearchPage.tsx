import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Article } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from 'lucide-react';
import ArticleCard from "@/components/articles/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";

export default function SearchPage() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState(() => {
    // Get search query from URL if present
    const params = new URLSearchParams(location.split('?')[1]);
    return params.get('q') || '';
  });
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Only search if we have a query
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/search', { q: searchQuery, limit: 12 }],
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue.trim());
  };

  // Create skeletons for loading state
  const skeletons = Array(6).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="bg-white rounded-lg overflow-hidden shadow-md">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    // Update URL with search query without refreshing the page
    const params = new URLSearchParams(location.split('?')[1]);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    const newUrl = `${location.split('?')[0]}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, location]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0D47A1] mb-4">{t('search.title')}</h1>
        
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex">
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="rounded-l-md"
            />
            <Button type="submit" className="bg-[#0D47A1] rounded-l-none">
              <Search className="h-4 w-4 mr-2" /> {t('search.button')}
            </Button>
          </div>
        </form>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {searchQuery ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-medium">{t('search.resultsFor', { query: searchQuery })}</h2>
                {articles && <p className="text-gray-600">{t('search.resultsCount', { count: articles.length })}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading 
                  ? skeletons
                  : articles && articles.length > 0
                    ? articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))
                    : <p className="col-span-2 text-center py-8">{t('search.noResults', { query: searchQuery })}</p>
                }
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">{t('search.enterQuery')}</h2>
              <p className="text-gray-600">{t('search.instructions')}</p>
            </div>
          )}
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
