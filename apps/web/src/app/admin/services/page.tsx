/**
 * @fileoverview Admin Services List Page
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAdminServices, useDeleteService } from '@/hooks/use-services';
import { adminPath } from '@/lib/admin-path';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

export default function AdminServicesPage() {
  const { data: services, isLoading } = useAdminServices();
  const deleteService = useDeleteService();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`確定要刪除「${title}」嗎？`)) {
      await deleteService.mutateAsync(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">服務管理</h1>
        <Link href={adminPath('/services/new')} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          新增服務
        </Link>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !services?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有服務項目</p>
            <Link href={adminPath('/services/new')} className="btn-primary mt-4 inline-flex">
              建立第一個服務
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  圖片
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  標題
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Icon
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  排序
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
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {service.image ? (
                      <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                        <Image
                          src={service.image}
                          alt={service.title}
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
                    <p className="font-medium">{service.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {service.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {service.icon}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {service.order}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {service.isActive ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={adminPath(`/services/${service.id}/edit`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="編輯"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                        title="刪除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
