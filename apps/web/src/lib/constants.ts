/**
 * @fileoverview Brand constants for 樂頤生健康管理
 *
 * Color usage rules:
 * - Brown background (#7C5745) → text uses cream (#FFFCF8)
 * - Yellow background (#F6CE38) → text uses dark (#191919)
 */

export const BRAND_COLORS = {
  /** 主色 - 黃 */
  yellow: '#F6CE38',
  /** 棕色 - 字體、footer 背景 */
  brown: '#7C5745',
  /** 深色文字 - 用於黃色背景上 */
  dark: '#191919',
  /** 淺色文字 - 用於棕色背景上 */
  cream: '#FFFCF8',
} as const;

export const COMPANY_INFO = {
  name: '樂頤生健康管理',
  nameEn: 'Leyisheng Health',
  slogan: '「用運動改變生活，快樂頤養一生！」',
  legalName: '樂頤生健康管理企業社',
  email: 'leyisheng2024@gmail.com',
  lineUrl: 'https://lin.ee/XMXaiyN',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61574433889817',
  facebookName: '樂頤生健康管理企業社',
  instagramUrl: 'https://www.instagram.com/leyisheng_health',
  instagramHandle: 'leyisheng_health',
  businessHours: {
    days: '週一至週五',
    time: '上午九點至下午六點',
  },
} as const;
