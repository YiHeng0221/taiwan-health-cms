/**
 * @fileoverview Admin Edit Event Page
 */

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAdminEvent } from '@/hooks/use-events';
import { EventEditor } from '@/components/admin/event-editor';
import { adminPath } from '@/lib/admin-path';

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: event, isLoading } = useAdminEvent(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">找不到此活動</p>
        <Link href={adminPath('/events')} className="btn-primary mt-4 inline-flex">
          返回活動列表
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold">編輯活動</h1>
      </div>

      <EventEditor
        initialData={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          description: event.description,
          date: String(event.date),
          location: event.location,
          images: (event.images as string[]) || [],
          isPublished: event.isPublished,
        }}
      />
    </div>
  );
}
