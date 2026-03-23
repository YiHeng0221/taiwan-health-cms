/**
 * @fileoverview Admin Site Settings Page
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useSettings,
  useUpdateSettings,
  type SiteSettings,
} from '@/hooks/use-settings';
import { useUploadImage } from '@/hooks/use-upload';
import { Loader2, Save, Upload, X } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const uploadLogo = useUploadImage('settings');
  const uploadFavicon = useUploadImage('settings');

  const [form, setForm] = useState<Partial<Omit<SiteSettings, 'id'>>>({
    siteName: '',
    logo: null,
    favicon: null,
    footer: { copyright: '', links: [] },
    social: {
      facebook: { name: '', url: '' },
      instagram: { name: '', url: '' },
      line: { name: '', url: '' },
      youtube: { name: '', url: '' },
    },
    contact: { phone: '', email: '', address: '' },
  });

  const [saved, setSaved] = useState(false);

  // Populate form when data arrives
  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || '',
        logo: settings.logo,
        favicon: settings.favicon,
        footer: settings.footer || { copyright: '', links: [] },
        social: settings.social || {
          facebook: { name: '', url: '' },
          instagram: { name: '', url: '' },
          line: { name: '', url: '' },
          youtube: { name: '', url: '' },
        },
        contact: settings.contact || { phone: '', email: '', address: '' },
      });
    }
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadLogo.mutateAsync(file);
      setForm((prev) => ({ ...prev, logo: result.url }));
    } catch (err) {
      console.error('Logo upload failed:', err);
    }
    e.target.value = '';
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadFavicon.mutateAsync(file);
      setForm((prev) => ({ ...prev, favicon: result.url }));
    } catch (err) {
      console.error('Favicon upload failed:', err);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  const social = (form.social || {}) as Record<string, { name: string; url: string }>;
  const contact = (form.contact || {}) as Record<string, string>;
  const footer = (form.footer || {}) as { copyright?: string; links?: { label: string; url: string }[] };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">網站設定</h1>
        {saved && (
          <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            已儲存 ✓
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {/* Basic Info */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">基本資訊</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              網站名稱
            </label>
            <input
              type="text"
              value={form.siteName || ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, siteName: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {form.logo ? (
                <div className="relative w-40 h-16 rounded border bg-gray-50">
                  <Image
                    src={form.logo}
                    alt="Logo"
                    fill
                    className="object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, logo: null }))}
                    className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="w-40 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand-yellow hover:bg-yellow-50 transition-colors">
                  {uploadLogo.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Upload className="h-4 w-4" />
                      上傳 Logo
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Favicon
            </label>
            <div className="flex items-center gap-4">
              {form.favicon ? (
                <div className="relative w-12 h-12 rounded border bg-gray-50">
                  <Image
                    src={form.favicon}
                    alt="Favicon"
                    fill
                    className="object-contain p-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, favicon: null }))
                    }
                    className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="w-12 h-12 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand-yellow hover:bg-yellow-50 transition-colors">
                  {uploadFavicon.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  ) : (
                    <Upload className="h-4 w-4 text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFaviconUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">聯絡資訊</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話
              </label>
              <input
                type="text"
                value={contact.phone || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...contact, phone: e.target.value },
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                placeholder="02-1234-5678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    contact: { ...contact, email: e.target.value },
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                placeholder="info@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地址
            </label>
            <input
              type="text"
              value={contact.address || ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  contact: { ...contact, address: e.target.value },
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
              placeholder="台北市..."
            />
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">社群媒體</h2>

          <div className="space-y-4">
            {[
              { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
              { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
              { key: 'line', label: 'LINE', placeholder: 'https://line.me/...' },
              { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
            ].map((item) => {
              const val = social[item.key] || { name: '', url: '' };
              return (
                <div key={item.key} className="border rounded-lg p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">顯示名稱</label>
                      <input
                        type="text"
                        value={val.name || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            social: {
                              ...social,
                              [item.key]: { ...val, name: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-sm"
                        placeholder={`${item.label} 顯示名稱`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">連結網址</label>
                      <input
                        type="url"
                        value={val.url || ''}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            social: {
                              ...social,
                              [item.key]: { ...val, url: e.target.value },
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-sm"
                        placeholder={item.placeholder}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">頁尾設定</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              版權文字
            </label>
            <input
              type="text"
              value={footer.copyright || ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  footer: { ...footer, copyright: e.target.value },
                }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
              placeholder="© 2024 樂頤生健康管理. All rights reserved."
            />
          </div>
        </section>

        {/* Save button */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="btn-primary"
          >
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            儲存設定
          </button>
        </div>
      </form>
    </div>
  );
}
