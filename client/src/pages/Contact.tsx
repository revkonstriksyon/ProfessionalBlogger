import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Newsletter from '@/components/sidebar/Newsletter';
import SocialMedia from '@/components/sidebar/SocialMedia';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Setup form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Contact mutation
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.thankYou'),
        description: t('contact.thankYouMessage'),
        variant: 'success',
      });
      // Reset form
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: t('contact.error'),
        description: error.message || t('contact.errorMessage'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">{t('contact.title')}</h1>
        <p className="text-lg text-gray-600">{t('contact.subtitle')}</p>
        <div className="h-1 w-20 bg-accent mt-4"></div>
      </div>

      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('contact.name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.namePlaceholder')} {...field} />
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
                        <FormLabel>{t('contact.email')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('contact.emailPlaceholder')} {...field} />
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
                      <FormLabel>{t('contact.subject')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('contact.subjectPlaceholder')} {...field} />
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
                      <FormLabel>{t('contact.message')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('contact.messagePlaceholder')} {...field} className="min-h-32" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="bg-accent hover:bg-accent/80 text-white w-full md:w-auto px-8"
                >
                  {contactMutation.isPending ? (
                    <span className="inline-flex items-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i> {t('contact.sending')}
                    </span>
                  ) : (
                    t('contact.send')
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-heading font-bold text-xl mb-6">{t('contact.contactInfo')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-accent text-xl"></i>
                </div>
                <h4 className="font-semibold mb-2">{t('contact.address')}</h4>
                <p className="text-gray-600 text-sm">Port-au-Prince, Haiti</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-envelope text-accent text-xl"></i>
                </div>
                <h4 className="font-semibold mb-2">{t('contact.email')}</h4>
                <p className="text-gray-600 text-sm">info@ayitiblog.com</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-phone-alt text-accent text-xl"></i>
                </div>
                <h4 className="font-semibold mb-2">{t('contact.phone')}</h4>
                <p className="text-gray-600 text-sm">+509 2xxx-xxxx</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/3 space-y-8 mt-8 md:mt-0">
          <Newsletter />
          <SocialMedia />
          
          {/* Map or Additional Info */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60652.62325654486!2d-72.36176659544678!3d18.54328056950272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb9e7963a8567a5%3A0x3ae8635e26adad12!2sPort-au-Prince%2C%20Haiti!5e0!3m2!1sen!2sus!4v1651950962368!5m2!1sen!2sus" 
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
