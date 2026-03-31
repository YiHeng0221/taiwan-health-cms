/**
 * @fileoverview Admin New Service Page
 */

'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ServiceEditor } from '@/components/admin/service-editor';
import { adminPath } from '@/lib/admin-path';

export default function NewServicePage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href={adminPath('/services')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回服務列表
        </Link>
        <h1 className="text-2xl font-bold">新增服務</h1>
      </div>

      <ServiceEditor />
    </div>
  );
}
