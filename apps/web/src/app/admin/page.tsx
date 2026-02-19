/**
 * @fileoverview Admin Dashboard Page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Image, Calendar, Mail, Home, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: '管理後台',
  description: '台灣健康管理 CMS 管理後台',
};

const quickLinks = [
  {
    title: '文章管理',
    description: '管理運動專欄文章',
    href: '/admin/articles',
    icon: FileText,
    count: null,
  },
  {
    title: '首頁區塊',
    description: '編輯首頁內容區塊',
    href: '/admin/home-sections',
    icon: Home,
    count: null,
  },
  {
    title: '活動管理',
    description: '管理活動花絮',
    href: '/admin/events',
    icon: Calendar,
    count: null,
  },
  {
    title: '聯絡訊息',
    description: '查看訪客留言',
    href: '/admin/contacts',
    icon: Mail,
    count: null,
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">管理後台</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold mb-1">{link.title}</h2>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold mb-4">快速操作</h2>
        <div className="space-y-3">
          <Link
            href="/admin/articles/new"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">+ 新增文章</span>
            <p className="text-sm text-gray-500">建立新的運動專欄文章</p>
          </Link>
          <Link
            href="/admin/home-sections"
            className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">編輯首頁</span>
            <p className="text-sm text-gray-500">修改首頁顯示內容</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
