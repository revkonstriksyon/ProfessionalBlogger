import React, { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';
import type { MediaItem } from '@shared/schema';

const MediaSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [mediaType, setMediaType] = useState('photo');

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media', { type: mediaType, limit: 4 }],
  });

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-primary">{t('media.title')}</h2>
        <div className="flex space-x-2">
          <button 
            className={`text-sm font-medium px-3 py-1 ${mediaType === 'photo' 
              ? 'bg-accent text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'} rounded`}
            onClick={() => setMediaType('photo')}
          >
            {t('media.photo')}
          </button>
          <button 
            className={`text-sm font-medium px-3 py-1 ${mediaType === 'video' 
              ? 'bg-accent text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'} rounded`}
            onClick={() => setMediaType('video')}
          >
            {t('media.video')}
          </button>
          <button 
            className={`text-sm font-medium px-3 py-1 ${mediaType === 'podcast' 
              ? 'bg-accent text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'} rounded`}
            onClick={() => setMediaType('podcast')}
          >
            {t('media.podcast')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <Skeleton className="w-full h-40" />
              </div>
            ))
          : mediaItems.length > 0
          ? mediaItems.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-lg">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title[language]}
                  className="w-full h-40 object-cover transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <span className="text-white text-sm font-medium">{item.title[language]}</span>
                </div>
              </div>
            ))
          : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">
                  {t('media.noItems', { type: t(`media.${mediaType}`) })}
                </p>
              </div>
            )}
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/media">
          <a className="px-5 py-2 bg-white border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition">
            {t('media.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>
    </section>
  );
};

export default MediaSection;
