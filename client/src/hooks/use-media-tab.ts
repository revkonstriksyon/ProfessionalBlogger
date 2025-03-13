import { useState, useEffect } from 'react';

type MediaTabType = 'photo' | 'video' | 'podcast';

export function useMediaTab(initialTab: MediaTabType = 'photo'): [MediaTabType, (tab: MediaTabType) => void] {
  // Check localStorage for saved preference
  const getSavedTab = (): MediaTabType => {
    const savedTab = localStorage.getItem('mediaTab') as MediaTabType;
    return savedTab ? savedTab : initialTab;
  };

  const [activeTab, setActiveTab] = useState<MediaTabType>(getSavedTab());

  // Update tab and save preference to localStorage
  const changeTab = (tab: MediaTabType) => {
    setActiveTab(tab);
    localStorage.setItem('mediaTab', tab);
  };

  // Sync with localStorage if changed elsewhere (multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mediaTab' && e.newValue) {
        setActiveTab(e.newValue as MediaTabType);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return [activeTab, changeTab];
}
