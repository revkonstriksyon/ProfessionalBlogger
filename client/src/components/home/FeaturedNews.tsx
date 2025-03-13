import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import ArticleCard from '../articles/ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeaturedNews() {
  const { t } = useTranslation();
  
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured', 3],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create skeletons for loading state
  const skeletons = Array(3).fill(0).map((_, i) => (
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

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#0D47A1]">{t('featuredNews.title')}</h2>
        <Link href="/category/news">
          <a className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
            {t('common.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading 
          ? skeletons
          : featuredArticles && featuredArticles.length > 0
            ? featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            : <p className="col-span-3 text-center py-8">{t('common.noArticlesFound')}</p>
        }
      </div>
    </section>
  );
}
