import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Article, Category } from "@shared/schema";
import ArticleCard from "@/components/articles/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const langCode = t('languageCode');
  
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const { data: articles, isLoading: isArticlesLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${category?.id}`, { limit: 12 }],
    enabled: !!category?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const isLoading = isCategoryLoading || isArticlesLoading;
  
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0D47A1] mb-2">
          {isCategoryLoading 
            ? <Skeleton className="h-9 w-1/4" /> 
            : category ? category[`name_${langCode}` as keyof Category] : t('common.categoryNotFound')
          }
        </h1>
        <p className="text-gray-600">{t('category.description')}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {isLoading 
              ? skeletons
              : articles && articles.length > 0
                ? articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                : <p className="col-span-2 text-center py-8">{t('common.noArticlesFound')}</p>
            }
          </div>
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
