'use client';

import Image from 'next/image';
import { Heart, Award, Target, Users, type LucideIcon } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { useSettings, AboutPageConfig } from '@/hooks/use-settings';
import { Loader2 } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

const valueIcons: LucideIcon[] = [Heart, Award, Target, Users];

const defaultConfig: AboutPageConfig = {
  heroTitle: '關於樂頤生健康管理',
  heroDescription:
    '樂頤生健康管理致力於用運動改變生活，協助大眾建立正確的運動觀念與健康生活習慣。\n\n我們相信，健康不僅是沒有疾病，更是身心靈的完整平衡。透過專業的運動指導、個人化的健康計畫，以及持續的追蹤服務，我們陪伴每一位客戶走向更健康、更有活力的生活。',
  heroImage: '',
  mission:
    '透過專業、科學的健康管理服務，協助每一位客戶達成最佳健康狀態，提升生活品質，實現健康長壽的目標。',
  vision:
    '成為台灣最受信賴的健康管理品牌，引領預防醫學的發展，讓每個人都能擁有健康、快樂的人生。',
  values: [
    { title: '關懷', description: '以客戶健康為核心，提供貼心的服務體驗' },
    { title: '專業', description: '匯集各領域專家，確保服務品質' },
    { title: '目標導向', description: '協助客戶設定並達成健康目標' },
    { title: '團隊合作', description: '跨領域團隊協作，提供整合性服務' },
  ],
};

export default function AboutPage() {
  const { data: settings, isLoading } = useSettings();
  const config: AboutPageConfig = settings?.aboutPage
    ? { ...defaultConfig, ...settings.aboutPage }
    : defaultConfig;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '關於我們', url: `${SITE_URL}/about` },
        ]}
      />
      <div className="py-12">
        {/* Hero Section */}
        <section className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">{config.heroTitle}</h1>
              <div className="text-lg text-gray-600 whitespace-pre-line">
                {config.heroDescription}
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-200">
              {config.heroImage ? (
                <Image
                  src={config.heroImage}
                  alt={config.heroTitle}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span>公司形象圖</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 py-16 mt-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4 text-brand-brown">
                  使命
                </h2>
                <p className="text-gray-600">{config.mission}</p>
              </div>
              <div className="card p-8">
                <h2 className="text-2xl font-bold mb-4 text-brand-brown">
                  願景
                </h2>
                <p className="text-gray-600">{config.vision}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        {config.values.length > 0 && (
          <section className="container-custom py-16">
            <h2 className="section-title text-center">核心價值</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {config.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-brand-yellow" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
