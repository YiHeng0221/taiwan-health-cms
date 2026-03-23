/**
 * @fileoverview Section Type Selector
 *
 * Dropdown to select home section type with a visual preview below.
 */

'use client';

import { HomeSectionType } from '@taiwan-health/shared-types';
import {
  ImageIcon,
  LayoutGrid,
  Award,
  MessageSquare,
  Megaphone,
  Layers,
  Mail,
} from 'lucide-react';

/** Human-readable label + description + icon for each type */
const SECTION_TYPE_META: Record<
  HomeSectionType,
  { label: string; description: string; icon: React.ElementType; preview: () => React.ReactNode }
> = {
  banner: {
    label: '主視覺橫幅',
    description: '首頁最上方的大圖區塊，含標題、副標、按鈕與入場動畫。',
    icon: ImageIcon,
    preview: BannerPreview,
  },
  carousel: {
    label: '輪播相簿',
    description: '活動花絮 / 合作經驗等，可放多張圖片自動輪播。',
    icon: Layers,
    preview: CarouselPreview,
  },
  services: {
    label: '服務項目',
    description: '首頁服務一覽區塊，含圖片卡片與簡介。',
    icon: LayoutGrid,
    preview: ServicesPreview,
  },
  cta: {
    label: 'CTA 行動呼籲',
    description: '引導使用者前往某頁面的黃色強調區塊。',
    icon: Megaphone,
    preview: CtaPreview,
  },
  contact_cta: {
    label: '聯絡我們 CTA',
    description: '帶 Email 輸入框的聯絡區塊。',
    icon: Mail,
    preview: ContactCtaPreview,
  },
  features: {
    label: '特色功能',
    description: '多欄式圖示 + 標題 + 說明的列表區塊。',
    icon: Award,
    preview: FeaturesPreview,
  },
  testimonials: {
    label: '用戶見證',
    description: '客戶推薦語錄列表。',
    icon: MessageSquare,
    preview: TestimonialsPreview,
  },
};

const SECTION_TYPES = Object.keys(SECTION_TYPE_META) as HomeSectionType[];

interface Props {
  value: HomeSectionType | null;
  onChange: (type: HomeSectionType) => void;
  disabled?: boolean;
}

export function SectionTypeSelector({ value, onChange, disabled }: Props) {
  const meta = value ? SECTION_TYPE_META[value] : null;

  return (
    <div className="space-y-4">
      {/* Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          區塊版型
        </label>
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value as HomeSectionType)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            — 請選擇版型 —
          </option>
          {SECTION_TYPES.map((type) => {
            const m = SECTION_TYPE_META[type];
            return (
              <option key={type} value={type}>
                {m.label}
              </option>
            );
          })}
        </select>
      </div>

      {/* Preview */}
      {meta && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
            <meta.icon className="h-5 w-5 text-brand-brown" />
            <div>
              <p className="text-sm font-semibold text-brand-dark">{meta.label}</p>
              <p className="text-xs text-gray-500">{meta.description}</p>
            </div>
          </div>
          {/* Visual preview */}
          <div className="p-4">
            <meta.preview />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mini Preview Components ────────────────────────────── */

function BannerPreview() {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-brand-dark to-brand-brown h-28 flex items-center px-6">
      <div className="space-y-1">
        <div className="h-3 w-36 bg-white/80 rounded" />
        <div className="h-2 w-24 bg-white/50 rounded" />
        <div className="h-5 w-16 bg-brand-yellow rounded mt-2" />
      </div>
      <div className="ml-auto w-20 h-20 bg-white/20 rounded-lg" />
    </div>
  );
}

function CarouselPreview() {
  return (
    <div className="flex items-center justify-center gap-2 h-20">
      <div className="w-14 h-14 bg-gray-300/60 rounded-lg scale-90 opacity-50" />
      <div className="w-16 h-16 bg-brand-brown/30 rounded-lg border-2 border-brand-brown/40" />
      <div className="w-14 h-14 bg-gray-300/60 rounded-lg scale-90 opacity-50" />
    </div>
  );
}

function ServicesPreview() {
  return (
    <div className="grid grid-cols-3 gap-2 h-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg p-2 flex flex-col items-center justify-center gap-1 shadow-sm">
          <div className="w-6 h-4 bg-gray-200 rounded" />
          <div className="h-1.5 w-10 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

function CtaPreview() {
  return (
    <div className="bg-brand-yellow/30 rounded-lg h-20 flex flex-col items-center justify-center gap-1.5">
      <div className="h-2.5 w-28 bg-brand-dark/30 rounded" />
      <div className="h-2 w-20 bg-brand-dark/20 rounded" />
      <div className="h-5 w-14 bg-brand-dark/70 rounded mt-1" />
    </div>
  );
}

function ContactCtaPreview() {
  return (
    <div className="bg-brand-yellow/20 rounded-lg h-20 flex flex-col items-center justify-center gap-1.5">
      <div className="h-2.5 w-24 bg-brand-dark/30 rounded" />
      <div className="flex items-center gap-1">
        <div className="h-5 w-28 bg-white rounded border border-gray-300" />
        <div className="h-5 w-10 bg-brand-dark/70 rounded" />
      </div>
    </div>
  );
}

function FeaturesPreview() {
  return (
    <div className="grid grid-cols-3 gap-2 h-20">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg p-2 flex flex-col items-center justify-center gap-1 shadow-sm">
          <div className="w-5 h-5 bg-brand-yellow/40 rounded-full" />
          <div className="h-1.5 w-8 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

function TestimonialsPreview() {
  return (
    <div className="flex gap-2 h-20">
      {[1, 2].map((i) => (
        <div key={i} className="flex-1 bg-white rounded-lg p-2 shadow-sm flex flex-col justify-center gap-1">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
            <div className="h-1.5 w-10 bg-gray-300 rounded" />
          </div>
          <div className="h-1 w-full bg-gray-200 rounded" />
          <div className="h-1 w-3/4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
