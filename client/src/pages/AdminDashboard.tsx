
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Article } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles'],
  });

  const createArticle = useMutation({
    mutationFn: (newArticle: Partial<Article>) =>
      fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast.success(t('admin.articleCreated'));
    },
  });

  const updateArticle = useMutation({
    mutationFn: (article: Article) =>
      fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast.success(t('admin.articleUpdated'));
    },
  });

  const deleteArticle = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
      toast.success(t('admin.articleDeleted'));
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('admin.articles')}</h2>
          {isLoading ? (
            <p>{t('common.loading')}</p>
          ) : (
            <div className="space-y-4">
              {articles?.map(article => (
                <div key={article.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span>{article.title_ht}</span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedArticle(article)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteArticle.mutate(article.id)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedArticle ? t('admin.editArticle') : t('admin.newArticle')}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const articleData = {
                title_ht: formData.get('title_ht') as string,
                content_ht: formData.get('content_ht') as string,
                // Add other fields as needed
              };
              
              if (selectedArticle) {
                updateArticle.mutate({ ...selectedArticle, ...articleData });
              } else {
                createArticle.mutate(articleData);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">{t('article.title')}</label>
              <Input
                name="title_ht"
                defaultValue={selectedArticle?.title_ht}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('article.content')}</label>
              <Textarea
                name="content_ht"
                defaultValue={selectedArticle?.content_ht}
                required
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              {selectedArticle && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedArticle(null)}
                >
                  {t('common.cancel')}
                </Button>
              )}
              <Button type="submit">
                {selectedArticle ? t('common.update') : t('common.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
