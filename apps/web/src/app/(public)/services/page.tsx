/**
 * @fileoverview Services Page (服務項目)
 * Data-driven from backend API.
 */

'use client';

import Image from 'next/image';
import {
  Heart,
  Activity,
  Leaf,
  Users,
  Dumbbell,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';
import { useServices } from '@/hooks/use-services';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

/** Map icon name → Lucide component */
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  activity: Activity,
  leaf: Leaf,
  users: Users,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
};

export default function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '服務項目', url: `${SITE_URL}/services` },
        ]}
      />
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-brand-yellow text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">服務項目</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            專業團隊為您提供全方位健康管理服務
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-custom py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-6" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">載入服務項目時發生錯誤</p>
        ) : services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] ?? Activity;
              const features = (service.features ?? []) as string[];

              return (
                <div key={service.id} className="card p-8">
                  {/* Image or Icon */}
                  {service.image ? (
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6 bg-gray-50">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-brand-yellow/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-brand-yellow" />
                    </div>
                  )}

                  <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">尚無服務項目</p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">準備好開始您的健康旅程了嗎？</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            立即聯絡我們，讓專業團隊為您量身打造最適合的健康管理方案
          </p>
          <a href="/contact" className="btn-primary text-lg text-white">
            預約諮詢
          </a>
        </div>
      </section>
    </div>
    </>
  );
}
