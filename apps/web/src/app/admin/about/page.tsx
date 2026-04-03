'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useSettings,
  useUpdateSettings,
  AboutPageConfig,
  AboutSection,
  HeroSectionConfig,
  CardsSectionConfig,
  IconGridSectionConfig,
  TextSectionConfig,
} from '@/hooks/use-settings';
import { useUploadImage } from '@/hooks/use-upload';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import { ICON_OPTIONS, getIcon } from './icon-picker';

// ─── Default data ───────────────────────────────────────
const defaultSections: AboutSection[] = [
  {
    id: 's1',
    type: 'hero',
    config: {
      title: '關於樂頤生健康管理',
      description:
        '樂頤生健康管理致力於用運動改變生活，協助大眾建立正確的運動觀念與健康生活習慣。\n\n我們相信，健康不僅是沒有疾病，更是身心靈的完整平衡。透過專業的運動指導、個人化的健康計畫，以及持續的追蹤服務，我們陪伴每一位客戶走向更健康、更有活力的生活。',
      image: '',
      imagePosition: 'center' as const,
    },
  },
  {
    id: 's2',
    type: 'cards',
    config: {
      title: '使命與願景',
      bgColor: 'gray' as const,
      items: [
        {
          title: '使命',
          description:
            '透過專業、科學的健康管理服務，協助每一位客戶達成最佳健康狀態，提升生活品質，實現健康長壽的目標。',
        },
        {
          title: '願景',
          description:
            '成為台灣最受信賴的健康管理品牌，引領預防醫學的發展，讓每個人都能擁有健康、快樂的人生。',
        },
      ],
    },
  },
  {
    id: 's3',
    type: 'icon-grid',
    config: {
      title: '核心價值',
      columns: 4 as const,
      items: [
        { icon: 'heart', title: '關懷', description: '以客戶健康為核心，提供貼心的服務體驗' },
        { icon: 'award', title: '專業', description: '匯集各領域專家，確保服務品質' },
        { icon: 'target', title: '目標導向', description: '協助客戶設定並達成健康目標' },
        { icon: 'users', title: '團隊合作', description: '跨領域團隊協作，提供整合性服務' },
      ],
    },
  },
];

const SECTION_TYPE_LABELS: Record<AboutSection['type'], string> = {
  hero: '主視覺區',
  cards: '卡片列',
  'icon-grid': '圖標網格',
  text: '文字區塊',
};

function newId() {
  return `s${Date.now()}`;
}

// ─── Section editors ────────────────────────────────────

function HeroEditor({
  config,
  onChange,
}: {
  config: HeroSectionConfig;
  onChange: (c: HeroSectionConfig) => void;
}) {
  const uploadImage = useUploadImage('settings');
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage.mutateAsync(file);
    onChange({ ...config, image: result.url });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">標題</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <textarea
          value={config.description}
          onChange={(e) => onChange({ ...config, description: e.target.value })}
          rows={4}
          className="input resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">圖片</label>
        <div className="flex items-start gap-4">
          {config.image && (
            <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={config.image}
                alt="Hero"
                fill
                className="object-cover"
                style={{ objectPosition: config.imagePosition || 'center' }}
              />
              <button
                onClick={() => onChange({ ...config, image: '' })}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {uploadImage.isPending ? '上傳中...' : '上傳圖片'}
            </span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>
      {config.image && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">圖片顯示位置</label>
          <select
            value={config.imagePosition || 'center'}
            onChange={(e) =>
              onChange({ ...config, imagePosition: e.target.value as 'top' | 'center' | 'bottom' })
            }
            className="input w-auto"
          >
            <option value="top">頂部</option>
            <option value="center">中央</option>
            <option value="bottom">底部</option>
          </select>
        </div>
      )}
    </div>
  );
}

function CardsEditor({
  config,
  onChange,
}: {
  config: CardsSectionConfig;
  onChange: (c: CardsSectionConfig) => void;
}) {
  const updateItem = (i: number, field: string, val: string) =>
    onChange({
      ...config,
      items: config.items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">區塊標題</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">背景色</label>
        <select
          value={config.bgColor || 'white'}
          onChange={(e) => onChange({ ...config, bgColor: e.target.value as 'white' | 'gray' })}
          className="input w-auto"
        >
          <option value="white">白色</option>
          <option value="gray">灰色</option>
        </select>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">卡片</label>
          <button
            onClick={() =>
              onChange({ ...config, items: [...config.items, { title: '', description: '' }] })
            }
            className="text-sm text-brand-yellow hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> 新增
          </button>
        </div>
        {config.items.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(i, 'title', e.target.value)}
              placeholder="標題"
              className="input w-1/3"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
              placeholder="內容"
              className="input flex-1"
            />
            <button
              onClick={() => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) })}
              className="p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function IconGridEditor({
  config,
  onChange,
}: {
  config: IconGridSectionConfig;
  onChange: (c: IconGridSectionConfig) => void;
}) {
  const updateItem = (i: number, field: string, val: string | number) =>
    onChange({
      ...config,
      items: config.items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">區塊標題</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => onChange({ ...config, title: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">每列數量</label>
          <select
            value={config.columns || 4}
            onChange={(e) => onChange({ ...config, columns: Number(e.target.value) as 2 | 3 | 4 })}
            className="input"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">項目</label>
          <button
            onClick={() =>
              onChange({
                ...config,
                items: [...config.items, { icon: 'star', title: '', description: '' }],
              })
            }
            className="text-sm text-brand-yellow hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> 新增
          </button>
        </div>
        {config.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 mb-2 p-3 border rounded-lg">
            <div className="w-24 shrink-0">
              <label className="block text-xs text-gray-500 mb-1">圖標</label>
              <select
                value={item.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
                className="input text-sm py-1"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
                placeholder="標題"
                className="input mb-1"
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
                placeholder="描述"
                className="input"
              />
            </div>
            <button
              onClick={() => onChange({ ...config, items: config.items.filter((_, idx) => idx !== i) })}
              className="p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextEditor({
  config,
  onChange,
}: {
  config: TextSectionConfig;
  onChange: (c: TextSectionConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">區塊標題</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className="input"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">內容</label>
        <textarea
          value={config.content}
          onChange={(e) => onChange({ ...config, content: e.target.value })}
          rows={6}
          className="input resize-none"
        />
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────

export default function AdminAboutPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [sections, setSections] = useState<AboutSection[]>(defaultSections);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.aboutPage?.sections) {
      setSections(settings.aboutPage.sections);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings.mutateAsync({ aboutPage: { sections } as any });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSection = (id: string, config: any) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, config } : s)));
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeSection = (id: string) => {
    if (!confirm('確定要刪除此區塊？')) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const addSection = (type: AboutSection['type']) => {
    const id = newId();
    let config: any;
    switch (type) {
      case 'hero':
        config = { title: '', description: '', image: '', imagePosition: 'center' };
        break;
      case 'cards':
        config = { title: '', bgColor: 'white', items: [{ title: '', description: '' }] };
        break;
      case 'icon-grid':
        config = {
          title: '',
          columns: 4,
          items: [{ icon: 'star', title: '', description: '' }],
        };
        break;
      case 'text':
        config = { title: '', content: '' };
        break;
    }
    setSections((prev) => [...prev, { id, type, config }]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">關於我們</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-outline flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? '編輯模式' : '預覽'}
          </button>
          <button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? '已儲存！' : '儲存'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <AboutPreview sections={sections} />
      ) : (
        <>
          {/* Section list */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="bg-white rounded-xl shadow-sm">
                {/* Section header */}
                <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {SECTION_TYPE_LABELS[section.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveSection(index, 1)}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeSection(section.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Section editor */}
                <div className="p-6">
                  {section.type === 'hero' && (
                    <HeroEditor
                      config={section.config as HeroSectionConfig}
                      onChange={(c) => updateSection(section.id, c)}
                    />
                  )}
                  {section.type === 'cards' && (
                    <CardsEditor
                      config={section.config as CardsSectionConfig}
                      onChange={(c) => updateSection(section.id, c)}
                    />
                  )}
                  {section.type === 'icon-grid' && (
                    <IconGridEditor
                      config={section.config as IconGridSectionConfig}
                      onChange={(c) => updateSection(section.id, c)}
                    />
                  )}
                  {section.type === 'text' && (
                    <TextEditor
                      config={section.config as TextSectionConfig}
                      onChange={(c) => updateSection(section.id, c)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add section buttons */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 mb-3">新增區塊</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SECTION_TYPE_LABELS) as AboutSection['type'][]).map((type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  {SECTION_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Preview component ──────────────────────────────────

function AboutPreview({ sections }: { sections: AboutSection[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {sections.map((section) => {
        switch (section.type) {
          case 'hero': {
            const c = section.config as HeroSectionConfig;
            return (
              <div key={section.id} className="p-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h1 className="text-3xl font-bold mb-4">{c.title}</h1>
                    <p className="text-gray-600 whitespace-pre-line">{c.description}</p>
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        className="object-cover"
                        style={{ objectPosition: c.imagePosition || 'center' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        尚未上傳圖片
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          case 'cards': {
            const c = section.config as CardsSectionConfig;
            return (
              <div
                key={section.id}
                className={`p-8 ${c.bgColor === 'gray' ? 'bg-gray-50' : ''}`}
              >
                {c.title && <h2 className="text-xl font-bold text-center mb-6">{c.title}</h2>}
                <div className="grid md:grid-cols-2 gap-8">
                  {c.items.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold mb-3 text-brand-brown">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          case 'icon-grid': {
            const c = section.config as IconGridSectionConfig;
            const cols = c.columns || 4;
            return (
              <div key={section.id} className="p-8">
                {c.title && (
                  <h2 className="text-xl font-bold text-center mb-8">{c.title}</h2>
                )}
                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(cols, c.items.length)}, minmax(0, 1fr))`,
                  }}
                >
                  {c.items.map((item, i) => {
                    const Icon = getIcon(item.icon);
                    return (
                      <div key={i} className="text-center">
                        <div className="w-14 h-14 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className="h-7 w-7 text-brand-yellow" />
                        </div>
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
          case 'text': {
            const c = section.config as TextSectionConfig;
            return (
              <div key={section.id} className="p-8">
                {c.title && <h2 className="text-xl font-bold mb-4">{c.title}</h2>}
                <p className="text-gray-600 whitespace-pre-line">{c.content}</p>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
