import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Form schema for contact form
  const formSchema = z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    email: z.string().email(t('validation.emailInvalid')),
    subject: z.string().min(1, t('validation.subjectRequired')),
    message: z.string().min(10, t('validation.messageRequired')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Contact submission mutation
  const contactMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.success'),
        description: t('contact.successDesc'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('contact.error'),
        description: t('contact.errorDesc'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    contactMutation.mutate(data);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F] mb-8 text-center">{t('contact.title')}</h2>
        
        <div className="lg:flex rounded-lg overflow-hidden shadow-lg">
          <div className="lg:w-1/3 bg-[#00209F] p-8 text-white">
            <h3 className="font-heading font-bold text-2xl mb-6">{t('contact.info')}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium">{t('contact.address')}</h4>
                  <p className="mt-1 text-gray-200">123 Ri Kapwa, Pòtoprens, Ayiti</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium">{t('contact.phone')}</h4>
                  <p className="mt-1 text-gray-200">+509 2222-3333</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium">{t('contact.email')}</h4>
                  <p className="mt-1 text-gray-200">info@ayitijodia.com</p>
                </div>
              </div>
              
              <div className="pt-6">
                <h4 className="text-lg font-medium mb-4">{t('contact.followUs')}</h4>
                <div className="flex space-x-4">
                  <a href="#" className="h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-40 transition">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-40 transition">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-40 transition">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-[#FFCC00] bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-40 transition">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 bg-white p-8">
            <h3 className="font-heading font-bold text-2xl mb-6 text-[#00209F]">{t('contact.sendMessage')}</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.nameLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00209F]"
                            placeholder={t('contact.namePlaceholder')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          {t('contact.emailLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00209F]"
                            placeholder={t('contact.emailPlaceholder')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.subjectLabel')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00209F]"
                          placeholder={t('contact.subjectPlaceholder')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        {t('contact.messageLabel')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00209F]"
                          placeholder={t('contact.messagePlaceholder')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="px-8 py-3 bg-[#00209F] text-white font-semibold rounded-lg hover:bg-[#D42E12] transition"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? t('common.sending') : t('contact.send')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
