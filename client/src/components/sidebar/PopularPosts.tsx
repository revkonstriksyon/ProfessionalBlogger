import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for popular posts
const popularPosts = [
  {
    id: 1,
    title: {
      ht: "Nouvo Atis Ayisyen yo k ap Fè Siksè nan Mache Entènasyonal la",
      fr: "Les nouveaux artistes haïtiens qui réussissent sur le marché international",
      en: "New Haitian Artists Making Success in the International Market"
    },
    slug: "new-haitian-artists"
  },
  {
    id: 2,
    title: {
      ht: "Gid Konplè sou Fèt ak Festival Tradisyonèl Ayiti yo",
      fr: "Guide complet sur les fêtes et festivals traditionnels d'Haïti",
      en: "Complete Guide to Traditional Haitian Celebrations and Festivals"
    },
    slug: "traditional-celebrations-guide"
  },
  {
    id: 3,
    title: {
      ht: "Kijan Diaspora a ap Kontribye nan Ekonomi Ayiti",
      fr: "Comment la diaspora contribue à l'économie haïtienne",
      en: "How the Diaspora is Contributing to Haiti's Economy"
    },
    slug: "diaspora-contribution"
  },
  {
    id: 4,
    title: {
      ht: "Resèt Tradisyonèl Ayisyen: Aprann Fè Soup Joumou",
      fr: "Recettes traditionnelles haïtiennes : Apprenez à faire la soupe joumou",
      en: "Traditional Haitian Recipes: Learn to Make Soup Joumou"
    },
    slug: "traditional-soup-joumou"
  },
  {
    id: 5,
    title: {
      ht: "10 Kote ou Dwe Vizite Lè w Vwayaje ann Ayiti",
      fr: "10 endroits à visiter lors de votre voyage en Haïti",
      en: "10 Places You Must Visit When Traveling to Haiti"
    },
    slug: "must-visit-places"
  }
];

const PopularPosts: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="font-heading font-bold text-lg mb-4 pb-2 border-b border-gray-200">
        {t('sidebar.popular')}
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <div key={post.id} className="flex items-start">
            <span className="flex-shrink-0 font-bold text-2xl text-gray-300 mr-3">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <Link href={`/article/${post.slug}`}>
              <a className="hover:text-accent">{post.title[language]}</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;
