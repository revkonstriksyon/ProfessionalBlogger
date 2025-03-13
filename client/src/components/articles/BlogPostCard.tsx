import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Article } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr, frCA } from 'date-fns/locale';

interface BlogPostCardProps {
  article: Article;
}

const getLocale = (langCode: string) => {
  switch (langCode) {
    case 'fr': return fr;
    case 'en': return enUS;
    default: return frCA; // Closest to Haitian Creole
  }
};

export default function BlogPostCard({ article }: BlogPostCardProps) {
  const { t, i18n } = useTranslation();
  const currentLang = t('languageCode');
  
  const title = article[`title_${currentLang}` as keyof Article] as string;
  const excerpt = article[`excerpt_${currentLang}` as keyof Article] as string;
  
  // Format relative date based on current language
  const formatDate = (date: Date | string) => {
    const langCode = i18n.language || 'ht';
    const locale = getLocale(langCode);
    
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale
    });
  };

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md mb-6 transition hover:shadow-lg flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <img 
          src={article.image_url} 
          alt={title} 
          className="w-full h-48 md:h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-4 md:p-6">
        <span className="bg-[#0D47A1] text-white text-xs px-2 py-1 rounded-sm">
          {t(`categories.${article.category_id}`)}
        </span>
        <Link href={`/article/${article.slug}`}>
          <a className="block">
            <h3 className="font-serif font-semibold text-xl mt-3 mb-2 hover:text-primary-600">
              {title}
            </h3>
          </a>
        </Link>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <img 
            src={`https://randomuser.me/api/portraits/${article.id % 2 === 0 ? 'men' : 'women'}/${article.id % 100}.jpg`} 
            alt="Author" 
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="font-semibold">Author Name</p>
            <p>{t(`authorRoles.${article.category_id}`)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{formatDate(article.published_at)}</span>
          <span><i className="far fa-clock mr-1"></i> {article.read_time} {t('common.min')}</span>
        </div>
      </div>
    </article>
  );
}
