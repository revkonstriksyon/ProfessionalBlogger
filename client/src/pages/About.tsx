import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#0D47A1] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">{t('about.pageTitle')}</h1>
          <p className="mt-2">{t('about.pageDescription')}</p>
        </div>
      </div>
      
      {/* About content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif font-bold text-[#0D47A1] mb-6">{t('about.mission.title')}</h2>
            <p className="mb-6">{t('about.mission.description')}</p>
            
            <h2 className="text-2xl font-serif font-bold text-[#0D47A1] mb-6">{t('about.vision.title')}</h2>
            <p className="mb-6">{t('about.vision.description')}</p>
            
            <h2 className="text-2xl font-serif font-bold text-[#0D47A1] mb-6">{t('about.team.title')}</h2>
            <p className="mb-10">{t('about.team.description')}</p>
            
            <div className="border-t pt-8">
              <h2 className="text-2xl font-serif font-bold text-[#0D47A1] mb-6">{t('about.contactUs.title')}</h2>
              <p>{t('about.contactUs.description')}</p>
              <div className="mt-4">
                <a 
                  href="/contact" 
                  className="inline-block bg-[#0D47A1] hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-md transition"
                >
                  {t('about.contactUs.button')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
