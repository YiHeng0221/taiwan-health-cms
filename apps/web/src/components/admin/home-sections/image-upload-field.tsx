/**
 * @fileoverview Image Upload Field
 *
 * Reusable image upload field for admin forms.
 */

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { useUploadImage } from '@/hooks/use-upload';

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUploadField({
  value,
  onChange,
  folder = 'home-sections',
  label = '圖片',
  className = '',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage(folder);
  const [preview, setPreview] = useState(value);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const result = await upload.mutateAsync(file);
      onChange(result.url);
      setPreview(result.url);
    } catch {
      setPreview(value); // revert
    }
  };

  const handleClear = () => {
    onChange('');
    setPreview('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <Image src={preview} alt="" fill className="object-contain" />
          {upload.isPending && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-yellow flex flex-col items-center justify-center gap-2 transition-colors bg-gray-50"
        >
          <Upload className="h-6 w-6 text-gray-400" />
          <span className="text-sm text-gray-500">點擊上傳圖片</span>
        </button>
      )}

      {/* Or paste URL */}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setPreview(e.target.value);
        }}
        placeholder="或貼上圖片網址"
        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
      />
    </div>
  );
}
