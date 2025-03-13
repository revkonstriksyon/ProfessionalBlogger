import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Media } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { MEDIA_TYPES } from '@/lib/constants';

export default function MediaSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("photo");
  
  const { data: mediaItems, isLoading } = useQuery<Media[]>({
    queryKey: ['/api/media', { type: activeTab, limit: 4 }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create skeletons for loading state
  const skeletonItems = Array(4).fill(0).map((_, i) => (
    <div key={`skeleton-${i}`} className="relative group cursor-pointer overflow-hidden rounded-md">
      <Skeleton className="w-full h-24 md:h-32" />
    </div>
  ));

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#0D47A1]">{t('media.title')}</h2>
        <Link href="/media">
          <a className="text-primary-600 hover:text-primary-800 text-sm font-semibold flex items-center">
            {t('common.viewAll')} <i className="fas fa-chevron-right ml-1 text-xs"></i>
          </a>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Tabs defaultValue="photo" onValueChange={handleTabChange}>
          <div className="flex border-b">
            <TabsList className="w-full flex justify-between border-b-0">
              {MEDIA_TYPES.map(({ value, labelKey }) => (
                <TabsTrigger 
                  key={value}
                  value={value}
                  className={`flex-1 py-3 px-4 font-semibold text-gray-500 data-[state=active]:text-[#0D47A1] data-[state=active]:border-b-2 data-[state=active]:border-[#0D47A1]`}
                >
                  {t(labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {MEDIA_TYPES.map(({ value }) => (
            <TabsContent key={value} value={value} className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {isLoading 
                  ? skeletonItems
                  : mediaItems && mediaItems.length > 0
                    ? mediaItems.map((item) => (
                        <div key={item.id} className="relative group cursor-pointer overflow-hidden rounded-md">
                          <img 
                            src={item.thumbnail_url} 
                            alt={item[`title_${t('languageCode')}` as keyof Media] as string} 
                            className="w-full h-24 md:h-32 object-cover transform transition duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-[#0D47A1] bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                            <Search className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition duration-300" />
                          </div>
                        </div>
                      ))
                    : <p className="col-span-4 text-center py-4">{t('media.noItemsFound')}</p>
                }
              </div>
              
              <div className="mt-4 text-center">
                <Link href={`/media?type=${activeTab}`}>
                  <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 text-[#0D47A1] font-medium">
                    {t(`media.viewMore.${activeTab}`)}
                  </Button>
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
