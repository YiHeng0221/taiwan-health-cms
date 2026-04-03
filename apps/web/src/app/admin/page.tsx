'use client';

import Link from 'next/link';
import {
  FileText,
  Calendar,
  Mail,
  Home,
  Settings,
  HelpCircle,
  Tag,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { adminPath } from '@/lib/admin-path';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

const cards = [
  {
    title: '文章管理',
    href: adminPath('/articles'),
    icon: FileText,
    statKey: 'articleCount' as const,
    subStatKey: 'publishedArticleCount' as const,
    subLabel: '已發布',
    color: 'bg-blue-500',
  },
  {
    title: '活動管理',
    href: adminPath('/events'),
    icon: Calendar,
    statKey: 'eventCount' as const,
    color: 'bg-green-500',
  },
  {
    title: '聯絡訊息',
    href: adminPath('/contacts'),
    icon: Mail,
    statKey: 'totalContactCount' as const,
    subStatKey: 'unreadContactCount' as const,
    subLabel: '未讀',
    color: 'bg-red-500',
    highlightSub: true,
  },
  {
    title: '服務項目',
    href: adminPath('/services'),
    icon: Settings,
    statKey: 'serviceCount' as const,
    color: 'bg-purple-500',
  },
  {
    title: '常見問答',
    href: adminPath('/faq'),
    icon: HelpCircle,
    statKey: 'faqCount' as const,
    color: 'bg-amber-500',
  },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-7 w-7 text-gray-700" />
        <h1 className="text-2xl font-bold">管理後台</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const count = stats?.[card.statKey];
          const subCount = card.subStatKey ? stats?.[card.subStatKey] : undefined;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-gray-300 animate-spin" />
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    {count ?? '-'}
                  </span>
                )}
              </div>
              <h2 className="font-semibold text-gray-700 text-sm">
                {card.title}
              </h2>
              {card.subStatKey && !isLoading && subCount !== undefined && (
                <p
                  className={`text-xs mt-1 ${
                    card.highlightSub && subCount > 0
                      ? 'text-red-500 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {subCount} {card.subLabel}
                </p>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4 text-gray-700">快速操作</h2>
          <div className="space-y-2">
            <Link
              href={adminPath('/articles/new')}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <span className="font-medium text-sm">新增文章</span>
                <p className="text-xs text-gray-400">建立新的運動專欄文章</p>
              </div>
            </Link>
            <Link
              href={adminPath('/events/new')}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <span className="font-medium text-sm">新增活動</span>
                <p className="text-xs text-gray-400">建立新的活動花絮</p>
              </div>
            </Link>
            <Link
              href={adminPath('/home-sections')}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="h-4 w-4 text-amber-500" />
              <div>
                <span className="font-medium text-sm">編輯首頁</span>
                <p className="text-xs text-gray-400">修改首頁顯示內容</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4 text-gray-700">系統資訊</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">文章發布率</span>
              <span className="font-medium">
                {stats && stats.articleCount > 0
                  ? `${Math.round((stats.publishedArticleCount / stats.articleCount) * 100)}%`
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">未讀訊息</span>
              <span
                className={`font-medium ${
                  stats && stats.unreadContactCount > 0
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                {stats?.unreadContactCount ?? '-'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">FAQ 數量</span>
              <span className="font-medium">{stats?.faqCount ?? '-'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">服務項目</span>
              <span className="font-medium">{stats?.serviceCount ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
