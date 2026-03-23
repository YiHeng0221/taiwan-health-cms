/**
 * @fileoverview Section Config Forms
 *
 * One form per section type. Each receives the current config and
 * calls onChange whenever a field changes.
 */

'use client';

import { useState } from 'react';
import {
  BannerConfig,
  CarouselConfig,
  CarouselItem,
  CtaConfig,
  ContactCtaConfig,
  ServicesConfig,
  ServiceItem,
  FeaturesConfig,
  FeatureItem,
  TestimonialsConfig,
  TestimonialItem,
  HomeSectionType,
  HomeSectionConfig,
} from '@taiwan-health/shared-types';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ImageUploadField } from './image-upload-field';

/* ─── Shared helpers ────────────────────────────────────── */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow resize-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

/* ─── Default configs ───────────────────────────────────── */

export function getDefaultConfig(type: HomeSectionType): HomeSectionConfig {
  switch (type) {
    case 'banner':
      return { title: '', subtitle: '', image: '', animation: 'fadein' as const, buttonText: '', buttonLink: '' };
    case 'carousel':
      return { title: '', items: [], autoplay: true, interval: 5000 };
    case 'services':
      return { title: '我們的服務', items: [] };
    case 'cta':
      return { title: '', description: '', buttonText: '', buttonLink: '' };
    case 'contact_cta':
      return { title: '', subtitle: '', description: '', buttonText: '送出', buttonLink: '/contact', emailPlaceholder: '請輸入 Email' };
    case 'features':
      return { title: '', subtitle: '', items: [] };
    case 'testimonials':
      return { title: '用戶見證', items: [] };
  }
}

/* ─── Banner Form ───────────────────────────────────────── */

export function BannerForm({
  config,
  onChange,
}: {
  config: BannerConfig;
  onChange: (c: BannerConfig) => void;
}) {
  const set = <K extends keyof BannerConfig>(key: K, val: BannerConfig[K]) =>
    onChange({ ...config, [key]: val });

  return (
    <div className="space-y-4">
      <Input label="標題" value={config.title} onChange={(v) => set('title', v)} placeholder="主視覺標題" />
      <Input label="副標題" value={config.subtitle ?? ''} onChange={(v) => set('subtitle', v)} placeholder="副標題文字（選填）" />
      <ImageUploadField label="背景圖片" value={config.image} onChange={(v) => set('image', v)} />
      <Select
        label="入場動畫"
        value={config.animation}
        onChange={(v) => set('animation', v as BannerConfig['animation'])}
        options={[
          { value: 'fadein', label: '淡入' },
          { value: 'slide', label: '滑入' },
          { value: 'zoom', label: '縮放' },
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="按鈕文字" value={config.buttonText ?? ''} onChange={(v) => set('buttonText', v)} placeholder="了解更多" />
        <Input label="按鈕連結" value={config.buttonLink ?? ''} onChange={(v) => set('buttonLink', v)} placeholder="/services" />
      </div>
    </div>
  );
}

/* ─── Carousel Form ─────────────────────────────────────── */

export function CarouselForm({
  config,
  onChange,
}: {
  config: CarouselConfig;
  onChange: (c: CarouselConfig) => void;
}) {
  const set = <K extends keyof CarouselConfig>(key: K, val: CarouselConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateItem = (index: number, partial: Partial<CarouselItem>) => {
    const items = [...config.items];
    items[index] = { ...items[index], ...partial };
    set('items', items);
  };

  const addItem = () => {
    set('items', [...config.items, { image: '', title: '' }]);
  };

  const removeItem = (index: number) => {
    set('items', config.items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Input label="區塊標題" value={config.title} onChange={(v) => set('title', v)} placeholder="活動花絮" />
      <div className="grid grid-cols-2 gap-4">
        <Toggle label="自動播放" checked={config.autoplay ?? true} onChange={(v) => set('autoplay', v)} />
        <Input label="播放間隔 (ms)" value={String(config.interval ?? 5000)} onChange={(v) => set('interval', Number(v) || 5000)} type="number" />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">輪播項目</label>
          <button type="button" onClick={addItem} className="text-sm text-brand-brown hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> 新增項目
          </button>
        </div>

        <div className="space-y-3">
          {config.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">項目 {i + 1}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <Input label="標題（選填）" value={item.title ?? ''} onChange={(v) => updateItem(i, { title: v })} placeholder="圖片標題" />
                <ImageUploadField label="圖片" value={item.image} onChange={(v) => updateItem(i, { image: v })} />
                <Input label="連結（選填）" value={item.url ?? ''} onChange={(v) => updateItem(i, { url: v })} placeholder="https://..." />
              </div>
            </div>
          ))}
          {config.items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">尚未新增任何項目</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Services Form ─────────────────────────────────────── */

export function ServicesForm({
  config,
  onChange,
}: {
  config: ServicesConfig;
  onChange: (c: ServicesConfig) => void;
}) {
  const set = <K extends keyof ServicesConfig>(key: K, val: ServicesConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateItem = (index: number, partial: Partial<ServiceItem>) => {
    const items = [...config.items];
    items[index] = { ...items[index], ...partial };
    set('items', items);
  };

  const addItem = () => {
    set('items', [...config.items, { icon: 'activity', title: '', description: '', link: '/services' }]);
  };

  const removeItem = (index: number) => {
    set('items', config.items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Input label="區塊標題" value={config.title} onChange={(v) => set('title', v)} placeholder="我們的服務" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">服務項目</label>
          <button type="button" onClick={addItem} className="text-sm text-brand-brown hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> 新增服務
          </button>
        </div>

        <div className="space-y-3">
          {config.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">服務 {i + 1}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input label="圖示名稱" value={item.icon} onChange={(v) => updateItem(i, { icon: v })} placeholder="activity" />
                  <Input label="標題" value={item.title} onChange={(v) => updateItem(i, { title: v })} placeholder="服務名稱" />
                </div>
                <Textarea label="說明" value={item.description} onChange={(v) => updateItem(i, { description: v })} placeholder="服務說明" rows={2} />
                <Input label="連結" value={item.link} onChange={(v) => updateItem(i, { link: v })} placeholder="/services" />
                <ImageUploadField label="圖片（選填）" value={item.image ?? ''} onChange={(v) => updateItem(i, { image: v })} />
              </div>
            </div>
          ))}
          {config.items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">尚未新增任何服務項目</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CTA Form ──────────────────────────────────────────── */

export function CtaForm({
  config,
  onChange,
}: {
  config: CtaConfig;
  onChange: (c: CtaConfig) => void;
}) {
  const set = <K extends keyof CtaConfig>(key: K, val: CtaConfig[K]) =>
    onChange({ ...config, [key]: val });

  return (
    <div className="space-y-4">
      <Input label="標題" value={config.title} onChange={(v) => set('title', v)} placeholder="CTA 標題" />
      <Textarea label="描述" value={config.description} onChange={(v) => set('description', v)} placeholder="CTA 說明文字" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="按鈕文字" value={config.buttonText} onChange={(v) => set('buttonText', v)} placeholder="立即了解" />
        <Input label="按鈕連結" value={config.buttonLink} onChange={(v) => set('buttonLink', v)} placeholder="/contact" />
      </div>
      <ImageUploadField label="背景圖片（選填）" value={config.backgroundImage ?? ''} onChange={(v) => set('backgroundImage', v)} />
    </div>
  );
}

/* ─── Contact CTA Form ──────────────────────────────────── */

export function ContactCtaForm({
  config,
  onChange,
}: {
  config: ContactCtaConfig;
  onChange: (c: ContactCtaConfig) => void;
}) {
  const set = <K extends keyof ContactCtaConfig>(key: K, val: ContactCtaConfig[K]) =>
    onChange({ ...config, [key]: val });

  return (
    <div className="space-y-4">
      <Input label="標題" value={config.title} onChange={(v) => set('title', v)} placeholder="聯絡我們" />
      <Input label="副標題" value={config.subtitle ?? ''} onChange={(v) => set('subtitle', v)} placeholder="副標題（選填）" />
      <Textarea label="描述" value={config.description ?? ''} onChange={(v) => set('description', v)} placeholder="描述文字（選填）" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="按鈕文字" value={config.buttonText} onChange={(v) => set('buttonText', v)} placeholder="送出" />
        <Input label="按鈕連結" value={config.buttonLink} onChange={(v) => set('buttonLink', v)} placeholder="/contact" />
      </div>
      <Input label="Email 欄位提示" value={config.emailPlaceholder ?? ''} onChange={(v) => set('emailPlaceholder', v)} placeholder="請輸入 Email" />
    </div>
  );
}

/* ─── Features Form ─────────────────────────────────────── */

export function FeaturesForm({
  config,
  onChange,
}: {
  config: FeaturesConfig;
  onChange: (c: FeaturesConfig) => void;
}) {
  const set = <K extends keyof FeaturesConfig>(key: K, val: FeaturesConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateItem = (index: number, partial: Partial<FeatureItem>) => {
    const items = [...config.items];
    items[index] = { ...items[index], ...partial };
    set('items', items);
  };

  const addItem = () => {
    set('items', [...config.items, { icon: 'star', title: '', description: '' }]);
  };

  const removeItem = (index: number) => {
    set('items', config.items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Input label="區塊標題" value={config.title} onChange={(v) => set('title', v)} placeholder="特色功能" />
      <Input label="副標題" value={config.subtitle ?? ''} onChange={(v) => set('subtitle', v)} placeholder="（選填）" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">功能項目</label>
          <button type="button" onClick={addItem} className="text-sm text-brand-brown hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> 新增項目
          </button>
        </div>

        <div className="space-y-3">
          {config.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">項目 {i + 1}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input label="圖示名稱" value={item.icon} onChange={(v) => updateItem(i, { icon: v })} placeholder="star" />
                  <Input label="標題" value={item.title} onChange={(v) => updateItem(i, { title: v })} placeholder="功能標題" />
                </div>
                <Textarea label="說明" value={item.description} onChange={(v) => updateItem(i, { description: v })} placeholder="功能說明" rows={2} />
              </div>
            </div>
          ))}
          {config.items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">尚未新增任何項目</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonials Form ─────────────────────────────────── */

export function TestimonialsForm({
  config,
  onChange,
}: {
  config: TestimonialsConfig;
  onChange: (c: TestimonialsConfig) => void;
}) {
  const set = <K extends keyof TestimonialsConfig>(key: K, val: TestimonialsConfig[K]) =>
    onChange({ ...config, [key]: val });

  const updateItem = (index: number, partial: Partial<TestimonialItem>) => {
    const items = [...config.items];
    items[index] = { ...items[index], ...partial };
    set('items', items);
  };

  const addItem = () => {
    set('items', [...config.items, { name: '', role: '', content: '' }]);
  };

  const removeItem = (index: number) => {
    set('items', config.items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Input label="區塊標題" value={config.title} onChange={(v) => set('title', v)} placeholder="用戶見證" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">見證項目</label>
          <button type="button" onClick={addItem} className="text-sm text-brand-brown hover:underline flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" /> 新增見證
          </button>
        </div>

        <div className="space-y-3">
          {config.items.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">見證 {i + 1}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input label="姓名" value={item.name} onChange={(v) => updateItem(i, { name: v })} placeholder="王小明" />
                  <Input label="身份 / 角色" value={item.role} onChange={(v) => updateItem(i, { role: v })} placeholder="企業主管" />
                </div>
                <Textarea label="推薦內容" value={item.content} onChange={(v) => updateItem(i, { content: v })} placeholder="推薦語錄" rows={3} />
                <ImageUploadField label="頭像（選填）" value={item.avatar ?? ''} onChange={(v) => updateItem(i, { avatar: v })} />
              </div>
            </div>
          ))}
          {config.items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">尚未新增任何見證</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Config Form Router ────────────────────────────────── */

export function SectionConfigForm({
  type,
  config,
  onChange,
}: {
  type: HomeSectionType;
  config: HomeSectionConfig;
  onChange: (c: HomeSectionConfig) => void;
}) {
  switch (type) {
    case 'banner':
      return <BannerForm config={config as BannerConfig} onChange={onChange} />;
    case 'carousel':
      return <CarouselForm config={config as CarouselConfig} onChange={onChange} />;
    case 'services':
      return <ServicesForm config={config as ServicesConfig} onChange={onChange} />;
    case 'cta':
      return <CtaForm config={config as CtaConfig} onChange={onChange} />;
    case 'contact_cta':
      return <ContactCtaForm config={config as ContactCtaConfig} onChange={onChange} />;
    case 'features':
      return <FeaturesForm config={config as FeaturesConfig} onChange={onChange} />;
    case 'testimonials':
      return <TestimonialsForm config={config as TestimonialsConfig} onChange={onChange} />;
    default:
      return <p className="text-gray-500">未知的區塊類型</p>;
  }
}
