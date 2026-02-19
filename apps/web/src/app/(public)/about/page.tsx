/**
 * @fileoverview About Page (關於我們)
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Target, Heart, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: '關於我們',
  description: '台灣健康管理致力於提供專業的健康管理服務，陪伴您邁向更健康的生活。',
};

const values = [
  {
    icon: Heart,
    title: '關懷',
    description: '以客戶健康為核心，提供貼心的服務體驗',
  },
  {
    icon: Award,
    title: '專業',
    description: '匯集各領域專家，確保服務品質',
  },
  {
    icon: Target,
    title: '目標導向',
    description: '協助客戶設定並達成健康目標',
  },
  {
    icon: Users,
    title: '團隊合作',
    description: '跨領域團隊協作，提供整合性服務',
  },
];

export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-6">關於台灣健康管理</h1>
            <p className="text-lg text-gray-600 mb-6">
              台灣健康管理成立於2010年，致力於推廣預防醫學理念，
              協助國人建立正確的健康觀念與生活習慣。
            </p>
            <p className="text-gray-600 mb-6">
              我們相信，健康不僅是沒有疾病，更是身心靈的完整平衡。
              透過專業的健康評估、個人化的健康計畫，以及持續的追蹤服務，
              我們陪伴每一位客戶走向更健康、更有活力的生活。
            </p>
          </div>
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-200">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span>公司形象圖</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16 mt-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary-600">使命</h2>
              <p className="text-gray-600">
                透過專業、科學的健康管理服務，協助每一位客戶達成最佳健康狀態，
                提升生活品質，實現健康長壽的目標。
              </p>
            </div>
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary-600">願景</h2>
              <p className="text-gray-600">
                成為台灣最受信賴的健康管理品牌，引領預防醫學的發展，
                讓每個人都能擁有健康、快樂的人生。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container-custom py-16">
        <h2 className="section-title text-center">核心價值</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">專業團隊</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            我們擁有醫師、營養師、運動教練、心理諮商師等多元專業團隊，
            以跨領域整合的方式，為您提供最完善的健康服務。
          </p>
        </div>
      </section>
    </div>
  );
}
