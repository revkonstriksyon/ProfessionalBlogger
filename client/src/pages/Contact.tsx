import { useTranslation } from "react-i18next";
import ContactSection from "@/components/contact/ContactSection";

export default function Contact() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Page header */}
      <div className="bg-[#0D47A1] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">{t('contact.pageTitle')}</h1>
          <p className="mt-2">{t('contact.pageDescription')}</p>
        </div>
      </div>
      
      {/* Contact form and info */}
      <ContactSection />
    </div>
  );
}
