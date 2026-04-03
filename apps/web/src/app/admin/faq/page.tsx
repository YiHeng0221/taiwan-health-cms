/**
 * @fileoverview Admin FAQ List Page
 */

'use client';

import Link from 'next/link';
import { useAdminFaqs, useDeleteFaq, useUpdateFaq } from '@/hooks/use-faq';
import { adminPath } from '@/lib/admin-path';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

export default function AdminFaqPage() {
  const { data: faqs, isLoading } = useAdminFaqs();
  const deleteFaq = useDeleteFaq();
  const updateFaq = useUpdateFaq();

  const handleDelete = async (id: string, question: string) => {
    if (confirm(`確定要刪除「${question}」嗎？`)) {
      await deleteFaq.mutateAsync(id);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    await updateFaq.mutateAsync({ id, isActive: !currentActive });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">常見問題管理</h1>
        <Link href={adminPath('/faq/new')} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          新增問題
        </Link>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !faqs?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有常見問題</p>
            <Link href={adminPath('/faq/new')} className="btn-primary mt-4 inline-flex">
              建立第一個問題
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  排序
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  問題
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  回答
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  狀態
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {faq.order}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium line-clamp-1">{faq.question}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {faq.answer}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(faq.id, faq.isActive)}
                      disabled={updateFaq.isPending}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        faq.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {faq.isActive ? '啟用' : '停用'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={adminPath(`/faq/${faq.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="編輯"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(faq.id, faq.question)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                        title="刪除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
