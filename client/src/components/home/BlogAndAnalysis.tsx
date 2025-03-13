import { useQuery } from '@tanstack/react-query';
import { Article, Category } from '@shared/schema';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLang } from '@/contexts/LangContext';
import { Skeleton } from '@/components/ui/skeleton';

const BlogAndAnalysis = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { limit: 5 }],
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
            <Skeleton className="h-8 w-48 bg-gray-200" />
            <Skeleton className="h-6 w-32 bg-gray-200" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg bg-gray-200" />
            
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col md:flex-row gap-5 p-5 rounded-lg shadow-md bg-gray-100">
                  <Skeleton className="md:w-1/3 h-32 rounded-lg bg-gray-200" />
                  <div className="md:w-2/3">
                    <Skeleton className="h-4 w-16 bg-gray-200 mb-2" />
                    <Skeleton className="h-6 w-full bg-gray-200 mb-2" />
                    <Skeleton className="h-4 w-5/6 bg-gray-200 mb-3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-32 bg-gray-200" />
                      <Skeleton className="h-3 w-16 bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  // Use the first article as the featured one
  const featuredArticle = articles[0];
  // Use the rest for the sidebar
  const sidebarArticles = articles.slice(1, 4);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F]">{t('blog.title')}</h2>
          <Link href="/blog" className="text-[#D42E12] font-medium hover:text-[#00209F]">
            {t('blog.viewAll')} <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative h-64">
              {featuredArticle.imageUrl ? (
                <img 
                  src={featuredArticle.imageUrl} 
                  alt={getLocalizedContent(featuredArticle) as string} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600&h=350"
                  alt={getLocalizedContent(featuredArticle) as string}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <span 
                  className="inline-block px-3 py-1 text-white text-xs font-semibold rounded-full mb-3"
                  style={{ backgroundColor: getCategoryColor(featuredArticle.categoryId) }}
                >
                  {getCategoryName(featuredArticle.categoryId)}
                </span>
                <h3 className="text-white font-heading font-bold text-2xl">
                  {getLocalizedContent(featuredArticle)}
                </h3>
                <div className="flex items-center mt-4 text-white">
                  <img 
                    src="https://i.pravatar.cc/40?img=12" 
                    alt="Author" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">Pwofesè Jean Baptiste</p>
                    <p className="text-sm opacity-80">Ekonomis, Inivèsite Leta Ayiti</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                {featuredArticle.excerpt}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {featuredArticle.publishedAt 
                    ? format(new Date(featuredArticle.publishedAt), 'd MMM yyyy')
                    : ''} | 15 min {t('blog.readTime')}
                </span>
                <Link href={`/article/${featuredArticle.slug}`} className="text-[#00209F] font-medium hover:text-[#D42E12]">
                  {t('common.readMore')}
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {sidebarArticles.map(article => (
              <article key={article.id} className="flex flex-col md:flex-row gap-5 p-5 rounded-lg shadow-md hover:shadow-lg transition bg-white">
                <div className="md:w-1/3">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={getLocalizedContent(article) as string} 
                      className="w-full h-32 md:h-full object-cover rounded-lg"
                    />
                  ) : (
                    <img 
                      src={`https://source.unsplash.com/random/200x150?sig=${article.id}`}
                      alt={getLocalizedContent(article) as string}
                      className="w-full h-32 md:h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="md:w-2/3">
                  <span 
                    className="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2"
                    style={{ 
                      backgroundColor: getCategoryColor(article.categoryId),
                      color: getCategoryColor(article.categoryId) === '#FFCC00' ? '#00209F' : 'white'
                    }}
                  >
                    {getCategoryName(article.categoryId)}
                  </span>
                  <h3 className="font-heading font-bold text-lg mb-2 hover:text-[#D42E12] transition">
                    {getLocalizedContent(article)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {article.publishedAt 
                        ? format(new Date(article.publishedAt), 'd MMM yyyy')
                        : ''} | 8 min {t('blog.readTime')}
                    </span>
                    <Link href={`/article/${article.slug}`} className="text-[#00209F] font-medium hover:text-[#D42E12]">
                      {t('common.readMore')}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogAndAnalysis;
