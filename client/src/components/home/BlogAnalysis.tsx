import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import BlogPostCard from '../articles/BlogPostCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogAnalysis() {
  const { t } = useTranslation();
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { limit: 2 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create skeletons for loading state
  const skeletons = Array(2).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="bg-white rounded-lg overflow-hidden shadow-md mb-6 flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <Skeleton className="w-full h-48 md:h-full" />
      </div>
      <div className="md:w-2/3 p-4 md:p-6">
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex items-center mb-2">
          <Skeleton className="w-8 h-8 rounded-full mr-2" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  ));

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#0D47A1]">{t('blogAnalysis.title')}</h2>
        <Link href="/blog">
          <a className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
            {t('common.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>

      {isLoading 
        ? skeletons
        : articles && articles.length > 0
          ? articles.map((article) => (
              <BlogPostCard key={article.id} article={article} />
            ))
          : <p className="text-center py-8">{t('common.noArticlesFound')}</p>
      }
    </section>
  );
}
