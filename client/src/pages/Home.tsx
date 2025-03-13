import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import LatestNews from '@/components/home/LatestNews';
import MediaSection from '@/components/home/MediaSection';
import BlogSection from '@/components/home/BlogSection';
import PopularPosts from '@/components/sidebar/PopularPosts';
import Newsletter from '@/components/sidebar/Newsletter';
import PollWidget from '@/components/sidebar/PollWidget';
import TagsWidget from '@/components/sidebar/TagsWidget';
import SocialMedia from '@/components/sidebar/SocialMedia';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8">
        <FeaturedArticles />
        
        <div className="md:flex md:space-x-6">
          <div className="md:w-2/3">
            <LatestNews />
            <MediaSection />
            <BlogSection />
          </div>
          
          <div className="md:w-1/3 space-y-8">
            <PopularPosts />
            <Newsletter />
            <PollWidget />
            <TagsWidget />
            <SocialMedia />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
