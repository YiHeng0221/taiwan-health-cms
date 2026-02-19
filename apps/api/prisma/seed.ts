/**
 * @fileoverview Prisma seed script for initial data
 * 
 * This script creates:
 * 1. Default admin user
 * 2. Sample home sections
 * 3. Sample articles
 */

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 開始資料庫種子...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taiwanhealth.com' },
    update: {},
    create: {
      email: 'admin@taiwanhealth.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ 管理員帳號已建立:', admin.email);

  // Create sample home sections
  const homeSections = [
    {
      type: 'banner',
      config: {
        title: '專業健康管理服務',
        subtitle: '為您打造最佳健康方案',
        image: '/images/banner-health.jpg',
        animation: 'fadein',
        buttonText: '了解更多',
        buttonLink: '/services',
      },
      order: 1,
    },
    {
      type: 'services',
      config: {
        title: '我們的服務',
        items: [
          {
            icon: 'heart',
            title: '健康檢查',
            description: '全面性健康評估與追蹤',
            link: '/services#health-check',
          },
          {
            icon: 'activity',
            title: '運動指導',
            description: '客製化運動計畫',
            link: '/services#fitness',
          },
          {
            icon: 'leaf',
            title: '營養諮詢',
            description: '專業營養師一對一諮詢',
            link: '/services#nutrition',
          },
        ],
      },
      order: 2,
    },
    {
      type: 'carousel',
      config: {
        items: [
          {
            title: '2024 健康講座',
            url: '/events/health-seminar-2024',
            image: '/images/event-1.jpg',
            description: '專家分享最新健康趨勢',
          },
          {
            title: '社區運動日',
            url: '/events/community-sports-day',
            image: '/images/event-2.jpg',
            description: '一起動起來，享受運動樂趣',
          },
        ],
        autoplay: true,
        interval: 5000,
      },
      order: 3,
    },
    {
      type: 'cta',
      config: {
        title: '立即預約諮詢',
        description: '讓我們的專業團隊為您服務',
        buttonText: '聯絡我們',
        buttonLink: '/contact',
      },
      order: 4,
    },
  ];

  for (const section of homeSections) {
    await prisma.homeSection.create({ data: section });
  }
  console.log('✅ 首頁區塊已建立');

  // Create sample articles
  const articles = [
    {
      title: '如何建立健康的生活習慣',
      slug: 'healthy-lifestyle-habits',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '養成健康習慣的五個步驟' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '健康的生活習慣是長期健康的基石。本文將分享建立健康習慣的實用技巧。',
              },
            ],
          },
        ],
      },
      coverImage: '/images/article-lifestyle.jpg',
      metaDescription: '學習如何建立健康的生活習慣，五個簡單步驟幫助您改善生活品質。',
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: '運動對心理健康的影響',
      slug: 'exercise-mental-health',
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2 },
            content: [{ type: 'text', text: '運動與心理健康的關係' }],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '研究顯示，規律運動能夠有效改善心理健康，減少焦慮和憂鬱症狀。',
              },
            ],
          },
        ],
      },
      coverImage: '/images/article-mental.jpg',
      metaDescription: '了解運動如何改善心理健康，以及最適合的運動類型。',
      isPublished: true,
      authorId: admin.id,
    },
  ];

  for (const article of articles) {
    await prisma.article.create({ data: article });
  }
  console.log('✅ 範例文章已建立');

  // Create sample events
  const events = [
    {
      title: '2024 春季健康講座',
      slug: 'spring-health-seminar-2024',
      description: '邀請多位專家分享最新健康趨勢與保健知識，歡迎社區民眾參加。',
      date: new Date('2024-03-15'),
      location: '台北市信義區健康中心',
      images: ['/images/event-spring-1.jpg', '/images/event-spring-2.jpg'],
      isPublished: true,
    },
    {
      title: '社區運動日活動',
      slug: 'community-sports-day',
      description: '全家大小一起來運動！包含瑜珈、有氧舞蹈、親子遊戲等多元活動。',
      date: new Date('2024-04-20'),
      location: '台北市大安森林公園',
      images: ['/images/event-sports-1.jpg'],
      isPublished: true,
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log('✅ 範例活動已建立');

  // Create default site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: '台灣健康管理',
      contact: {
        phone: '02-1234-5678',
        email: 'contact@taiwanhealth.com',
        address: '台北市信義區健康路100號',
      },
      social: {
        facebook: 'https://facebook.com/taiwanhealth',
        instagram: 'https://instagram.com/taiwanhealth',
        line: '@taiwanhealth',
      },
    },
  });
  console.log('✅ 網站設定已建立');

  console.log('🎉 資料庫種子完成！');
}

main()
  .catch((e) => {
    console.error('❌ 種子錯誤:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
