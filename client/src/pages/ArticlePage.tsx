import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Article, Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "@/components/articles/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr, frCA } from "date-fns/locale";

const getLocale = (langCode: string) => {
  switch (langCode) {
    case 'fr': return fr;
    case 'en': return enUS;
    default: return frCA; // Closest to Haitian Creole
  }
};

export default function ArticlePage() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const langCode = t('languageCode');
  
  const { data: article, isLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${article?.category_id}`],
    enabled: !!article?.category_id,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const { data: relatedArticles } = useQuery<Article[]>({
    queryKey: [`/api/articles/related/${article?.id}`, { limit: 3 }],
    enabled: !!article?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Format relative date based on current language
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    const locale = getLocale(i18n.language || 'ht');
    
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-64 md:h-80" />
              <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
              </div>
            </div>
          ) : article ? (
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={article.image_url} 
                alt={article[`title_${langCode}` as keyof Article] as string} 
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-[#0D47A1] text-white text-xs px-2 py-1 rounded-sm">
                    {category ? category[`name_${langCode}` as keyof Category] : t(`categories.${article.category_id}`)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(article.published_at)} • {article.read_time} {t('common.min')}
                  </span>
                </div>
                
                <h1 className="text-3xl font-serif font-bold mb-4">
                  {article[`title_${langCode}` as keyof Article] as string}
                </h1>
                
                <div className="flex items-center mb-6">
                  <img 
                    src={`https://randomuser.me/api/portraits/${article.id % 2 === 0 ? 'men' : 'women'}/${article.id % 100}.jpg`} 
                    alt="Author" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold">Author Name</p>
                    <p className="text-sm text-gray-500">{t(`authorRoles.${article.category_id}`)}</p>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  {(article[`content_${langCode}` as keyof Article] as string)
                    .split('\n')
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  }
                </div>
                
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-4 border-t">
                    <h3 className="font-semibold mb-2">{t('article.tags')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <a 
                          key={tag} 
                          href={`/tag/${tag}`} 
                          className="px-3 py-1 bg-gray-100 hover:bg-[#0D47A1] hover:text-white rounded-full text-sm transition"
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-serif font-bold mb-2">{t('article.notFound.title')}</h1>
              <p>{t('article.notFound.description')}</p>
            </div>
          )}
          
          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-serif font-bold text-[#0D47A1] mb-4">{t('article.relatedArticles')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
