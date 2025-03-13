import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SOCIAL_LINKS } from '@/lib/constants';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.success.title'),
        description: t('contact.success.description'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('contact.error.title'),
        description: t('contact.error.description'),
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <section className="bg-[#0D47A1] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-serif font-bold mb-4">{t('contact.title')}</h2>
            <p className="mb-6">{t('contact.description')}</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm mb-1">{t('contact.form.name')}</FormLabel>
                        <FormControl>
                          <Input 
                            className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm mb-1">{t('contact.form.email')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm mb-1">{t('contact.form.subject')}</FormLabel>
                      <FormControl>
                        <Input 
                          className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm mb-1">{t('contact.form.message')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4}
                          className="w-full px-4 py-2 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-[#FFC107] hover:bg-[#FFECB3] transition text-[#0D47A1] font-semibold px-6 py-3 rounded"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? t('common.submitting') : t('contact.form.submit')}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-2xl font-serif font-bold mb-4">{t('contact.info.title')}</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-10 p-2 rounded mr-3">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.info.address.title')}</h4>
                  <p>{t('contact.info.address.value')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white bg-opacity-10 p-2 rounded mr-3">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.info.email.title')}</h4>
                  <p>{t('contact.info.email.value')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white bg-opacity-10 p-2 rounded mr-3">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-semibold">{t('contact.info.phone.title')}</h4>
                  <p>{t('contact.info.phone.value')}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-serif font-bold mb-3">{t('contact.social.title')}</h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((link) => (
                <a 
                  key={link.platform}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white bg-opacity-10 hover:bg-opacity-20 transition w-10 h-10 rounded-full flex items-center justify-center"
                  aria-label={link.platform}
                >
                  <i className={`fab fa-${link.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
