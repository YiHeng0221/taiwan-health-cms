/**
 * @fileoverview Admin Tags Management Page
 */

'use client';

import { useState } from 'react';
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  Tag,
} from '@/hooks/use-tags';
import {
  Tag as TagIcon,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Check,
  X,
} from 'lucide-react';

export default function AdminTagsPage() {
  const { data: tags, isLoading } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    await createTag.mutateAsync({ name: trimmed });
    setNewName('');
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setEditingName(tag.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) return;
    await updateTag.mutateAsync({ id: editingId, name: trimmed });
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`確定要刪除標籤「${tag.name}」嗎？此操作將移除所有文章與此標籤的關聯。`)) {
      return;
    }
    await deleteTag.mutateAsync(tag.id);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">標籤管理</h1>
        <p className="text-sm text-gray-500 mt-1">
          管理文章的分類標籤
        </p>
      </div>

      {/* Create new tag */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
            placeholder="輸入新標籤名稱..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim() || createTag.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow text-brand-dark font-medium rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createTag.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            新增
          </button>
        </div>
        {createTag.isError && (
          <p className="text-sm text-red-500 mt-2">
            {createTag.error?.message || '新增失敗'}
          </p>
        )}
      </div>

      {/* Tags list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !tags?.length ? (
          <div className="text-center py-12">
            <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">尚未建立任何標籤</p>
          </div>
        ) : (
          <div className="divide-y">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <TagIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />

                {editingId === tag.id ? (
                  /* Edit mode */
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-transparent outline-none text-sm"
                    />
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingName.trim() || updateTag.isPending}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="儲存"
                    >
                      {updateTag.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      title="取消"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  /* Display mode */
                  <>
                    <span
                      className="flex-1 text-sm text-gray-800 cursor-pointer hover:text-brand-dark"
                      onClick={() => handleStartEdit(tag)}
                      title="點擊編輯"
                    >
                      {tag.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {tag.slug}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(tag)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="編輯"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        disabled={deleteTag.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="刪除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error display for update/delete */}
      {updateTag.isError && (
        <p className="text-sm text-red-500 mt-3">
          更新失敗：{updateTag.error?.message}
        </p>
      )}
      {deleteTag.isError && (
        <p className="text-sm text-red-500 mt-3">
          刪除失敗：{deleteTag.error?.message}
        </p>
      )}
    </div>
  );
}
