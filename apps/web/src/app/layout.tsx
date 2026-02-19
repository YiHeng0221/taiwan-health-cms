/**
 * @fileoverview Root Layout
 * 
 * This is the root layout for the entire application.
 * It wraps all pages with common providers and styling.
 */

import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '台灣健康管理 | Taiwan Health Management',
    template: '%s | 台灣健康管理',
  },
  description: '專業健康管理服務，為您打造最佳健康方案。提供健康檢查、運動指導、營養諮詢等全方位服務。',
  keywords: ['健康管理', '健康檢查', '運動指導', '營養諮詢', '台灣', '健康'],
  authors: [{ name: '台灣健康管理' }],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '台灣健康管理',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
