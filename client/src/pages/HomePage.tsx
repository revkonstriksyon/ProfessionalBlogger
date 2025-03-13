import { useTranslation } from 'react-i18next';
import HeroSection from '@/components/home/HeroSection';
import LatestNews from '@/components/home/LatestNews';
import CategorySection from '@/components/home/CategorySection';
import BlogAndAnalysis from '@/components/home/BlogAndAnalysis';
import MediaSection from '@/components/home/MediaSection';
import PollSection from '@/components/home/PollSection';
import ContactSection from '@/components/home/ContactSection';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Latest News Section */}
      <LatestNews />
      
      {/* Categories Section */}
      <CategorySection />
      
      {/* Blog and Analysis Section */}
      <BlogAndAnalysis />
      
      {/* Media Section */}
      <MediaSection />
      
      {/* Poll and Subscription Section */}
      <PollSection />
      
      {/* Contact Section */}
      <ContactSection />
    </>
  );
};

export default HomePage;
