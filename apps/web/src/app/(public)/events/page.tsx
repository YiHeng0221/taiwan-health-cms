/**
 * @fileoverview Events Page (活動花絮)
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: '活動花絮',
  description: '精彩活動回顧，一起見證每個健康時刻。',
};

// TODO: Replace with actual API call
async function getEvents() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="py-12">
      {/* Header */}
      <section className="container-custom text-center mb-12">
        <h1 className="section-title">活動花絮</h1>
        <p className="section-subtitle max-w-2xl mx-auto">
          精彩活動回顧，一起見證每個健康時刻
        </p>
      </section>

      {/* Events Grid */}
      <section className="container-custom">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有活動資料</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event: {
              id: string;
              slug: string;
              title: string;
              description: string;
              date: string;
              location: string;
              images: string[];
            }) => (
              <article key={event.id} className="card overflow-hidden group">
                <div className="relative h-64 bg-gray-100">
                  {event.images?.[0] ? (
                    <Image
                      src={event.images[0]}
                      alt={event.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>無圖片</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString('zh-TW')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
