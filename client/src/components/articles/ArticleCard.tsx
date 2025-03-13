import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Article } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { enUS, fr, frCA } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

const getLocale = (langCode: string) => {
  switch (langCode) {
    case 'fr': return fr;
    case 'en': return enUS;
    default: return frCA; // Closest to Haitian Creole
  }
};

export default function ArticleCard({ article }: ArticleCardProps) {
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
    <article className="article-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300 hover:translate-y-[-5px] hover:shadow-lg">
      <div className="relative">
        <img 
          src={article.image_url} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 left-3 bg-[#0D47A1] text-white text-xs px-2 py-1 rounded-sm">
          {t(`categories.${article.category_id}`)}
        </span>
      </div>
      <div className="p-4">
        <Link href={`/article/${article.slug}`}>
          <a className="font-serif font-semibold text-lg mb-2 hover:text-primary-600 block">
            {title}
          </a>
        </Link>
        <p className="text-gray-600 text-sm mb-3">{excerpt}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{formatDate(article.published_at)}</span>
          <span><i className="far fa-clock mr-1"></i> {article.read_time} {t('common.min')}</span>
        </div>
      </div>
    </article>
  );
}
