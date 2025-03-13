import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);
      await apiRequest('POST', '/api/subscribe', {
        email,
        name: email.split('@')[0], // Simple default name from email
        frequency: 'weekly',
        language: localStorage.getItem('i18nextLng') || 'ht'
      });
      
      toast({
        title: t('subscription.success.title'),
        description: t('subscription.success.description'),
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: t('subscription.error.title'),
        description: t('subscription.error.description'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0D47A1] text-xl font-bold">AN</div>
              <div className="ml-2 text-white font-serif font-bold text-2xl">{t('siteName')}</div>
            </div>
            <p className="text-gray-400 mb-4">{t('footer.description')}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link href={`/category/${category.slug}`}>
                    <a className="text-gray-400 hover:text-white transition">
                      {t(`categories.${category.slug}`)}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.home')}</a>
                </Link>
              </li>
              <li>
                <Link href="/media">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.media')}</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.contact')}</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.about')}</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.privacy')}</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.terms')}</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">{t('footer.subscription')}</h4>
            <p className="text-gray-400 mb-4">{t('footer.subscriptionDescription')}</p>
            <form className="flex" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-l w-full focus:outline-none text-gray-800"
                required
              />
              <Button 
                type="submit" 
                className="bg-[#FFC107] hover:bg-[#FFECB3] transition text-[#0D47A1] px-4 py-2 rounded-r font-semibold"
                disabled={isSubmitting}
              >
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">© {new Date().getFullYear()} {t('siteName')}. {t('footer.copyright')}</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.privacy')}</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.terms')}</a>
                </Link>
              </li>
              <li>
                <Link href="/sitemap">
                  <a className="text-gray-400 hover:text-white transition">{t('nav.sitemap')}</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
