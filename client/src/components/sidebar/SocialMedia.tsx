import React from 'react';
import { useTranslation } from 'react-i18next';

const SocialMedia: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: 'facebook-f', url: 'https://facebook.com', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: 'twitter', url: 'https://twitter.com', color: 'bg-blue-400 hover:bg-blue-500' },
    { icon: 'youtube', url: 'https://youtube.com', color: 'bg-red-600 hover:bg-red-700' },
    { icon: 'instagram', url: 'https://instagram.com', color: 'bg-pink-600 hover:bg-pink-700' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="font-heading font-bold text-lg mb-4">{t('sidebar.followUs')}</h3>
      <div className="grid grid-cols-4 gap-2">
        {socialLinks.map((social, index) => (
          <a 
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center ${social.color} text-white p-3 rounded transition`}
            aria-label={`Follow us on ${social.icon}`}
          >
            <i className={`fab fa-${social.icon}`}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialMedia;
