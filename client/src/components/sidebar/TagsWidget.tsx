import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

// Popular tags - these would typically come from an API
const popularTags = [
  { name: 'Ayiti', path: '/search?tag=ayiti' },
  { name: 'Kilti', path: '/search?tag=kilti' },
  { name: 'Pòtoprens', path: '/search?tag=potoprens' },
  { name: 'Mizik', path: '/search?tag=mizik' },
  { name: 'Atizana', path: '/search?tag=atizana' },
  { name: 'Istwa', path: '/search?tag=istwa' },
  { name: 'Vwayaj', path: '/search?tag=vwayaj' },
  { name: 'Diaspora', path: '/search?tag=diaspora' },
  { name: 'Kreyòl', path: '/search?tag=kreyol' },
  { name: 'Edikasyon', path: '/search?tag=edikasyon' },
  { name: 'Agrikilti', path: '/search?tag=agrikilti' }
];

const TagsWidget: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="font-heading font-bold text-lg mb-4">{t('sidebar.tags')}</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag, index) => (
          <Link key={index} href={tag.path}>
            <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition">
              #{tag.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagsWidget;
