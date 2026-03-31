/**
 * @fileoverview Admin Service Editor Component
 *
 * Shared form component for creating and editing services.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminPath } from '@/lib/admin-path';
import Image from 'next/image';
import { useCreateService, useUpdateService } from '@/hooks/use-services';
import { useUploadImage } from '@/hooks/use-upload';
import { Loader2, Upload, X, Plus } from 'lucide-react';

interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  order: number;
  isActive: boolean;
}

interface ServiceEditorProps {
  initialData?: ServiceFormData & { id: string };
}

export function ServiceEditor({ initialData }: ServiceEditorProps) {
  const router = useRouter();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const uploadImage = useUploadImage('services');

  const [form, setForm] = useState<ServiceFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    icon: initialData?.icon ?? 'activity',
    image: initialData?.image ?? '',
    features: initialData?.features ?? [''],
    order: initialData?.order ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const isEdit = !!initialData?.id;
  const isSaving = createService.isPending || updateService.isPending;

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const result = await uploadImage.mutateAsync(file);
        setForm((prev) => ({ ...prev, image: result.url }));
      } catch (err) {
        console.error('Upload failed:', err);
      }
      e.target.value = '';
    },
    [uploadImage],
  );

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      features: form.features.filter((f) => f.trim() !== ''),
      image: form.image || undefined,
    };

    try {
      if (isEdit) {
        await updateService.mutateAsync({ id: initialData!.id, ...payload });
      } else {
        await createService.mutateAsync(payload);
      }
      router.push(adminPath('/services'));
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服務標題 *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入服務標題"
        />
      </div>

      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Icon 名稱
        </label>
        <input
          type="text"
          value={form.icon}
          onChange={(e) => setForm((prev) => ({ ...prev, icon: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="lucide icon 名稱，例如：activity, heart, dumbbell"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服務描述 *
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入服務描述"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服務圖片
        </label>
        {form.image ? (
          <div className="relative w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 group mb-2">
            <Image
              src={form.image}
              alt="服務圖片"
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="w-64 aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-yellow hover:bg-yellow-50 transition-colors">
            {uploadImage.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">上傳圖片</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服務特色
        </label>
        <div className="space-y-2">
          {form.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                placeholder={`特色 ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center text-sm text-gray-500 hover:text-brand-yellow"
          >
            <Plus className="h-4 w-4 mr-1" />
            新增特色
          </button>
        </div>
      </div>

      {/* Order */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          排序
        </label>
        <input
          type="number"
          value={form.order}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
          }
          className="w-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1">數字越小排越前面</p>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          啟用此服務
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? '更新服務' : '建立服務'}
        </button>
        <button
          type="button"
          onClick={() => router.push(adminPath('/services'))}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
