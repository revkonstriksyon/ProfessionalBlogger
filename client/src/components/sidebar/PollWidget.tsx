import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/useLanguage';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Poll, PollOption } from '@shared/schema';

interface ActivePollResponse {
  poll: Poll;
  options: PollOption[];
}

const PollWidget: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch active poll
  const { data: pollData, isLoading, isError } = useQuery<ActivePollResponse>({
    queryKey: ['/api/polls/active'],
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (optionId: number) => {
      const response = await apiRequest('POST', '/api/polls/vote', { optionId });
      return response.json();
    },
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/polls/active'] });
    },
  });

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      voteMutation.mutate(selectedOption);
    }
  };

  const resetVote = () => {
    setHasVoted(false);
    setSelectedOption(null);
  };

  // If there is no active poll
  if (isError || (!isLoading && (!pollData || !pollData.poll))) {
    return null;
  }

  // Calculate total votes and percentages
  const calculatePercentage = (votes: number) => {
    if (!pollData) return 0;
    const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5" data-poll-id="123">
      <h3 className="font-heading font-bold text-lg mb-4">{t('sidebar.poll')}</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="font-medium mb-3">{pollData?.poll.question[language]}</p>
            
            {!hasVoted && (
              <div className="space-y-2">
                {pollData?.options.map((option) => (
                  <div className="relative" key={option.id}>
                    <input 
                      type="radio" 
                      id={`option${option.id}`} 
                      name="poll" 
                      className="hidden" 
                      value={option.id}
                      checked={selectedOption === option.id}
                      onChange={() => handleOptionSelect(option.id)}
                    />
                    <label 
                      htmlFor={`option${option.id}`} 
                      className={`flex items-center cursor-pointer py-2 px-3 border rounded hover:bg-gray-50 ${
                        selectedOption === option.id ? 'border-accent' : ''
                      }`}
                    >
                      <span className="w-4 h-4 border border-gray-400 rounded-full mr-2 flex-shrink-0 relative">
                        {selectedOption === option.id && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-2 h-2 bg-accent rounded-full"></span>
                          </span>
                        )}
                      </span>
                      <span>{option.text[language]}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {hasVoted && (
            <div className="mb-4 space-y-3">
              {pollData?.options.map((option) => (
                <div key={option.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{option.text[language]}</span>
                    <span>{calculatePercentage(option.votes)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-accent h-2.5 rounded-full" 
                      style={{ width: `${calculatePercentage(option.votes)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-600 mt-2">
                {pollData?.options.reduce((sum, option) => sum + option.votes, 0)} {t('sidebar.peopleVoted')}
              </p>
            </div>
          )}
          
          {!hasVoted ? (
            <button 
              onClick={handleVote}
              disabled={selectedOption === null || voteMutation.isPending}
              className={`w-full mt-2 ${
                selectedOption === null 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-light'
              } text-white font-semibold py-2 px-4 rounded transition`}
            >
              {voteMutation.isPending ? (
                <span className="inline-flex items-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> {t('sidebar.voting')}
                </span>
              ) : (
                t('sidebar.vote')
              )}
            </button>
          ) : (
            <button 
              onClick={resetVote}
              className="w-full mt-2 bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-200 transition"
            >
              {t('sidebar.voteAgain')}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PollWidget;
