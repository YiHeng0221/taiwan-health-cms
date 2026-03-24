/**
 * @fileoverview Article Editor Component
 * 
 * Rich text editor using Tiptap for article creation/editing.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminPath } from '@/lib/admin-path';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateArticle, useUpdateArticle } from '@/hooks/use-articles';
import { Article, TiptapContent } from '@taiwan-health/shared-types';
import { TiptapEditor } from './tiptap-editor';
import { cn } from '@/lib/utils';
import { Loader2, Save, Eye } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(1, '請輸入標題').max(200, '標題最多200個字元'),
  slug: z.string().max(200, '網址代稱最多200個字元').optional(),
  metaDescription: z.string().max(160, 'Meta Description 最多160個字元').optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface Props {
  article?: Article;
}

export function ArticleEditor({ article }: Props) {
  const router = useRouter();
  const isEditing = !!article;

  const [content, setContent] = useState<TiptapContent>(
    article?.content || {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    }
  );

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      slug: article?.slug || '',
      metaDescription: article?.metaDescription || '',
      coverImage: article?.coverImage || '',
      isPublished: article?.isPublished || false,
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    const payload = {
      ...data,
      content,
    };

    if (isEditing) {
      await updateArticle.mutateAsync({ id: article.id, data: payload });
    } else {
      await createArticle.mutateAsync(payload as any);
    }

    router.push(adminPath('/articles'));
  };

  const isSubmitting = createArticle.isPending || updateArticle.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              className={cn('input text-xl', errors.title && 'input-error')}
              placeholder="輸入文章標題..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章內容 <span className="text-red-500">*</span>
            </label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">發布設定</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('isPublished')}
                  className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
                />
                <span className="text-sm">立即發布</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    儲存中...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {isEditing ? '更新文章' : '建立文章'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">SEO 設定</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  網址代稱 (Slug)
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  className="input"
                  placeholder="my-article-url"
                />
                <p className="text-xs text-gray-500 mt-1">
                  留空則自動從標題產生
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  {...register('metaDescription')}
                  rows={3}
                  className="input resize-none"
                  placeholder="搜尋引擎顯示的文章描述..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {watch('metaDescription')?.length || 0}/160
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">封面圖片</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                圖片網址
              </label>
              <input
                type="text"
                {...register('coverImage')}
                className="input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
