import { useQuery } from '@tanstack/react-query';
import { Article, Category } from '@shared/schema';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLang } from '@/contexts/LangContext';
import { Skeleton } from '@/components/ui/skeleton';

const LatestNews = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { limit: 3 }],
  });

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? getLocalizedContent(category) : '';
  };

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#D42E12';
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-40 bg-gray-200" />
            <Skeleton className="h-6 w-32 bg-gray-200" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
                <Skeleton className="h-48 w-full bg-gray-200" />
                <div className="p-6">
                  <Skeleton className="h-6 w-full bg-gray-200 mb-2" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200 mb-4" />
                  <Skeleton className="h-4 w-full bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-5/6 bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-4/6 bg-gray-200 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F]">{t('latestNews.title')}</h2>
          <Link href="/news" className="text-[#D42E12] font-medium hover:text-[#00209F]">
            {t('latestNews.viewAll')} <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => {
            const formattedDate = article.publishedAt 
              ? format(new Date(article.publishedAt), 'd MMM yyyy')
              : '';
              
            return (
              <article key={article.id} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
                <div className="relative h-48">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={getLocalizedContent(article) as string} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://source.unsplash.com/random/400x250?sig=${article.id}`}
                      alt={getLocalizedContent(article) as string}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="inline-block px-3 py-1 text-white text-xs font-semibold rounded-full"
                      style={{ backgroundColor: getCategoryColor(article.categoryId) }}
                    >
                      {getCategoryName(article.categoryId)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 hover:text-[#D42E12] transition">
                    {getLocalizedContent(article)}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{formattedDate}</span>
                    <Link href={`/article/${article.slug}`} className="text-[#00209F] font-medium hover:text-[#D42E12]">
                      {t('common.readMore')}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
