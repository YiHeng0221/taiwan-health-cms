/**
 * @fileoverview Root Layout
 *
 * This is the root layout for the entire application.
 * It wraps all pages with common providers and styling.
 * Metadata is fetched from backend settings for SEO.
 */

import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { getSiteSettings } from '@/lib/get-settings';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || '樂頤生健康管理 | Leyisheng Health';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description:
      '用運動改變生活，快樂頤養一生！樂頤生健康管理提供專業運動指導與健康管理服務。',
    keywords: [
      '健康管理', '運動指導', '樂頤生', 'Leyisheng Health', '台灣',
      '健康', '個人化運動計畫', '企業健康管理', '銀髮族運動',
      '預防醫學', '運動教練', '健康促進', '體適能', '運動處方',
      '慢性病預防', '營養諮詢', '健康檢查',
    ],
    authors: [{ name: siteName }],
    openGraph: {
      type: 'website',
      locale: 'zh_TW',
      siteName,
    },
    icons: settings?.favicon
      ? { icon: settings.favicon, apple: settings.favicon }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="zh-TW">
      <body>
        <OrganizationJsonLd
          name={settings?.siteName || '樂頤生健康管理'}
          url={SITE_URL}
          logo={settings?.logo || undefined}
          description="用運動改變生活，快樂頤養一生！樂頤生健康管理提供專業運動指導與健康管理服務。"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
