import { useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Article, Category } from '@shared/schema';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useLang } from '@/contexts/LangContext';
import { FullPageLoading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ArticlePage = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();
  const [match, params] = useRoute('/article/:slug');
  
  const slug = params?.slug || '';

  // Get article data
  const { data: article, isLoading: isArticleLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: relatedArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles', { limit: 3 }],
    enabled: !!article,
  });

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [slug]);

  if (isArticleLoading) {
    return <FullPageLoading text={t('article.loading')} />;
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('article.notFound')}</h1>
          <p className="mb-8">{t('article.notFoundDesc')}</p>
          <Button asChild>
            <Link href="/">{t('common.backToHome')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryName = (() => {
    const category = categories.find(c => c.id === article.categoryId);
    return category ? getLocalizedContent(category) : '';
  })();

  const formattedDate = article.publishedAt 
    ? format(new Date(article.publishedAt), 'd MMMM yyyy')
    : '';

  return (
    <div className="bg-white">
      {/* Article Header */}
      <div className="bg-[#00209F] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href={`/category/${categories.find(c => c.id === article.categoryId)?.slug || ''}`} className="inline-block px-3 py-1 bg-[#D42E12] text-white text-sm font-semibold rounded-full">
              {categoryName}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            {getLocalizedContent(article)}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-200 mb-6">
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{t('article.by')} Jean-Robert Louis</span>
            <span className="mx-2">•</span>
            <span>15 {t('article.minRead')}</span>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img 
              src={article.imageUrl} 
              alt={getLocalizedContent(article) as string} 
              className="w-full h-auto"
            />
          </div>
        )}
        
        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: getLocalizedContent(article) as string }} />
        </div>
        
        {/* Tags */}
        <div className="border-t border-b py-6 my-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Tags:</span>
            <Link href={`/category/${categories.find(c => c.id === article.categoryId)?.slug || ''}`} className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200">
              {categoryName}
            </Link>
            <Link href="/tag/haiti" className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200">
              Haiti
            </Link>
            <Link href="/tag/news" className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200">
              News
            </Link>
          </div>
        </div>
        
        {/* Author Info */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <div className="flex items-start">
            <img 
              src="https://i.pravatar.cc/64?img=12" 
              alt="Author" 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="font-heading font-bold text-xl mb-2">Jean-Robert Louis</h3>
              <p className="text-gray-600 mb-4">{t('article.authorBio')}</p>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-500 hover:text-[#00209F]">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-[#00209F]">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-[#00209F]">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold text-[#00209F] mb-6">{t('article.relatedArticles')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.filter(a => a.id !== article.id).slice(0, 3).map(relatedArticle => (
              <Link key={relatedArticle.id} href={`/article/${relatedArticle.slug}`}>
                <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  {relatedArticle.imageUrl ? (
                    <img 
                      src={relatedArticle.imageUrl} 
                      alt={getLocalizedContent(relatedArticle) as string} 
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://source.unsplash.com/random/400x250?sig=${relatedArticle.id}`} 
                      alt={getLocalizedContent(relatedArticle) as string} 
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2">
                      {getLocalizedContent(relatedArticle)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {relatedArticle.publishedAt 
                        ? format(new Date(relatedArticle.publishedAt), 'd MMM yyyy')
                        : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Back to Home */}
        <div className="text-center">
          <Button asChild>
            <Link href="/">{t('common.backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
