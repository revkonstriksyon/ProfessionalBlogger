import { useTranslation } from "react-i18next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedNews from "@/components/home/FeaturedNews";
import BlogAnalysis from "@/components/home/BlogAnalysis";
import MediaSection from "@/components/home/MediaSection";
import ContactSection from "@/components/contact/ContactSection";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <FeaturedNews />
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <BlogAnalysis />
            <MediaSection />
          </div>
          
          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
      
      <ContactSection />
    </>
  );
}
