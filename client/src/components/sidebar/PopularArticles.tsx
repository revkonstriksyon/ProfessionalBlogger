import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr, frCA } from 'date-fns/locale';

const getLocale = (langCode: string) => {
  switch (langCode) {
    case 'fr': return fr;
    case 'en': return enUS;
    default: return frCA; // Closest to Haitian Creole
  }
};

export default function PopularArticles() {
  const { t, i18n } = useTranslation();
  
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/popular', 3],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Format relative date based on current language
  const formatDate = (date: Date | string) => {
    const langCode = i18n.language || 'ht';
    const locale = getLocale(langCode);
    
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale
    });
  };

  // Loading skeleton
  const skeletons = Array(3).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="flex">
      <div className="flex-shrink-0 w-20 h-20">
        <Skeleton className="w-full h-full rounded" />
      </div>
      <div className="ml-3">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
    </div>
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif font-bold text-lg pb-2 border-b text-[#0D47A1]">
          {t('popularArticles.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading 
            ? skeletons
            : articles && articles.length > 0
              ? articles.map((article) => (
                  <div key={article.id} className="flex">
                    <div className="flex-shrink-0 w-20 h-20">
                      <img 
                        src={article.image_url} 
                        alt={article[`title_${t('languageCode')}` as keyof Article] as string} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="ml-3">
                      <Link href={`/article/${article.slug}`}>
                        <a className="font-medium text-sm hover:text-primary-600">
                          {article[`title_${t('languageCode')}` as keyof Article] as string}
                        </a>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(article.published_at)}
                      </p>
                    </div>
                  </div>
                ))
              : <p className="text-center py-4">{t('common.noArticlesFound')}</p>
          }
        </div>
      </CardContent>
    </Card>
  );
}
