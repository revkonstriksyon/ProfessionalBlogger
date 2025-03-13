import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { name: t('header.news'), path: '/category/actualite' },
    { name: t('header.politics'), path: '/category/politics' },
    { name: t('header.culture'), path: '/category/culture' },
    { name: t('header.sports'), path: '/category/sports' },
    { name: t('header.education'), path: '/category/education' },
    { name: t('header.health'), path: '/category/health' },
    { name: t('header.technology'), path: '/category/technology' },
  ];

  const quickLinks = [
    { name: t('footer.aboutUs'), path: '/about' },
    { name: t('footer.contactUs'), path: '/contact' },
    { name: t('footer.termsOfUse'), path: '/terms' },
    { name: t('footer.privacyPolicy'), path: '/privacy' },
    { name: t('footer.advertisements'), path: '/ads' },
    { name: t('footer.workWithUs'), path: '/careers' },
  ];

  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00209F] to-[#D21034] flex items-center justify-center text-white font-bold text-xs">
                AB
              </div>
              <span className="font-heading font-bold text-xl">
                Ayiti<span className="text-[#D21034]">Blog</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Yon platfòm ki bay enfòmasyon sou Ayiti, istwa li, kilti li, ak aktyalite yo.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-gray-300">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link href={category.path}>
                    <a className="hover:text-white transition">{category.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-gray-300">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.path}>
                    <a className="hover:text-white transition">{link.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-[#D21034]"></i>
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-[#D21034]"></i>
                <span>info@ayitiblog.com</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3 text-[#D21034]"></i>
                <span>+509 2xxx-xxxx</span>
              </li>
            </ul>

            <div className="mt-6">
              <LanguageSwitcher variant="footer" />
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AyitiBlog. {t('footer.allRightsReserved')}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/terms">
                <a className="hover:text-white transition">{t('footer.terms')}</a>
              </Link>
              <Link href="/privacy">
                <a className="hover:text-white transition">{t('footer.privacy')}</a>
              </Link>
              <Link href="/cookies">
                <a className="hover:text-white transition">{t('footer.cookies')}</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
