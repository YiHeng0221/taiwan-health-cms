'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useSettings,
  useUpdateSettings,
  AboutPageConfig,
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
  Heart,
  Award,
  Target,
  Users,
} from 'lucide-react';

const defaultConfig: AboutPageConfig = {
  heroTitle: '關於樂頤生健康管理',
  heroDescription:
    '樂頤生健康管理致力於用運動改變生活，協助大眾建立正確的運動觀念與健康生活習慣。',
  heroImage: '',
  mission:
    '透過專業、科學的健康管理服務，協助每一位客戶達成最佳健康狀態，提升生活品質，實現健康長壽的目標。',
  vision:
    '成為台灣最受信賴的健康管理品牌，引領預防醫學的發展，讓每個人都能擁有健康、快樂的人生。',
  values: [
    { title: '關懷', description: '以客戶健康為核心，提供貼心的服務體驗' },
    { title: '專業', description: '匯集各領域專家，確保服務品質' },
    { title: '目標導向', description: '協助客戶設定並達成健康目標' },
    { title: '團隊合作', description: '跨領域團隊協作，提供整合性服務' },
  ],
};

const valueIcons = [Heart, Award, Target, Users];

export default function AdminAboutPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const uploadImage = useUploadImage('settings');

  const [config, setConfig] = useState<AboutPageConfig>(defaultConfig);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.aboutPage) {
      setConfig({ ...defaultConfig, ...settings.aboutPage });
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings.mutateAsync({ aboutPage: config as any });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage.mutateAsync(file);
    setConfig((prev) => ({ ...prev, heroImage: result.url }));
  };

  const updateValue = (
    index: number,
    field: 'title' | 'description',
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      values: prev.values.map((v, i) =>
        i === index ? { ...v, [field]: value } : v,
      ),
    }));
  };

  const addValue = () => {
    setConfig((prev) => ({
      ...prev,
      values: [...prev.values, { title: '', description: '' }],
    }));
  };

  const removeValue = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
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
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
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
        /* ========== PREVIEW MODE ========== */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">{config.heroTitle}</h1>
                <p className="text-gray-600 whitespace-pre-line">
                  {config.heroDescription}
                </p>
              </div>
              <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100">
                {config.heroImage ? (
                  <Image
                    src={config.heroImage}
                    alt={config.heroTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    尚未上傳圖片
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-gray-50 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-3 text-brand-brown">
                  使命
                </h2>
                <p className="text-gray-600">{config.mission}</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold mb-3 text-brand-brown">
                  願景
                </h2>
                <p className="text-gray-600">{config.vision}</p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-center mb-8">核心價值</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {config.values.map((value, i) => {
                const Icon = valueIcons[i % valueIcons.length];
                return (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-7 w-7 text-brand-yellow" />
                    </div>
                    <h3 className="font-semibold mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ========== EDIT MODE ========== */
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">主視覺區</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  標題
                </label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      heroTitle: e.target.value,
                    }))
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <textarea
                  value={config.heroDescription}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      heroDescription: e.target.value,
                    }))
                  }
                  rows={4}
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  形象圖片
                </label>
                <div className="flex items-start gap-4">
                  {config.heroImage ? (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={config.heroImage}
                        alt="Hero"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, heroImage: '' }))
                        }
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null}
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {uploadImage.isPending ? '上傳中...' : '上傳圖片'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadImage.isPending}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold mb-4">使命與願景</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  使命
                </label>
                <textarea
                  value={config.mission}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      mission: e.target.value,
                    }))
                  }
                  rows={3}
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  願景
                </label>
                <textarea
                  value={config.vision}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, vision: e.target.value }))
                  }
                  rows={3}
                  className="input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">核心價值</h2>
              <button
                onClick={addValue}
                className="text-sm text-brand-yellow hover:underline flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                新增
              </button>
            </div>
            <div className="space-y-3">
              {config.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={value.title}
                      onChange={(e) =>
                        updateValue(index, 'title', e.target.value)
                      }
                      placeholder="標題"
                      className="input"
                    />
                    <input
                      type="text"
                      value={value.description}
                      onChange={(e) =>
                        updateValue(index, 'description', e.target.value)
                      }
                      placeholder="描述"
                      className="input"
                    />
                  </div>
                  <button
                    onClick={() => removeValue(index)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
