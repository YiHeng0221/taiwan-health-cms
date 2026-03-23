/**
 * @fileoverview Section Editor
 *
 * Full editor for creating / editing a home section.
 * Step 1: Select a section type (with visual preview)
 * Step 2: Fill in the section config form
 * The user can change the type at any time.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeSectionType,
  HomeSectionConfig,
  HomeSection,
} from '@taiwan-health/shared-types';
import { Loader2, ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { SectionTypeSelector } from './section-type-selector';
import { SectionConfigForm, getDefaultConfig } from './section-config-forms';
import {
  useCreateHomeSection,
  useUpdateHomeSection,
} from '@/hooks/use-home-sections';

interface Props {
  /** If provided, we are editing; otherwise creating. */
  section?: HomeSection;
}

export function SectionEditor({ section }: Props) {
  const router = useRouter();
  const isEditing = !!section;

  const [type, setType] = useState<HomeSectionType | null>(
    section?.type ?? null,
  );
  const [config, setConfig] = useState<HomeSectionConfig | null>(
    section?.config ?? null,
  );
  const [isActive, setIsActive] = useState(true);

  // When editing, initialize isActive from existing section
  useEffect(() => {
    if (section && 'isActive' in section) {
      setIsActive((section as HomeSection & { isActive?: boolean }).isActive ?? true);
    }
  }, [section]);

  const createMutation = useCreateHomeSection();
  const updateMutation = useUpdateHomeSection();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  /** Switching type resets the config unless it's the same type */
  const handleTypeChange = (newType: HomeSectionType) => {
    if (newType === type) return;
    setType(newType);
    setConfig(getDefaultConfig(newType));
  };

  /** Save */
  const handleSave = async () => {
    if (!type || !config) return;

    try {
      if (isEditing && section) {
        await updateMutation.mutateAsync({
          id: section.id,
          type,
          config,
          isActive,
        });
      } else {
        await createMutation.mutateAsync({
          type,
          config,
          isActive,
        });
      }
      router.push('/admin/home-sections');
    } catch (err) {
      // error handled by mutation
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/home-sections')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {isEditing ? '編輯區塊' : '新增區塊'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Active toggle */}
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {isActive ? '啟用中' : '已隱藏'}
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!type || !config || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-dark font-semibold rounded-lg hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            儲存
          </button>
        </div>
      </div>

      {/* Error messages */}
      {(createMutation.error || updateMutation.error) && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {(createMutation.error || updateMutation.error)?.message || '儲存失敗'}
        </div>
      )}

      {/* Step 1: Type Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">選擇版型</h2>
        <SectionTypeSelector value={type} onChange={handleTypeChange} />
      </div>

      {/* Step 2: Config Form */}
      {type && config && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">區塊內容設定</h2>
          <SectionConfigForm type={type} config={config} onChange={setConfig} />
        </div>
      )}
    </div>
  );
}
