import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Poll, PollOption, Subscriber } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useLang } from '@/contexts/LangContext';
import { apiRequest } from '@/lib/queryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface PollData {
  poll: Poll;
  options: PollOption[];
}

const PollSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { currentLang, getLocalizedContent } = useLang();
  const queryClient = useQueryClient();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { data: pollData, isLoading: isPollLoading } = useQuery<PollData>({
    queryKey: ['/api/polls/active'],
  });

  // Poll vote mutation
  const voteMutation = useMutation({
    mutationFn: async (optionId: number) => {
      return apiRequest('POST', '/api/polls/vote', { optionId });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/polls/active'] });
      setShowResults(true);
      toast({
        title: t('poll.voteSuccess'),
        description: t('poll.voteSuccessDesc'),
      });
    },
    onError: () => {
      toast({
        title: t('poll.voteError'),
        description: t('poll.voteErrorDesc'),
        variant: 'destructive',
      });
    },
  });

  const handleVote = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption !== null) {
      voteMutation.mutate(selectedOption);
    }
  };

  const resetVote = () => {
    setSelectedOption(null);
    setShowResults(false);
  };

  // Calculate total votes
  const totalVotes = pollData?.options.reduce((sum, option) => sum + (option.votes || 0), 0) || 0;

  // Form schema for newsletter subscription
  const subscribeFormSchema = z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    email: z.string().email(t('validation.emailInvalid')),
    preferredLanguage: z.enum(['ht', 'fr', 'en'])
  });

  const subscribeForm = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      preferredLanguage: currentLang as 'ht' | 'fr' | 'en'
    },
  });

  // Newsletter subscription mutation
  const subscribeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof subscribeFormSchema>) => {
      return apiRequest('POST', '/api/subscribers', data);
    },
    onSuccess: () => {
      toast({
        title: t('newsletter.success'),
        description: t('newsletter.successDesc'),
      });
      subscribeForm.reset({
        name: '',
        email: '',
        preferredLanguage: currentLang as 'ht' | 'fr' | 'en'
      });
    },
    onError: () => {
      toast({
        title: t('newsletter.error'),
        description: t('newsletter.errorDesc'),
        variant: 'destructive',
      });
    },
  });

  const onSubscribeSubmit = (data: z.infer<typeof subscribeFormSchema>) => {
    subscribeMutation.mutate(data);
  };

  const renderPollSkeleton = () => (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <Skeleton className="h-6 w-72 bg-gray-200 mb-4" />
      <div className="space-y-4 mb-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-4 w-4 rounded-full bg-gray-200" />
              <Skeleton className="ml-3 h-5 w-24 bg-gray-200" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-24 bg-gray-200" />
      </div>
    </div>
  );

  const renderSubscribeSkeleton = () => (
    <div className="bg-[#00209F] text-white rounded-lg shadow-md p-6">
      <Skeleton className="h-6 w-40 bg-white/20 mb-2" />
      <Skeleton className="h-4 w-64 bg-white/20 mb-6" />
      
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-16 bg-white/20 mb-1" />
          <Skeleton className="h-10 w-full bg-white/20" />
        </div>
        
        <div>
          <Skeleton className="h-4 w-16 bg-white/20 mb-1" />
          <Skeleton className="h-10 w-full bg-white/20" />
        </div>
        
        <div>
          <Skeleton className="h-4 w-32 bg-white/20 mb-1" />
          <Skeleton className="h-10 w-full bg-white/20" />
        </div>
        
        <Skeleton className="h-12 w-full bg-white/20" />
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex gap-8">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F] mb-6">{t('poll.title')}</h2>
            
            {isPollLoading ? (
              renderPollSkeleton()
            ) : !pollData || !pollData.poll ? (
              <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <p>{t('poll.noPollsAvailable')}</p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg shadow-md p-6">
                <h3 className="font-heading font-semibold text-xl mb-4">
                  {getLocalizedContent(pollData.poll)}
                </h3>
                
                {!showResults ? (
                  <form id="poll-form" className="space-y-4 mb-8" onSubmit={handleVote}>
                    <div className="space-y-3">
                      {pollData.options.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input 
                            type="radio" 
                            id={`option-${option.id}`} 
                            name="poll" 
                            value={option.id} 
                            className="h-4 w-4 text-[#00209F]"
                            checked={selectedOption === option.id}
                            onChange={() => setSelectedOption(option.id)}
                          />
                          <label htmlFor={`option-${option.id}`} className="ml-3 block text-gray-700">
                            {getLocalizedContent(option)}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="px-6 py-2 bg-[#00209F] text-white font-medium rounded-lg hover:bg-opacity-90 transition"
                      disabled={selectedOption === null || voteMutation.isPending}
                    >
                      {voteMutation.isPending ? t('common.loading') : t('poll.vote')}
                    </Button>
                  </form>
                ) : (
                  <div id="poll-results">
                    <h4 className="font-medium mb-4">
                      {t('poll.results')} ({totalVotes.toLocaleString()} {t('poll.votes')})
                    </h4>
                    
                    <div className="space-y-4">
                      {pollData.options.map((option) => {
                        const percentage = totalVotes > 0 
                          ? Math.round((option.votes || 0) / totalVotes * 100) 
                          : 0;
                          
                        return (
                          <div key={option.id}>
                            <div className="flex justify-between mb-1">
                              <span>{getLocalizedContent(option)}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-[#00209F] h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Button 
                      id="new-vote" 
                      className="mt-6 px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
                      onClick={resetVote}
                    >
                      {t('poll.voteAgain')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#00209F] mb-6">{t('newsletter.subscribe')}</h2>
            
            {isPollLoading ? (
              renderSubscribeSkeleton()
            ) : (
              <div className="bg-[#00209F] text-white rounded-lg shadow-md p-6">
                <h3 className="font-heading font-semibold text-xl mb-2">{t('newsletter.stayInformed')}</h3>
                <p className="mb-6 text-gray-200">{t('newsletter.receiveLatest')}</p>
                
                <Form {...subscribeForm}>
                  <form onSubmit={subscribeForm.handleSubmit(onSubscribeSubmit)} className="space-y-4">
                    <FormField
                      control={subscribeForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-200 mb-1">
                            {t('newsletter.name')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                              placeholder={t('newsletter.namePlaceholder')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={subscribeForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-200 mb-1">
                            {t('newsletter.email')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
                              placeholder={t('newsletter.emailPlaceholder')}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={subscribeForm.control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-200 mb-1">
                            {t('newsletter.preferredLanguage')}
                          </FormLabel>
                          <div className="flex space-x-4">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="lang-kr"
                                value="ht"
                                checked={field.value === 'ht'}
                                onChange={() => field.onChange('ht')}
                                className="h-4 w-4 text-[#FFCC00]"
                              />
                              <label htmlFor="lang-kr" className="ml-3 block text-sm text-gray-200">
                                Kreyòl
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="lang-fr"
                                value="fr"
                                checked={field.value === 'fr'}
                                onChange={() => field.onChange('fr')}
                                className="h-4 w-4 text-[#FFCC00]"
                              />
                              <label htmlFor="lang-fr" className="ml-3 block text-sm text-gray-200">
                                Français
                              </label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="lang-en"
                                value="en"
                                checked={field.value === 'en'}
                                onChange={() => field.onChange('en')}
                                className="h-4 w-4 text-[#FFCC00]"
                              />
                              <label htmlFor="lang-en" className="ml-3 block text-sm text-gray-200">
                                English
                              </label>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full px-6 py-3 bg-[#FFCC00] text-[#00209F] font-semibold rounded-lg hover:bg-opacity-90 transition"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? t('common.loading') : t('newsletter.subscribe')}
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PollSection;
