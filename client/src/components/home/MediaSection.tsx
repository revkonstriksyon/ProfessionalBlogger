import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMediaTab } from '@/hooks/use-media-tab';
import { useLang } from '@/contexts/LangContext';
import { Skeleton } from '@/components/ui/skeleton';

const MediaSection = () => {
  const { t } = useTranslation();
  const { getLocalizedContent } = useLang();
  const [activeTab, setActiveTab] = useMediaTab('photo');

  const handleTabChange = (tab: 'photo' | 'video' | 'podcast') => {
    setActiveTab(tab);
  };

  // Placeholder data for photos
  const photos = [
    {
      id: 1,
      titleHt: 'Peyizaj nan nò Ayiti',
      titleFr: 'Paysage du nord d\'Haïti',
      titleEn: 'Landscape in northern Haiti',
      url: 'https://images.unsplash.com/photo-1580759596067-8395a7264c4a?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2023-04-20'
    },
    {
      id: 2,
      titleHt: 'Sitadèl Laferyè',
      titleFr: 'La Citadelle Laferrière',
      titleEn: 'Citadelle Laferrière',
      url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2023-04-15'
    },
    {
      id: 3,
      titleHt: 'Festival Jakmel',
      titleFr: 'Festival de Jacmel',
      titleEn: 'Jacmel Festival',
      url: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2023-04-10'
    },
    {
      id: 4,
      titleHt: 'Mache Fè a',
      titleFr: 'Le Marché en Fer',
      titleEn: 'The Iron Market',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300&h=300',
      date: '2023-04-05'
    }
  ];

  // Placeholder data for videos
  const videos = [
    {
      id: 1,
      titleHt: 'Ayiti: Yon vwayaj nan kè peyi a',
      titleFr: 'Haïti: Un voyage au cœur du pays',
      titleEn: 'Haiti: A journey to the heart of the country',
      thumbnail: 'https://images.unsplash.com/photo-1615812214207-34e3be6812df?auto=format&fit=crop&q=80&w=400&h=225',
      description: 'Yon dokimantè ki montre bote natirèl ak kilti rich Ayiti.',
      duration: '12:34',
      date: '2023-05-02',
      views: 1200
    },
    {
      id: 2,
      titleHt: 'Mizik Rasin: Son otantik Ayiti',
      titleFr: 'Mizik Rasin: Le son authentique d\'Haïti',
      titleEn: 'Roots Music: The authentic sound of Haiti',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400&h=225',
      description: 'Dekouvri istwa ak evolisyon mizik rasin ayisyen an.',
      duration: '8:45',
      date: '2023-04-25',
      views: 890
    },
    {
      id: 3,
      titleHt: 'Top 10 pi bèl plaj Ayiti',
      titleFr: 'Top 10 des plus belles plages d\'Haïti',
      titleEn: 'Top 10 most beautiful beaches in Haiti',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400&h=225',
      description: 'Yon gid pou pi bèl plaj ki nan peyi Ayiti, avèk konsèy pou vizitè.',
      duration: '15:20',
      date: '2023-04-20',
      views: 1500
    }
  ];

  // Placeholder data for podcasts
  const podcasts = [
    {
      id: 1,
      titleHt: 'Konvèsasyon Ayisyen',
      titleFr: 'Conversations Haïtiennes',
      titleEn: 'Haitian Conversations',
      episode: 'Episòd 12: Wòl jèn yo nan rekonstwiksyon Ayiti.',
      host: 'Marie Joseph',
      duration: '45 minit',
      progress: 35,
      currentTime: '15:30',
      totalTime: '45:00',
      color: '#00209F'
    },
    {
      id: 2,
      titleHt: 'Ayiti Ekonomi',
      titleFr: 'Économie Haïtienne',
      titleEn: 'Haiti Economy',
      episode: 'Episòd 8: Kijan pou nou devlope touris nan peyi a?',
      host: 'Jean-Marc Pierre',
      duration: '38 minit',
      progress: 0,
      currentTime: '0:00',
      totalTime: '38:00',
      color: '#FFCC00'
    }
  ];

  const renderPhotoTab = () => {
    if (!photos || photos.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <p>{t('media.noPhotos')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative group overflow-hidden rounded-lg">
            <img 
              src={photo.url} 
              alt={getLocalizedContent(photo) as string} 
              className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-heading font-semibold">{getLocalizedContent(photo)}</h3>
              <p className="text-white text-sm opacity-80">{new Date(photo.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVideoTab = () => {
    if (!videos || videos.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <p>{t('media.noVideos')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.id} className="rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <img 
                src={video.thumbnail} 
                alt={getLocalizedContent(video) as string} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-14 h-14 rounded-full bg-[#D42E12] bg-opacity-80 flex items-center justify-center text-white">
                  <i className="fas fa-play"></i>
                </button>
              </div>
              <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-lg mb-2">{getLocalizedContent(video)}</h3>
              <p className="text-gray-600 text-sm">{video.description}</p>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-500">{new Date(video.date).toLocaleDateString()}</span>
                <span className="text-gray-500">{video.views} {t('media.views')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPodcastTab = () => {
    if (!podcasts || podcasts.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <p>{t('media.noPodcasts')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {podcasts.map(podcast => (
          <div key={podcast.id} className="flex flex-col md:flex-row gap-4 p-5 rounded-lg shadow-md bg-white">
            <div className="md:w-1/4 flex-shrink-0">
              <div 
                className="relative w-full h-32 md:h-full rounded-lg overflow-hidden"
                style={{ backgroundColor: podcast.color }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-podcast text-4xl text-white"></i>
                </div>
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="font-heading font-bold text-lg mb-2">{getLocalizedContent(podcast)}</h3>
              <p className="text-gray-600 text-sm mb-3">{podcast.episode}</p>
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500">
                <span>{t('media.with')} {podcast.host}</span>
                <span>•</span>
                <span>{podcast.duration}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="w-10 h-10 rounded-full bg-[#D42E12] flex items-center justify-center text-white">
                  <i className="fas fa-play"></i>
                </button>
                <div className="flex-grow h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ width: `${podcast.progress}%`, backgroundColor: podcast.color }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{podcast.currentTime} / {podcast.totalTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'photo':
        return renderPhotoTab();
      case 'video':
        return renderVideoTab();
      case 'podcast':
        return renderPodcastTab();
      default:
        return renderPhotoTab();
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F]">{t('media.title')}</h2>
          <div className="flex space-x-3">
            <button 
              className={`px-4 py-1 rounded-full ${
                activeTab === 'photo' 
                  ? 'text-[#00209F] bg-[#00209F] bg-opacity-10 font-medium' 
                  : 'text-gray-700 bg-white shadow hover:bg-[#00209F] hover:text-white'
              } transition`}
              onClick={() => handleTabChange('photo')}
            >
              {t('media.photos')}
            </button>
            <button 
              className={`px-4 py-1 rounded-full ${
                activeTab === 'video' 
                  ? 'text-[#00209F] bg-[#00209F] bg-opacity-10 font-medium' 
                  : 'text-gray-700 bg-white shadow hover:bg-[#00209F] hover:text-white'
              } transition`}
              onClick={() => handleTabChange('video')}
            >
              {t('media.videos')}
            </button>
            <button 
              className={`px-4 py-1 rounded-full ${
                activeTab === 'podcast' 
                  ? 'text-[#00209F] bg-[#00209F] bg-opacity-10 font-medium' 
                  : 'text-gray-700 bg-white shadow hover:bg-[#00209F] hover:text-white'
              } transition`}
              onClick={() => handleTabChange('podcast')}
            >
              {t('media.podcasts')}
            </button>
          </div>
        </div>
        
        {renderContent()}
      </div>
    </section>
  );
};

export default MediaSection;
