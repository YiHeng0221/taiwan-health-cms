/**
 * @fileoverview Events List Component
 */

'use client';

import { usePublicEvents } from '@/hooks/use-events';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

export function EventsList() {
  const { data: events, isLoading, error } = usePublicEvents();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">載入活動時發生錯誤，請稍後再試。</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">目前沒有活動紀錄</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {events.map((event) => (
        <article key={event.id} className="card overflow-hidden">
          {/* Event Images */}
          <div className="relative h-48 bg-gray-100">
            {event.images && event.images.length > 0 ? (
              <Image
                src={event.images[0]}
                alt={event.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <span>無圖片</span>
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-3">{event.title}</h2>

            <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>

            <p className="text-gray-600 line-clamp-3">{event.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
