/**
 * @fileoverview Admin New FAQ Page
 */

'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FaqEditor } from '@/components/admin/faq-editor';
import { adminPath } from '@/lib/admin-path';

export default function NewFaqPage() {
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
        <h1 className="text-2xl font-bold">新增常見問題</h1>
      </div>

      <FaqEditor />
    </div>
  );
}
