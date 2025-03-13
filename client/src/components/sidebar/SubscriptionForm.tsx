import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { SUBSCRIPTION_FREQUENCIES } from '@/lib/constants';

const subscriptionFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  frequency: z.string().min(1, { message: "Please select a frequency" }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export default function SubscriptionForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      email: "",
      frequency: "",
    },
  });

  const subscriptionMutation = useMutation({
    mutationFn: (data: SubscriptionFormValues) => {
      return apiRequest('POST', '/api/subscribe', {
        ...data,
        language: localStorage.getItem('i18nextLng') || 'ht'
      });
    },
    onSuccess: () => {
      toast({
        title: t('subscription.success.title'),
        description: t('subscription.success.description'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('subscription.error.title'),
        description: t('subscription.error.description'),
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: SubscriptionFormValues) => {
    subscriptionMutation.mutate(data);
  };

  return (
    <Card className="bg-[#FFECB3]">
      <CardHeader>
        <CardTitle className="font-serif font-bold text-lg text-[#0D47A1]">
          {t('subscription.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{t('subscription.description')}</p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder={t('subscription.namePlaceholder')} 
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
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
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder={t('subscription.emailPlaceholder')} 
                      className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0D47A1]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#0D47A1]">
                        <SelectValue placeholder={t('subscription.frequencyPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBSCRIPTION_FREQUENCIES.map(({ value, labelKey }) => (
                        <SelectItem key={value} value={value}>
                          {t(labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#0D47A1] hover:bg-primary-700 text-white font-medium py-2 rounded-md transition"
              disabled={subscriptionMutation.isPending}
            >
              {subscriptionMutation.isPending ? t('common.submitting') : t('subscription.buttonText')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
