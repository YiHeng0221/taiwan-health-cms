/**
 * @fileoverview Services Page (服務項目)
 */

import type { Metadata } from 'next';
import { Heart, Activity, Leaf, Users, Dumbbell, Stethoscope } from 'lucide-react';

export const metadata: Metadata = {
  title: '服務項目',
  description: '提供專業健康檢查、運動指導、營養諮詢等全方位健康管理服務。',
};

const services = [
  {
    icon: Stethoscope,
    title: '健康檢查',
    description: '提供全面性的健康評估服務，包含基礎健檢、進階健檢、企業團體健檢等多種方案。',
    features: ['基礎生理檢測', '血液檢查', '心電圖檢查', '專業醫師諮詢'],
  },
  {
    icon: Activity,
    title: '運動指導',
    description: '由專業教練量身打造個人化運動計畫，適合各種體能程度的學員。',
    features: ['體能評估', '個人化課表', '一對一指導', '進度追蹤'],
  },
  {
    icon: Leaf,
    title: '營養諮詢',
    description: '專業營養師提供個人化飲食建議，協助達成健康目標。',
    features: ['飲食評估', '營養計畫制定', '食譜建議', '定期追蹤'],
  },
  {
    icon: Heart,
    title: '心理健康',
    description: '關注身心平衡，提供壓力管理與心理支持服務。',
    features: ['壓力評估', '諮商服務', '正念課程', '團體工作坊'],
  },
  {
    icon: Dumbbell,
    title: '體適能訓練',
    description: '針對不同目標設計的體適能課程，提升整體身體素質。',
    features: ['有氧訓練', '肌力訓練', '柔軟度訓練', '平衡訓練'],
  },
  {
    icon: Users,
    title: '企業健康方案',
    description: '為企業量身打造員工健康管理方案，提升職場健康文化。',
    features: ['健康講座', '團體健檢', '運動課程', '健康數據管理'],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">服務項目</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            專業團隊為您提供全方位健康管理服務
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="card p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">準備好開始您的健康旅程了嗎？</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            立即聯絡我們，讓專業團隊為您量身打造最適合的健康管理方案
          </p>
          <a href="/contact" className="btn-primary text-lg">
            預約諮詢
          </a>
        </div>
      </section>
    </div>
  );
}
