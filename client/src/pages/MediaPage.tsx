import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Media } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_TYPES } from "@/lib/constants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MediaPage() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Get media type from URL if present
    const params = new URLSearchParams(location.split('?')[1]);
    const typeParam = params.get('type');
    return MEDIA_TYPES.some(type => type.value === typeParam) ? typeParam : "photo";
  });
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  
  const { data: mediaItems, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media', { type: activeTab, limit: 12 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Create skeletons for loading state
  const skeletonItems = Array(8).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="relative group overflow-hidden rounded-md">
      <Skeleton className="w-full h-48 md:h-64" />
    </div>
  ));

  return (
    <div>
      {/* Page header */}
      <div className="bg-[#0D47A1] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">{t('media.pageTitle')}</h1>
          <p className="mt-2">{t('media.pageDescription')}</p>
        </div>
      </div>
      
      {/* Media content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-md rounded-lg p-1">
              {MEDIA_TYPES.map(({ value, labelKey }) => (
                <TabsTrigger 
                  key={value}
                  value={value}
                  className="px-6 py-2 font-medium data-[state=active]:bg-[#0D47A1] data-[state=active]:text-white"
                >
                  {t(labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {MEDIA_TYPES.map(({ value }) => (
            <TabsContent key={value} value={value}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading 
                  ? skeletonItems
                  : mediaItems && mediaItems.length > 0
                    ? mediaItems.map((item) => (
                        <Dialog key={item.id}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-0 w-full h-auto" onClick={() => setSelectedMedia(item)}>
                              <div className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md">
                                <img 
                                  src={item.thumbnail_url} 
                                  alt={item[`title_${t('languageCode')}` as keyof Media] as string} 
                                  className="w-full h-48 md:h-64 object-cover transform transition duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-[#0D47A1] bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                                  <i className="fas fa-search text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition duration-300"></i>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                  <h3 className="text-white font-medium">
                                    {item[`title_${t('languageCode')}` as keyof Media] as string}
                                  </h3>
                                </div>
                              </div>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            {value === "photo" && (
                              <div className="p-2">
                                <img 
                                  src={item.url} 
                                  alt={item[`title_${t('languageCode')}` as keyof Media] as string} 
                                  className="w-full rounded-lg"
                                />
                                <div className="mt-4">
                                  <h3 className="text-xl font-serif font-bold">
                                    {item[`title_${t('languageCode')}` as keyof Media] as string}
                                  </h3>
                                  {item[`description_${t('languageCode')}` as keyof Media] && (
                                    <p className="mt-2 text-gray-600">
                                      {item[`description_${t('languageCode')}` as keyof Media] as string}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {value === "video" && (
                              <div className="p-2">
                                <div className="aspect-video">
                                  <iframe 
                                    src={item.url} 
                                    title={item[`title_${t('languageCode')}` as keyof Media] as string}
                                    className="w-full h-full rounded-lg"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="mt-4">
                                  <h3 className="text-xl font-serif font-bold">
                                    {item[`title_${t('languageCode')}` as keyof Media] as string}
                                  </h3>
                                  {item[`description_${t('languageCode')}` as keyof Media] && (
                                    <p className="mt-2 text-gray-600">
                                      {item[`description_${t('languageCode')}` as keyof Media] as string}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {value === "podcast" && (
                              <div className="p-2">
                                <audio controls className="w-full">
                                  <source src={item.url} type="audio/mpeg" />
                                  {t('media.audioNotSupported')}
                                </audio>
                                <div className="mt-4">
                                  <h3 className="text-xl font-serif font-bold">
                                    {item[`title_${t('languageCode')}` as keyof Media] as string}
                                  </h3>
                                  {item[`description_${t('languageCode')}` as keyof Media] && (
                                    <p className="mt-2 text-gray-600">
                                      {item[`description_${t('languageCode')}` as keyof Media] as string}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      ))
                    : <p className="col-span-full text-center py-8">{t('media.noItemsFound')}</p>
                }
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
