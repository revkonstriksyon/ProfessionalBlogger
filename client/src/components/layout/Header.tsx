import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'wouter';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSwitcher from './LanguageSwitcher';
import { CATEGORIES, SOCIAL_LINKS } from '@/lib/constants';

export default function Header() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState('');
  const [location, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <a className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#0D47A1] flex items-center justify-center text-white text-xl font-bold">AN</div>
                <div className="ml-2 text-[#0D47A1] font-serif font-bold text-2xl">{t('siteName')}</div>
              </a>
            </Link>
          </div>
          
          {/* Language Switcher */}
          <LanguageSwitcher className="mb-4 md:mb-0" />
          
          {/* Search and Social Media */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
            
            <div className="hidden md:flex space-x-2">
              {SOCIAL_LINKS.map((link) => (
                <a 
                  key={link.platform}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#0D47A1] hover:text-primary-700"
                  aria-label={link.platform}
                >
                  <i className={`fab fa-${link.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block mt-4">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-1 md:space-x-4 text-sm font-semibold">
            <li>
              <Link href="/">
                <a className={`px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === '/' ? 'bg-gray-100' : ''}`}>
                  {t('nav.home')}
                </a>
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link href={`/category/${category.slug}`}>
                  <a className={`px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === `/category/${category.slug}` ? 'bg-gray-100' : ''}`}>
                    {t(`categories.${category.slug}`)}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {isMobile && (
          <div className="flex justify-end mt-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <Link href="/">
                      <a className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#0D47A1] flex items-center justify-center text-white text-lg font-bold">AN</div>
                        <div className="ml-2 text-[#0D47A1] font-serif font-bold text-xl">{t('siteName')}</div>
                      </a>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                  </div>

                  <nav className="flex-1">
                    <ul className="space-y-2">
                      <li>
                        <Link href="/">
                          <a className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === '/' ? 'bg-gray-100' : ''}`}>
                            {t('nav.home')}
                          </a>
                        </Link>
                      </li>
                      {CATEGORIES.map((category) => (
                        <li key={category.slug}>
                          <Link href={`/category/${category.slug}`}>
                            <a className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === `/category/${category.slug}` ? 'bg-gray-100' : ''}`}>
                              {t(`categories.${category.slug}`)}
                            </a>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href="/contact">
                          <a className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === '/contact' ? 'bg-gray-100' : ''}`}>
                            {t('nav.contact')}
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/about">
                          <a className={`block px-3 py-2 rounded-md hover:bg-gray-100 transition ${location === '/about' ? 'bg-gray-100' : ''}`}>
                            {t('nav.about')}
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </nav>

                  <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-center space-x-4">
                      {SOCIAL_LINKS.map((link) => (
                        <a 
                          key={link.platform}
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#0D47A1] hover:text-primary-700"
                          aria-label={link.platform}
                        >
                          <i className={`fab fa-${link.icon} text-lg`}></i>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
}
