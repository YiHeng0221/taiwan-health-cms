/**
 * @fileoverview Admin Home Sections Page with drag-and-drop reorder
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useAdminHomeSections,
  useDeleteHomeSection,
  useReorderHomeSections,
} from '@/hooks/use-home-sections';
import { HomeSection } from '@taiwan-health/shared-types';

/** Friendly labels for section types */
const TYPE_LABELS: Record<string, string> = {
  banner: '主視覺橫幅',
  carousel: '輪播相簿',
  services: '服務項目',
  cta: 'CTA 行動呼籲',
  contact_cta: '聯絡我們 CTA',
  features: '特色功能',
  testimonials: '用戶見證',
};

function getConfigSummary(config: Record<string, unknown>): string {
  if (config.title) return String(config.title);
  return JSON.stringify(config).slice(0, 80);
}

// ─── Sortable Row ────────────────────────────────────────────────

interface SortableRowProps {
  section: HomeSection;
  index: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function SortableRow({ section, index, onDelete, isDeleting }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative' as const,
  };

  const config = section.config as Record<string, unknown>;
  const isActive = (section as Record<string, unknown>).isActive !== false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border-b transition-shadow ${
        isDragging ? 'shadow-lg rounded-lg ring-2 ring-brand-yellow' : ''
      } ${!isActive ? 'opacity-50' : ''}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0 touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Order badge */}
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium flex items-center justify-center">
        {index + 1}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-brand-dark">
            {TYPE_LABELS[section.type] || section.type}
          </span>
          {!isActive && (
            <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
              已隱藏
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5 truncate">
          {getConfigSummary(config)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Link
          href={`/admin/home-sections/${section.id}/edit`}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="編輯"
        >
          <Edit className="h-4 w-4 text-gray-600" />
        </Link>
        <button
          onClick={() => onDelete(section.id)}
          disabled={isDeleting}
          className="p-2 hover:bg-red-50 rounded-lg"
          title="刪除"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function AdminHomeSectionsPage() {
  const { data: sections, isLoading } = useAdminHomeSections();
  const deleteMutation = useDeleteHomeSection();
  const reorderMutation = useReorderHomeSections();

  // Local state for optimistic drag reorder
  const [items, setItems] = useState<HomeSection[]>([]);

  useEffect(() => {
    if (sections) setItems(sections);
  }, [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((s) => s.id === active.id);
    const newIndex = items.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    // Optimistic update
    setItems(reordered);

    // Persist to backend
    reorderMutation.mutate(reordered.map((s) => s.id));
  };

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此區塊嗎？')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">首頁區塊管理</h1>
        <Link
          href="/admin/home-sections/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-dark font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          新增區塊
        </Link>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
        <p className="text-sm">
          拖拽左側 <GripVertical className="inline h-4 w-4" /> 把手可調整區塊顯示順序，順序會自動儲存。
        </p>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {!items.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">目前沒有首頁區塊</p>
            <Link
              href="/admin/home-sections/new"
              className="text-brand-brown hover:underline text-sm"
            >
              + 新增第一個區塊
            </Link>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((section, index) => (
                <SortableRow
                  key={section.id}
                  section={section}
                  index={index}
                  onDelete={handleDelete}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Saving indicator */}
      {reorderMutation.isPending && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          排序儲存中…
        </div>
      )}
    </div>
  );
}
