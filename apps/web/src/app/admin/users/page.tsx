/**
 * @fileoverview Admin Users List Page
 */

'use client';

import { useAdminUsers } from '@/hooks/use-users';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const roleLabelMap: Record<string, string> = {
  ADMIN: '管理員',
  EDITOR: '編輯者',
};

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">用戶管理</h1>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
          </div>
        ) : !users?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">目前沒有用戶資料</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  角色
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  建立時間
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {roleLabelMap[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
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
