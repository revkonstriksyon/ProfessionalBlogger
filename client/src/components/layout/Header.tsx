import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import SearchBar from '@/components/common/SearchBar';

const Header = () => {
  const { t } = useTranslation();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter categories to exclude ones that will be in the "more" dropdown
  const mainCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 bg-[#D42E12] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-2 font-heading font-bold text-xl text-[#00209F]">AYITI JODIA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location === '/' ? 'text-[#00209F]' : 'text-gray-700'
              } hover:bg-[#00209F] hover:text-white transition`}>
              {t('nav.home')}
            </Link>
            
            {mainCategories.map((category) => (
              <Link key={category.id} 
                href={`/category/${category.slug}`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location === `/category/${category.slug}` ? 'text-[#00209F]' : 'text-gray-700'
                } hover:bg-[#00209F] hover:text-white transition`}>
                {category.nameHt}
              </Link>
            ))}
            
            {moreCategories.length > 0 && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-[#00209F] hover:text-white transition flex items-center">
                  {t('nav.more')}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-1">
                    {moreCategories.map((category) => (
                      <Link key={category.id} 
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {category.nameHt}
                      </Link>
                    ))}
                    <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('nav.contact')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Language Switcher & Search */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-1 rounded-full text-gray-700 hover:text-[#00209F] focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#00209F] hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === '/' ? 'text-[#00209F] bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
              }`}>
              {t('nav.home')}
            </Link>
            
            {categories.map((category) => (
              <Link key={category.id} 
                href={`/category/${category.slug}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === `/category/${category.slug}` ? 'text-[#00209F] bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                }`}>
                {category.nameHt}
              </Link>
            ))}
            
            <Link href="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === '/contact' ? 'text-[#00209F] bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
              }`}>
              {t('nav.contact')}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="px-3 py-2 rounded-md text-base font-medium text-gray-700">{t('language.label')}</div>
              <LanguageSwitcher isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <SearchBar onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
};

export default Header;
