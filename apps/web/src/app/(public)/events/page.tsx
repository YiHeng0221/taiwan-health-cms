/**
 * @fileoverview Events Page (活動花絮)
 */

import type { Metadata } from 'next';
import { EventsList } from '@/components/events/events-list';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

export const metadata: Metadata = {
  title: '活動花絮',
  description: '精彩活動回顧，一起見證每個健康時刻。',
};

export default function EventsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '活動花絮', url: `${SITE_URL}/events` },
        ]}
      />
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
    </>
  );
}
