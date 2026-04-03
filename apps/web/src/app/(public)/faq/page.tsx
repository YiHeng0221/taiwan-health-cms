/**
 * @fileoverview Public FAQ Page (常見問答)
 *
 * Server component that fetches FAQ data from the backend
 * and renders an accordion-style FAQ with structured data for SEO.
 */

import type { Metadata } from 'next';
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { FaqAccordion } from '@/components/faq/faq-accordion';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

export const metadata: Metadata = {
  title: '常見問答',
  description:
    '樂頤生健康管理常見問答 — 關於我們的服務、預約流程、收費方式等常見問題解答。',
  openGraph: {
    title: '常見問答 | 樂頤生健康管理',
    description:
      '關於我們的服務、預約流程、收費方式等常見問題解答。',
    url: `${SITE_URL}/faq`,
  },
};

interface Faq {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

async function getFaqs(): Promise<Faq[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/faq`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data: Faq[] = await res.json();
    return data
      .filter((faq) => faq.isActive)
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '常見問答', url: `${SITE_URL}/faq` },
        ]}
      />

      {faqs.length > 0 && (
        <FAQJsonLd
          items={faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          }))}
        />
      )}

      <div className="py-12">
        {/* Hero */}
        <section className="bg-brand-yellow text-white py-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">常見問答</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              您的疑問，我們來解答
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="container-custom py-16 max-w-3xl mx-auto">
          <FaqAccordion items={faqs} />
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">還有其他問題嗎？</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              找不到您需要的答案？歡迎直接聯繫我們，專業團隊將為您解答
            </p>
            <a href="/contact" className="btn-primary text-lg text-white">
              聯絡我們
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
