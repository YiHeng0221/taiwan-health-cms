/**
 * @fileoverview Admin Articles List Page
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdminArticles, useDeleteArticle, useTogglePublish } from '@/hooks/use-articles';
import { formatDate } from '@/lib/utils';
import { adminPath } from '@/lib/admin-path';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminArticlesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminArticles({ page, pageSize: 20 });
  const deleteArticle = useDeleteArticle();
  const togglePublish = useTogglePublish();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`確定要刪除「${title}」嗎？`)) {
      await deleteArticle.mutateAsync(id);
    }
  };

  const handleTogglePublish = async (id: string) => {
    await togglePublish.mutateAsync(id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href={adminPath('/articles/new')} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          新增文章
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !data?.items?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有文章</p>
            <Link href={adminPath('/articles/new')} className="btn-primary mt-4">
              建立第一篇文章
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  標題
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  狀態
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  建立日期
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-gray-500">/articles/{article.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {article.isPublished ? '已發布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(article.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title={article.isPublished ? '取消發布' : '發布'}
                      >
                        {article.isPublished ? (
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      <Link
                        href={adminPath(`/articles/${article.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-outline"
          >
            上一頁
          </button>
          <span className="text-gray-600">
            第 {page} / {data.totalPages} 頁
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            className="btn-outline"
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}
