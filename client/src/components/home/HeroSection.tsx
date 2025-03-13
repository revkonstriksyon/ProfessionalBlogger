import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLang } from '@/contexts/LangContext';
import { Skeleton } from '@/components/ui/skeleton';

const HeroSection = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();

  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured'],
  });

  if (isLoading) {
    return (
      <section className="bg-[#00209F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Skeleton className="inline-block h-8 w-24 bg-white/20 rounded-full mb-4" />
              <Skeleton className="h-14 w-full bg-white/20 mb-3" />
              <Skeleton className="h-14 w-3/4 bg-white/20 mb-4" />
              <Skeleton className="h-6 w-full bg-white/20 mb-4" />
              <Skeleton className="h-6 w-5/6 bg-white/20 mb-6" />
              <Skeleton className="h-4 w-40 bg-white/20 mb-6" />
              <Skeleton className="inline-block h-12 w-32 bg-white/20 rounded-lg" />
            </div>
            <Skeleton className="h-80 w-full bg-white/20 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return null;
  }

  const heroArticle = featuredArticles[0];
  const categoryName = "AKTUALITE"; // This would come from the category object in a real app
  const formattedDate = heroArticle.publishedAt 
    ? format(new Date(heroArticle.publishedAt), 'd MMM yyyy')
    : '';

  return (
    <section className="bg-[#00209F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-[#D42E12] text-white text-sm font-semibold rounded-full mb-4">
              {categoryName}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
              {getLocalizedContent(heroArticle)}
            </h1>
            <p className="text-lg mb-6 text-gray-100">
              {heroArticle.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-200">
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{t('article.by')} Jean-Robert Louis</span>
            </div>
            <Link href={`/article/${heroArticle.slug}`} className="inline-block mt-6 px-6 py-3 bg-[#FFCC00] text-[#00209F] font-semibold rounded-lg hover:bg-opacity-90 transition">
              {t('common.readMore')}
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            {heroArticle.imageUrl ? (
              <img 
                src={heroArticle.imageUrl} 
                alt={getLocalizedContent(heroArticle) as string} 
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1590846434581-8d5992257745?auto=format&fit=crop&q=80&w=800&h=500" 
                alt={getLocalizedContent(heroArticle) as string}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
