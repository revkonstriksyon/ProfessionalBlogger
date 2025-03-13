import { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article, Category } from '@shared/schema';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLang } from '@/contexts/LangContext';
import { FullPageLoading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();
  const [match, params] = useRoute('/category/:slug');
  
  const slug = params?.slug || '';

  // Get category data
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories.find(c => c.slug === slug);

  // Get articles for this category
  const { data: articles = [], isLoading: isArticlesLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/category/${category?.id}`],
    enabled: !!category?.id,
  });

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (isCategoriesLoading || isArticlesLoading) {
    return <FullPageLoading text={t('category.loading')} />;
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('category.notFound')}</h1>
          <p className="mb-8">{t('category.notFoundDesc')}</p>
          <Button asChild>
            <Link href="/">{t('common.backToHome')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Category Header */}
      <div className="bg-[#00209F] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{ 
              backgroundColor: `${category.color}20`,
              color: '#fff'
            }}
          >
            <i className={`fas fa-${category.icon} fa-lg`}></i>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            {getLocalizedContent(category)}
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-200">
            {t('category.description', { category: getLocalizedContent(category) })}
          </p>
        </div>
      </div>
      
      {/* Articles List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-600 mb-4">{t('category.noArticles')}</h2>
            <p className="mb-8 text-gray-500">{t('category.noArticlesDesc')}</p>
            <Button asChild>
              <Link href="/">{t('common.backToHome')}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl mb-3 line-clamp-2 hover:text-[#D42E12] transition">
                    {getLocalizedContent(article)}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {article.publishedAt 
                        ? format(new Date(article.publishedAt), 'd MMM yyyy')
                        : ''}
                    </span>
                    <Link href={`/article/${article.slug}`} className="text-[#00209F] font-medium hover:text-[#D42E12]">
                      {t('common.readMore')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      
      {/* Categories Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-[#00209F] mb-6">{t('category.otherCategories')}</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {categories.filter(c => c.id !== category.id).map(otherCategory => (
            <Link 
              key={otherCategory.id} 
              href={`/category/${otherCategory.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ 
                  backgroundColor: otherCategory.color,
                  color: '#fff'
                }}
              >
                <i className={`fas fa-${otherCategory.icon} fa-xs`}></i>
              </div>
              <span className="font-medium">{getLocalizedContent(otherCategory)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
