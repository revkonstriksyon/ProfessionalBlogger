import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLang } from '@/contexts/LangContext';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLang, changeLang } = useLang();
  const { toast } = useToast();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Form schema for newsletter
  const formSchema = z.object({
    email: z.string().email(t('validation.emailRequired')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  // Newsletter subscription mutation
  const subscribeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest('POST', '/api/subscribers', {
        email: data.email,
        name: data.email.split('@')[0], // Use part of email as name
        preferredLanguage: currentLang,
      });
    },
    onSuccess: () => {
      toast({
        title: t('newsletter.success'),
        description: t('newsletter.successDesc'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('newsletter.error'),
        description: t('newsletter.errorDesc'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    subscribeMutation.mutate(data);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-6">
              <div className="h-10 w-10 bg-[#D42E12] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-2 font-heading font-bold text-xl text-white">AYITI JODIA</span>
            </Link>
            <p className="text-gray-400 mb-6">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FFCC00] transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">{t('footer.categories')}</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-white transition">
                    {category.nameHt}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">{t('nav.home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">{t('nav.about')}</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition">{t('nav.blog')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">{t('nav.contact')}</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">{t('footer.terms')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">{t('newsletter.title')}</h3>
            <p className="text-gray-400 mb-4">{t('newsletter.description')}</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t('newsletter.emailPlaceholder')}
                          className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full px-4 py-3 bg-[#FFCC00] text-[#00209F] font-semibold rounded-md hover:bg-opacity-90 transition"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? t('common.loading') : t('newsletter.subscribe')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} Ayiti Jodia. {t('footer.rights')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => changeLang('ht')} 
              className={`text-gray-400 hover:text-white transition text-sm ${currentLang === 'ht' ? 'text-white' : ''}`}
            >
              Kreyòl
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => changeLang('fr')} 
              className={`text-gray-400 hover:text-white transition text-sm ${currentLang === 'fr' ? 'text-white' : ''}`}
            >
              Français
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => changeLang('en')} 
              className={`text-gray-400 hover:text-white transition text-sm ${currentLang === 'en' ? 'text-white' : ''}`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
