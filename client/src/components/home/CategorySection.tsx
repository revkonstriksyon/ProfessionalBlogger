import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLang } from '@/contexts/LangContext';
import { Skeleton } from '@/components/ui/skeleton';

const CategorySection = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getIconClass = (icon: string) => {
    return `fas fa-${icon} fa-lg`;
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-40 bg-gray-200 mb-8" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="p-6 rounded-lg shadow-md bg-white">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-full bg-gray-200 mb-3" />
                  <Skeleton className="h-5 w-24 bg-gray-200 mb-1" />
                  <Skeleton className="h-4 w-16 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F] mb-8">{t('categories.title')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="flex flex-col items-center p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-center mb-3"
                style={{ 
                  backgroundColor: `${category.color}10`,
                  color: category.color 
                }}
              >
                <i className={getIconClass(category.icon)}></i>
              </div>
              <h3 className="font-heading font-semibold text-[#00209F]">
                {getLocalizedContent(category)}
              </h3>
              <span className="mt-1 text-sm text-gray-500">
                {/* In a real app, this would show article count */}
                {Math.floor(Math.random() * 30) + 5} {t('categories.articles')}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
