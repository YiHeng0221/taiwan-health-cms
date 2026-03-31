/**
 * @fileoverview Events Page (活動花絮)
 */

import type { Metadata } from 'next';
import { EventsList } from '@/components/events/events-list';

export const metadata: Metadata = {
  title: '活動花絮',
  description: '精彩活動回顧，一起見證每個健康時刻。',
};

export default function EventsPage() {
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
        <EventsList />
      </section>
    </div>
  );
}
