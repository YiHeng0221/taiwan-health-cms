/**
 * @fileoverview Edit Article Page
 */

'use client';

import { useAdminArticle } from '@/hooks/use-articles';
import { ArticleEditor } from '@/components/admin/article-editor';
import { Loader2 } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default function EditArticlePage({ params }: Props) {
  const { data: article, isLoading, error } = useAdminArticle(params.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">載入文章失敗</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">編輯文章</h1>
      <ArticleEditor article={article} />
    </div>
  );
}
