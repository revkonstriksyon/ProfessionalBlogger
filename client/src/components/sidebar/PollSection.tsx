import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Poll } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export default function PollSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const { data: activePoll, isLoading } = useQuery<Poll[]>({
    queryKey: ['/api/polls/active'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: results, isLoading: isLoadingResults } = useQuery<Record<number, number>>({
    queryKey: ['/api/polls', activePoll?.[0]?.id, 'results'],
    enabled: hasVoted && !!activePoll?.[0]?.id,
    staleTime: 60 * 1000, // 1 minute
  });

  const voteMutation = useMutation({
    mutationFn: (option_id: number) => {
      if (!activePoll?.[0]?.id) throw new Error("No active poll found");
      return apiRequest('POST', `/api/polls/${activePoll[0].id}/vote`, { 
        poll_id: activePoll[0].id,
        option_id,
        ip_address: "127.0.0.1" // IP will be set server-side
      });
    },
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/polls', activePoll?.[0]?.id, 'results'] });
      toast({
        title: t('poll.success.title'),
        description: t('poll.success.description'),
      });
    },
    onError: () => {
      toast({
        title: t('poll.error.title'),
        description: t('poll.error.description'),
        variant: 'destructive'
      });
    }
  });

  const handleVote = () => {
    if (selectedOption === null) {
      toast({
        title: t('poll.selectOption.title'),
        description: t('poll.selectOption.description'),
        variant: 'destructive'
      });
      return;
    }
    voteMutation.mutate(selectedOption);
  };

  // Calculate total votes for percentage display
  const getTotalVotes = (): number => {
    if (!results) return 0;
    return Object.values(results).reduce((acc, val) => acc + val, 0);
  };

  const totalVotes = getTotalVotes();

  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif font-bold text-lg text-[#0D47A1]">
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-full mb-3" />
          <div className="space-y-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-4 w-4 mr-3" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If no active polls
  if (!activePoll || activePoll.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-serif font-bold text-lg text-[#0D47A1]">{t('poll.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">{t('poll.noPollAvailable')}</p>
        </CardContent>
      </Card>
    );
  }

  const poll = activePoll[0];
  const options = poll.options as Array<{ id: number, text: { ht: string, fr: string, en: string } }>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif font-bold text-lg text-[#0D47A1]">{t('poll.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-3">
          {poll[`question_${t('languageCode')}` as keyof Poll] as string}
        </h4>
        
        {!hasVoted ? (
          <>
            <RadioGroup 
              value={selectedOption?.toString()} 
              onValueChange={(value) => setSelectedOption(parseInt(value))}
              className="space-y-2 mb-4"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <RadioGroupItem id={`option-${option.id}`} value={option.id.toString()} className="mr-3 h-4 w-4 text-[#0D47A1]" />
                  <Label htmlFor={`option-${option.id}`}>
                    {option.text[t('languageCode') as keyof typeof option.text]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Button 
              onClick={handleVote} 
              className="w-full bg-[#0D47A1] hover:bg-primary-700 text-white" 
              disabled={voteMutation.isPending}
            >
              {voteMutation.isPending ? t('common.submitting') : t('poll.voteButton')}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {isLoadingResults ? (
              Array(options.length).fill(0).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : (
              options.map((option) => {
                const votes = results?.[option.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span>{option.text[t('languageCode') as keyof typeof option.text]}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })
            )}
            <p className="text-sm text-gray-500 pt-2">
              {t('poll.totalVotes', { count: totalVotes })}
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-4">
          {t('poll.resultsDisclaimer')}
        </p>
      </CardContent>
    </Card>
  );
}
