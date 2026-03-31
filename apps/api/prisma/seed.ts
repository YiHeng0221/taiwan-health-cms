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

if (process.env.NODE_ENV === 'production') {
  console.error('Seed script should not be run in production!');
  process.exit(1);
}

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

  // Clear existing home sections before re-seeding
  await prisma.homeSection.deleteMany();
  console.log('🗑️  舊首頁區塊已清除');

  // Create sample home sections (matching mockup design)
  const homeSections = [
    {
      type: 'banner',
      config: {
        title: '樂頤生健康管理',
        subtitle: 'Health Management',
        image: '',
        animation: 'fadein',
        buttonText: '聯絡我們',
        buttonLink: '/contact',
      },
      order: 1,
    },
    {
      type: 'services',
      config: {
        title: '服務項目',
        items: [
          {
            icon: 'users',
            title: '特殊族群個別指導',
            description: '針對特殊族群提供個別化運動指導',
            link: '/services#special',
            image: '',
          },
          {
            icon: 'activity',
            title: '團體運動指導',
            description: '專業團體運動課程指導',
            link: '/services#group',
            image: '',
          },
          {
            icon: 'dumbbell',
            title: '個人運動指導',
            description: '一對一客製化運動指導',
            link: '/services#personal',
            image: '',
          },
        ],
      },
      order: 2,
    },
    {
      type: 'carousel',
      config: {
        title: '活動花絮',
        items: [
          {
            title: '社區活動',
            image: '',
            url: '/events',
          },
          {
            title: '團體課程',
            image: '',
            url: '/events',
          },
          {
            title: '個別指導',
            image: '',
            url: '/events',
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
        title: '守護健康，從今天開始！\n立即與我們聯絡',
        description: '想讓追尋更健康、更有活力嗎？\n現在就預約諮詢，讓我們陪您一起打造高品質、無憂的樂齡生活。',
        buttonText: '聯絡我們',
        buttonLink: '/contact',
        emailPlaceholder: '輸入您的 E-mail',
      },
      order: 4,
    },
    {
      type: 'carousel',
      config: {
        title: '合作經驗',
        items: [
          {
            title: '社區年度嘉年華盛事！！！耀輝社區與六份社區聯合舉辦家庭據點日，凝聚團結有力的社區力量！！！',
            image: '',
          },
          {
            title: '與在地社區合作推廣健康促進活動',
            image: '',
          },
          {
            title: '企業健康管理合作方案',
            image: '',
          },
        ],
        autoplay: true,
        interval: 5000,
      },
      order: 5,
    },
  ];

  for (const section of homeSections) {
    await prisma.homeSection.create({ data: section });
  }
  console.log('✅ 首頁區塊已建立');

  // Create sample articles
  // Seed services
  await prisma.service.deleteMany();
  const serviceItems = [
    {
      title: '特殊族群個別指導',
      description: '針對銀髮族、孕產婦、慢性病患者等特殊族群，提供安全且有效的個別化運動指導方案。',
      icon: 'users',
      features: ['個別化體能評估', '安全運動處方', '慢性病運動管理', '定期追蹤調整'],
      order: 1,
    },
    {
      title: '團體運動指導',
      description: '專業教練帶領的小班制團體運動課程，兼顧社交互動與運動效果。',
      icon: 'activity',
      features: ['小班制教學', '多元課程選擇', '社區據點合作', '企業團體方案'],
      order: 2,
    },
    {
      title: '個人運動指導',
      description: '一對一客製化運動指導，根據個人目標與身體狀況量身打造訓練計畫。',
      icon: 'dumbbell',
      features: ['體能評估', '個人化課表', '一對一指導', '進度追蹤'],
      order: 3,
    },
  ];
  for (const item of serviceItems) {
    await prisma.service.create({ data: item });
  }
  console.log('✅ 服務項目已建立');

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
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
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
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
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
