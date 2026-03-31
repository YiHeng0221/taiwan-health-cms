/**
 * @fileoverview Admin Events List Page
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdminEvents, useDeleteEvent } from '@/hooks/use-events';
import { formatDate } from '@/lib/utils';
import { adminPath } from '@/lib/admin-path';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminEventsPage() {
  const { data: events, isLoading } = useAdminEvents();
  const deleteEvent = useDeleteEvent();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`確定要刪除「${title}」嗎？`)) {
      await deleteEvent.mutateAsync(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">活動管理</h1>
        <Link href={adminPath('/events/new')} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          新增活動
        </Link>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !events?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有活動</p>
            <Link href={adminPath('/events/new')} className="btn-primary mt-4 inline-flex">
              建立第一個活動
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  封面
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  標題
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  日期
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  地點
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  狀態
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => {
                const images = (event.images as string[]) || [];
                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {images[0] ? (
                        <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                          <Image
                            src={images[0]}
                            alt={event.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                          無圖
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">/events/{event.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {event.location}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {event.isPublished ? '已發布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <span className="p-2 text-gray-400">
                          {event.isPublished ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </span>
                        <Link
                          href={adminPath(`/events/${event.id}/edit`)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="編輯"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                          title="刪除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
