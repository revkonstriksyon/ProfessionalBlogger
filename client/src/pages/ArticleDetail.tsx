import React, { useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PopularPosts from '@/components/sidebar/PopularPosts';
import Newsletter from '@/components/sidebar/Newsletter';
import TagsWidget from '@/components/sidebar/TagsWidget';
import SocialMedia from '@/components/sidebar/SocialMedia';
import type { Article, Comment } from '@shared/schema';

// Comment form schema
const commentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  content: z.string().min(5, "Comment must be at least 5 characters"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  // Fetch article
  const { data: article, isLoading: articleLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug,
  });

  // Fetch comments if article is loaded
  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: [`/api/articles/${article?.id}/comments`],
    enabled: !!article?.id,
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      if (!article) throw new Error("Article not found");
      return apiRequest('POST', `/api/articles/${article.id}/comments`, data);
    },
    onSuccess: () => {
      toast({
        title: t('article.commentSuccess'),
        description: t('article.commentSuccessMessage'),
        variant: 'success',
      });
      // Reset form
      form.reset();
      // Refetch comments
      queryClient.invalidateQueries({ queryKey: [`/api/articles/${article?.id}/comments`] });
    },
    onError: (error: any) => {
      toast({
        title: t('article.commentError'),
        description: error.message || t('article.commentErrorMessage'),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CommentFormValues) => {
    commentMutation.mutate(data);
  };

  if (articleLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="md:flex md:space-x-6">
          <div className="md:w-2/3">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-80 w-full mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
          <div className="md:w-1/3 space-y-8 mt-8 md:mt-0">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('article.notFound')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('article.notFoundMessage')}
          </p>
          <Link href="/">
            <a className="inline-block px-5 py-2 bg-accent text-white rounded-full hover:bg-accent/80 transition">
              {t('article.backToHome')}
            </a>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="md:flex md:space-x-6">
        <div className="md:w-2/3">
          {/* Article Header */}
          <div className="mb-6">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title[language]}
            </h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
              <span className="mr-4 flex items-center">
                <img 
                  src={article.authorImageUrl || 'https://via.placeholder.com/40'} 
                  alt={article.author} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span>{article.author}</span>
              </span>
              <span className="mr-4">
                <i className="far fa-calendar-alt mr-1"></i> 
                {new Date(article.publishedAt).toLocaleDateString(
                  language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht'
                )}
              </span>
              <span className="mr-4">
                <i className="far fa-eye mr-1"></i> {article.viewCount} {t('blog.views')}
              </span>
              <span>
                <i className="far fa-comment mr-1"></i> {article.commentCount} {t('blog.comments')}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <img 
              src={article.imageUrl} 
              alt={article.title[language]} 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="prose max-w-none">
              {/* Display content - would typically use a rich text renderer here */}
              <div dangerouslySetInnerHTML={{ __html: article.content[language] }} />
            </div>

            {/* Tags and Share */}
            <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <div className="space-x-2 mb-4 md:mb-0">
                <span className="font-semibold text-gray-700">{t('article.tags')}:</span>
                <Link href="/search?tag=ayiti">
                  <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                    #Ayiti
                  </a>
                </Link>
                <Link href="/search?tag=kilti">
                  <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                    #Kilti
                  </a>
                </Link>
              </div>
              
              <div className="space-x-2">
                <span className="font-semibold text-gray-700">{t('article.share')}:</span>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="#" className="text-red-600 hover:text-red-800">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-heading text-xl font-bold mb-6 pb-2 border-b border-gray-200">
              {t('article.comments')} ({comments.length})
            </h3>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="pb-6 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Skeleton className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-11/12 mb-1" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="pb-6 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-accent/20 rounded-full mr-3 flex items-center justify-center text-accent font-bold">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{comment.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(comment.createdAt).toLocaleDateString(
                            language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht'
                          )}
                        </p>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 mb-8">
                <p className="text-gray-600">{t('article.noComments')}</p>
              </div>
            )}

            {/* Comment Form */}
            <div>
              <h4 className="font-heading font-bold text-lg mb-4">{t('article.leaveComment')}</h4>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.name')} {...field} />
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
                            <Input placeholder={t('contact.email')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('article.comment')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('article.commentPlaceholder')} {...field} className="min-h-32" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={commentMutation.isPending}
                    className="bg-accent hover:bg-accent/80 text-white"
                  >
                    {commentMutation.isPending ? (
                      <span className="inline-flex items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i> {t('article.submitting')}
                      </span>
                    ) : (
                      t('article.submitComment')
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-1/3 space-y-8 mt-8 md:mt-0">
          <PopularPosts />
          <Newsletter />
          <TagsWidget />
          <SocialMedia />
        </div>
      </div>
    </main>
  );
};

export default ArticleDetail;
