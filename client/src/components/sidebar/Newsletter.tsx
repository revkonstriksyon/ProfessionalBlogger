import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { Language } from '@shared/schema';

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('ht');

  const subscribeMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; preferredLanguage: Language }) => {
      const response = await apiRequest('POST', '/api/subscribe', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('sidebar.subscribeSuccess'),
        description: t('sidebar.subscribeSuccessMessage'),
        variant: 'success',
      });
      // Reset form
      setName('');
      setEmail('');
    },
    onError: (error: any) => {
      toast({
        title: t('sidebar.subscribeError'),
        description: error.message || t('sidebar.subscribeErrorMessage'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({
        title: t('sidebar.formError'),
        description: t('sidebar.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    subscribeMutation.mutate({ name, email, preferredLanguage });
  };

  return (
    <div id="newsletter" className="bg-gradient-to-br from-primary to-primary-light text-white rounded-lg shadow-md p-6">
      <h3 className="font-heading font-bold text-lg mb-3">{t('sidebar.newsletter')}</h3>
      <p className="text-sm mb-4">{t('sidebar.newsletterInfo')}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder={t('sidebar.namePlaceholder')}
            className="w-full p-2 rounded text-gray-800 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder={t('sidebar.emailPlaceholder')}
            className="w-full p-2 rounded text-gray-800 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <select
            className="w-full p-2 rounded text-gray-800 text-sm"
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as Language)}
          >
            <option value="" disabled>{t('sidebar.languageSelect')}</option>
            <option value="ht">Kreyòl</option>
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-white text-primary font-semibold py-2 px-4 rounded hover:bg-gray-100 transition"
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? (
            <span className="inline-flex items-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> {t('sidebar.subscribing')}
            </span>
          ) : (
            <>
              {t('sidebar.subscribe')} <i className="fas fa-paper-plane ml-1"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
