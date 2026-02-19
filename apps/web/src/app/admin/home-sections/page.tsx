/**
 * @fileoverview Admin Home Sections Page
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { HomeSection } from '@taiwan-health/shared-types';
import { Plus, Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';

export default function AdminHomeSectionsPage() {
  const queryClient = useQueryClient();

  const { data: sections, isLoading } = useQuery({
    queryKey: ['home-sections', 'admin'],
    queryFn: () => api.get<HomeSection[]>('/home-sections/admin'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/home-sections/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-sections'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除此區塊嗎？')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">首頁區塊管理</h1>
        <button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          新增區塊
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-6">
        <p className="text-sm">
          拖曳區塊可調整順序，編輯區塊可修改內容設定。
        </p>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {!sections?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有首頁區塊</p>
          </div>
        ) : (
          <div className="divide-y">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50"
              >
                <button className="cursor-grab text-gray-400 hover:text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{section.type}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      順序: {section.order}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {JSON.stringify(section.config).slice(0, 100)}...
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
