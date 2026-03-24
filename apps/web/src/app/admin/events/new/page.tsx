/**
 * @fileoverview Admin New Event Page
 */

'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { EventEditor } from '@/components/admin/event-editor';
import { adminPath } from '@/lib/admin-path';

export default function NewEventPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href={adminPath('/events')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回活動列表
        </Link>
        <h1 className="text-2xl font-bold">新增活動</h1>
      </div>

      <EventEditor />
    </div>
  );
}
