import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroSection() {
  const { t } = useTranslation();
  
  const { data: featuredArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/featured', 1],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const mainFeaturedArticle = featuredArticles && featuredArticles.length > 0 ? featuredArticles[0] : null;

  return (
    <section className="bg-gradient-to-r from-[#0D47A1] to-primary-700 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-6">
              {t('hero.subtitle')}
            </p>
            <div className="flex space-x-4">
              <Link href="/category/news">
                <a className="bg-[#FFC107] hover:bg-[#FFECB3] transition text-[#0D47A1] font-semibold px-6 py-3 rounded-md">
                  {t('hero.latestNewsButton')}
                </a>
              </Link>
              <Link href="/subscribe">
                <a className="bg-white bg-opacity-20 hover:bg-opacity-30 transition px-6 py-3 rounded-md">
                  {t('hero.subscribeButton')}
                </a>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            {isLoading ? (
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Skeleton className="w-full h-64 md:h-80" />
              </div>
            ) : mainFeaturedArticle ? (
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={mainFeaturedArticle.image_url} 
                  alt={mainFeaturedArticle[`title_${t('languageCode')}` as keyof Article] as string} 
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <span className="bg-[#D32F2F] text-white text-xs px-2 py-1 rounded-sm">
                      {t(`categories.${mainFeaturedArticle.category_id}`)}
                    </span>
                    <Link href={`/article/${mainFeaturedArticle.slug}`}>
                      <a className="block">
                        <h3 className="text-white text-xl md:text-2xl font-serif font-bold mt-2">
                          {mainFeaturedArticle[`title_${t('languageCode')}` as keyof Article] as string}
                        </h3>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-800 flex items-center justify-center h-64 md:h-80">
                <p className="text-white text-lg">{t('common.noArticlesFound')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
