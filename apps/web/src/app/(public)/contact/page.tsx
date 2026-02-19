/**
 * @fileoverview Contact Page (聯絡我們)
 */

import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '聯絡我們',
  description: '有任何問題或需求，歡迎隨時與我們聯繫。',
};

const contactInfo = [
  {
    icon: Phone,
    title: '電話',
    content: '02-1234-5678',
    description: '週一至週五 09:00-18:00',
  },
  {
    icon: Mail,
    title: '電子郵件',
    content: 'contact@taiwanhealth.com',
    description: '我們會在24小時內回覆',
  },
  {
    icon: MapPin,
    title: '地址',
    content: '台北市信義區健康路100號',
    description: '捷運信義線市政府站步行5分鐘',
  },
  {
    icon: Clock,
    title: '營業時間',
    content: '週一至週五 09:00-18:00',
    description: '週六 09:00-12:00',
  },
];

export default function ContactPage() {
  return (
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
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary-600" />
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

            {/* Map placeholder */}
            <div className="mt-8 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Google Maps 嵌入區域</span>
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
  );
}
