/**
 * @fileoverview Contact Page (聯絡我們)
 */

import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.leyisheng.com';

export const metadata: Metadata = {
  title: '聯絡我們',
  description: '有任何問題或需求，歡迎隨時與我們聯繫。',
};

const contactInfo = [
  {
    icon: Mail,
    title: '電子信箱',
    content: 'leyisheng2024@gmail.com',
    description: '我們會盡快回覆您',
  },
  {
    icon: Phone,
    title: '官方 Line',
    content: 'Line 官方帳號',
    description: 'https://lin.ee/XMXaiyN',
  },
  {
    icon: MapPin,
    title: '社群媒體',
    content: 'Facebook / Instagram',
    description: '樂頤生健康管理企業社 | @leyisheng_health',
  },
  {
    icon: Clock,
    title: '營業時間',
    content: '週一至週五',
    description: '上午九點至下午六點',
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: '首頁', url: SITE_URL },
          { name: '聯絡我們', url: `${SITE_URL}/contact` },
        ]}
      />
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">聯絡我們</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            有任何問題或需求，歡迎隨時與我們聯繫
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">聯絡資訊</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-gray-900">{info.content}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">線上諮詢</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
