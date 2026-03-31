/**
 * @fileoverview Admin Event Editor Component
 *
 * Shared form component for creating and editing events.
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminPath } from '@/lib/admin-path';
import Image from 'next/image';
import { useCreateEvent, useUpdateEvent } from '@/hooks/use-events';
import { useUploadImage } from '@/hooks/use-upload';
import { Loader2, Upload, X } from 'lucide-react';

interface EventFormData {
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  images: string[];
  isPublished: boolean;
}

interface EventEditorProps {
  initialData?: EventFormData & { id: string };
}

export function EventEditor({ initialData }: EventEditorProps) {
  const router = useRouter();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const uploadImage = useUploadImage('events');
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<EventFormData>({
    title: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    date: initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 10)
      : '',
    location: initialData?.location ?? '',
    images: initialData?.images ?? [],
    isPublished: initialData?.isPublished ?? false,
  });

  const isEdit = !!initialData?.id;
  const isSaving = createEvent.isPending || updateEvent.isPending;

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: !isEdit ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      for (const file of Array.from(files)) {
        try {
          const result = await uploadImage.mutateAsync(file);
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, result.url],
          }));
        } catch {
          setError('照片上傳失敗，請稍後再試');
        }
      }
      // Reset file input
      e.target.value = '';
    },
    [uploadImage],
  );

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEdit) {
        await updateEvent.mutateAsync({
          id: initialData!.id,
          ...form,
        });
      } else {
        await createEvent.mutateAsync(form);
      }
      router.push(adminPath('/events'));
    } catch {
      setError('儲存失敗，請稍後再試');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          活動標題 *
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入活動標題"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          網址代稱 (slug)
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="auto-generated-from-title"
        />
      </div>

      {/* Date & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            活動日期 *
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            活動地點 *
          </label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
            placeholder="輸入活動地點"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          活動描述 *
        </label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
          placeholder="輸入活動描述"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          活動照片
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {form.images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group"
            >
              <Image
                src={url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-contain"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {/* Upload button */}
          <label className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-yellow hover:bg-yellow-50 transition-colors">
            {uploadImage.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">上傳照片</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublished"
          checked={form.isPublished}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isPublished: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
          立即發布
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {isEdit ? '更新活動' : '建立活動'}
        </button>
        <button
          type="button"
          onClick={() => router.push(adminPath('/events'))}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
