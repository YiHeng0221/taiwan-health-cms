/**
 * @fileoverview Admin Edit FAQ Page
 */

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAdminFaq } from '@/hooks/use-faq';
import { FaqEditor } from '@/components/admin/faq-editor';
import { adminPath } from '@/lib/admin-path';

export default function EditFaqPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: faq, isLoading } = useAdminFaq(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">找不到此常見問題</p>
        <Link href={adminPath('/faq')} className="btn-primary mt-4 inline-flex">
          返回常見問題列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={adminPath('/faq')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回常見問題列表
        </Link>
        <h1 className="text-2xl font-bold">編輯常見問題</h1>
      </div>

      <FaqEditor
        initialData={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
          isActive: faq.isActive,
        }}
      />
    </div>
  );
}
