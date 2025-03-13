import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Newsletter from '@/components/sidebar/Newsletter';
import SocialMedia from '@/components/sidebar/SocialMedia';
import type { MediaItem } from '@shared/schema';

const Media: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [mediaType, setMediaType] = useState<string | undefined>('photo');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Reset page when media type changes
  const changeMediaType = (type: string | undefined) => {
    setMediaType(type);
    setPage(1);
  };

  // Fetch media items
  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media', { type: mediaType, limit: page * limit, offset: 0 }],
  });

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">{t('media.title')}</h1>
        <div className="h-1 w-20 bg-accent mt-4"></div>
      </div>

      {/* Media Type Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm mr-4 border-b-2 ${
            mediaType === 'photo' ? 'border-accent text-accent' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => changeMediaType('photo')}
        >
          {t('media.photo')}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm mr-4 border-b-2 ${
            mediaType === 'video' ? 'border-accent text-accent' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => changeMediaType('video')}
        >
          {t('media.video')}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${
            mediaType === 'podcast' ? 'border-accent text-accent' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => changeMediaType('podcast')}
        >
          {t('media.podcast')}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${
            mediaType === undefined ? 'border-accent text-accent' : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => changeMediaType(undefined)}
        >
          {t('media.all')}
        </button>
      </div>

      <div className="md:flex md:space-x-6">
        <div className="md:w-3/4">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: limit }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <Skeleton className="w-full h-48" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : mediaItems.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md group">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={item.title[language]}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-play text-white"></i>
                          </span>
                        </div>
                      )}
                      {item.type === 'podcast' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-microphone text-white"></i>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900">{item.title[language]}</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(item.publishedAt).toLocaleDateString(
                          language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht'
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {mediaItems.length >= page * limit && (
                <div className="flex justify-center mt-8">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    className="px-6 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-white transition"
                  >
                    {t('media.loadMore')} <i className="fas fa-angle-down ml-1"></i>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t('media.noItems', { type: mediaType ? t(`media.${mediaType}`) : t('media.all') })}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('media.checkBackSoon')}
              </p>
            </div>
          )}
        </div>
        
        <div className="md:w-1/4 space-y-8 mt-8 md:mt-0">
          <Newsletter />
          <SocialMedia />
        </div>
      </div>
    </main>
  );
};

export default Media;
