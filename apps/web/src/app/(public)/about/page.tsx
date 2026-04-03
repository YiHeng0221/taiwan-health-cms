'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import {
  useSettings,
  AboutSection,
  HeroSectionConfig,
  CardsSectionConfig,
  IconGridSectionConfig,
  TextSectionConfig,
} from '@/hooks/use-settings';
import { getIcon } from '@/app/admin/about/icon-picker';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

const defaultSections: AboutSection[] = [
  {
    id: 'd1',
    type: 'hero',
    config: {
      title: '關於樂頤生健康管理',
      description:
        '樂頤生健康管理致力於用運動改變生活，協助大眾建立正確的運動觀念與健康生活習慣。\n\n我們相信，健康不僅是沒有疾病，更是身心靈的完整平衡。透過專業的運動指導、個人化的健康計畫，以及持續的追蹤服務，我們陪伴每一位客戶走向更健康、更有活力的生活。',
      image: '',
      imagePosition: 'center' as const,
    },
  },
  {
    id: 'd2',
    type: 'cards',
    config: {
      title: '使命與願景',
      bgColor: 'gray' as const,
      items: [
        {
          title: '使命',
          description:
            '透過專業、科學的健康管理服務，協助每一位客戶達成最佳健康狀態，提升生活品質，實現健康長壽的目標。',
        },
        {
          title: '願景',
          description:
            '成為台灣最受信賴的健康管理品牌，引領預防醫學的發展，讓每個人都能擁有健康、快樂的人生。',
        },
      ],
    },
  },
  {
    id: 'd3',
    type: 'icon-grid',
    config: {
      title: '核心價值',
      columns: 4 as const,
      items: [
        { icon: 'heart', title: '關懷', description: '以客戶健康為核心，提供貼心的服務體驗' },
        { icon: 'award', title: '專業', description: '匯集各領域專家，確保服務品質' },
        { icon: 'target', title: '目標導向', description: '協助客戶設定並達成健康目標' },
        { icon: 'users', title: '團隊合作', description: '跨領域團隊協作，提供整合性服務' },
      ],
    },
  },
];

function HeroSection({ config }: { config: HeroSectionConfig }) {
  return (
    <section className="container-custom py-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">{config.title}</h1>
          <div className="text-lg text-gray-600 whitespace-pre-line">
            {config.description}
          </div>
        </div>
        <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-200">
          {config.image ? (
            <Image
              src={config.image}
              alt={config.title}
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
  );
}

function CardsSection({ config }: { config: CardsSectionConfig }) {
  return (
    <section className={config.bgColor === 'gray' ? 'bg-gray-50 py-16' : 'py-16'}>
      <div className="container-custom">
        {config.title && (
          <h2 className="section-title text-center mb-8">{config.title}</h2>
        )}
        <div className="grid md:grid-cols-2 gap-12">
          {config.items.map((item, i) => (
            <div key={i} className="card p-8">
              <h3 className="text-2xl font-bold mb-4 text-brand-brown">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconGridSection({ config }: { config: IconGridSectionConfig }) {
  const cols = config.columns || 4;
  return (
    <section className="container-custom py-16">
      {config.title && <h2 className="section-title text-center">{config.title}</h2>}
      <div
        className="grid gap-6 mt-12"
        style={{
          gridTemplateColumns: `repeat(${Math.min(cols, config.items.length)}, minmax(0, 1fr))`,
        }}
      >
        {config.items.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-brand-yellow" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TextSection({ config }: { config: TextSectionConfig }) {
  return (
    <section className="container-custom py-16">
      {config.title && <h2 className="section-title text-center mb-6">{config.title}</h2>}
      <div className="text-gray-600 whitespace-pre-line max-w-3xl mx-auto">
        {config.content}
      </div>
    </section>
  );
}

function RenderSection({ section }: { section: AboutSection }) {
  switch (section.type) {
    case 'hero':
      return <HeroSection config={section.config as HeroSectionConfig} />;
    case 'cards':
      return <CardsSection config={section.config as CardsSectionConfig} />;
    case 'icon-grid':
      return <IconGridSection config={section.config as IconGridSectionConfig} />;
    case 'text':
      return <TextSection config={section.config as TextSectionConfig} />;
    default:
      return null;
  }
}

export default function AboutPage() {
  const { data: settings, isLoading } = useSettings();

  const sections: AboutSection[] =
    settings?.aboutPage?.sections && settings.aboutPage.sections.length > 0
      ? settings.aboutPage.sections
      : defaultSections;

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
      <div className="py-12 space-y-0">
        {sections.map((section) => (
          <RenderSection key={section.id} section={section} />
        ))}
      </div>
    </>
  );
}
