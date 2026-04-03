/**
 * @fileoverview Admin FAQ Editor Component
 *
 * Shared form component for creating and editing FAQs.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminPath } from '@/lib/admin-path';
import { useCreateFaq, useUpdateFaq } from '@/hooks/use-faq';
import { Loader2 } from 'lucide-react';

interface FaqFormData {
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface FaqEditorProps {
  initialData?: FaqFormData & { id: string };
}

export function FaqEditor({ initialData }: FaqEditorProps) {
  const router = useRouter();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();

  const [form, setForm] = useState<FaqFormData>({
    question: initialData?.question ?? '',
    answer: initialData?.answer ?? '',
    order: initialData?.order ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const isEdit = !!initialData?.id;
  const isSaving = createFaq.isPending || updateFaq.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateFaq.mutateAsync({ id: initialData!.id, ...form });
      } else {
        await createFaq.mutateAsync(form);
      }
      router.push(adminPath('/faq'));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Question */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          問題 *
        </label>
        <input
          type="text"
          required
          value={form.question}
          onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入常見問題"
        />
      </div>

      {/* Answer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          回答 *
        </label>
        <textarea
          required
          rows={6}
          value={form.answer}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, answer: e.target.value }))
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入回答內容"
        />
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          排序
        </label>
        <input
          type="number"
          value={form.order}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
          }
          className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">數字越小排越前面</p>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          啟用此問題
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? '更新問題' : '建立問題'}
        </button>
        <button
          type="button"
          onClick={() => router.push(adminPath('/faq'))}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
