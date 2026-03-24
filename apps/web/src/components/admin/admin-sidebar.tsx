/**
 * @fileoverview Admin Sidebar Component
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Home,
  Calendar,
  Mail,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/use-auth';
import { adminPath } from '@/lib/admin-path';

const navigation = [
  { name: '儀表板', href: adminPath(), icon: LayoutDashboard },
  { name: '文章管理', href: adminPath('/articles'), icon: FileText },
  { name: '首頁區塊', href: adminPath('/home-sections'), icon: Home },
  { name: '活動管理', href: adminPath('/events'), icon: Calendar },
  { name: '聯絡訊息', href: adminPath('/contacts'), icon: Mail },
  { name: '網站設定', href: adminPath('/settings'), icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = adminPath('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href={adminPath()} className="text-xl font-bold">
          樂頤生健康管理
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== adminPath() && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-brand-yellow text-brand-dark'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>登出</span>
        </button>
      </div>
    </aside>
  );
}
