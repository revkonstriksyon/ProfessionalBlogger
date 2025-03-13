import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import SearchBar from '@/components/shared/SearchBar';
import { useLanguage } from '@/hooks/useLanguage';
import { useMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [location] = useLocation();
  const isMobile = useMobile();

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Categories for navigation
  const categories = [
    { name: t('header.home'), path: '/', active: location === '/' },
    { name: t('header.news'), path: '/category/actualite', active: location === '/category/actualite' },
    { name: t('header.politics'), path: '/category/politics', active: location === '/category/politics' },
    { name: t('header.culture'), path: '/category/culture', active: location === '/category/culture' },
    { name: t('header.sports'), path: '/category/sports', active: location === '/category/sports' },
    { name: t('header.education'), path: '/category/education', active: location === '/category/education' },
    { name: t('header.health'), path: '/category/health', active: location === '/category/health' },
    { name: t('header.technology'), path: '/category/technology', active: location === '/category/technology' },
    { name: t('header.media'), path: '/media', active: location === '/media' },
  ];

  // Track scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside or changing route
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showSearchBar) setShowSearchBar(false);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (showMobileMenu) setShowMobileMenu(false);
  };

  return (
    <header className={`bg-white shadow-md sticky top-0 z-50 ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#00209F] to-[#D21034] flex items-center justify-center text-white font-bold">
                  AB
                </div>
                <span className="font-heading font-bold text-2xl text-primary">
                  Ayiti<span className="text-red-600">Blog</span>
                </span>
              </a>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />

            {/* Search Button */}
            <button
              className="p-2 text-gray-500 hover:text-primary"
              onClick={toggleSearchBar}
              aria-label={t('header.search')}
            >
              <i className="fas fa-search"></i>
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="p-2 text-gray-500 hover:text-primary">
                <i className="fas fa-user-circle text-xl"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 hidden group-hover:block">
                <Link href="/login">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('header.login')}
                  </a>
                </Link>
                <Link href="/register">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    {t('header.register')}
                  </a>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-primary"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block pb-3">
          <ul className="flex space-x-6">
            {categories.map((category, index) => (
              <li key={index}>
                <Link href={category.path}>
                  <a
                    className={`${
                      category.active
                        ? 'text-primary font-semibold border-b-2 border-accent'
                        : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-accent'
                    } pb-2`}
                  >
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-white absolute left-0 right-0 p-4 shadow-lg">
            {/* Language Switcher - Mobile */}
            <div className="flex justify-center mb-4">
              <LanguageSwitcher />
            </div>

            {/* Mobile Nav Links */}
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link href={category.path}>
                    <a
                      className={`block ${
                        category.active ? 'text-primary font-semibold' : 'text-gray-700 hover:text-primary'
                      }`}
                    >
                      {category.name}
                    </a>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login">
                  <a className="block text-gray-700 hover:text-primary">
                    {t('header.login')}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <a className="block text-gray-700 hover:text-primary">
                    {t('header.register')}
                  </a>
                </Link>
              </li>
            </ul>

            {/* Mobile Search */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-100 p-2 pl-10 rounded-lg"
                  placeholder={t('header.search')}
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowSearchBar(true);
                  }}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <SearchBar isOpen={showSearchBar} onClose={() => setShowSearchBar(false)} />
      </div>
    </header>
  );
};

export default Header;
