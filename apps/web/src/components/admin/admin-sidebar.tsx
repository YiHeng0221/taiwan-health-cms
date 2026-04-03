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
  X,
  Briefcase,
  Users,
  Tag,
  HelpCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/use-auth';
import { adminPath } from '@/lib/admin-path';
import { useSidebarStore } from '@/stores/sidebar-store';

const navigation = [
  { name: '儀表板', href: adminPath(), icon: LayoutDashboard },
  { name: '文章管理', href: adminPath('/articles'), icon: FileText },
  { name: '標籤管理', href: adminPath('/tags'), icon: Tag },
  { name: '首頁區塊', href: adminPath('/home-sections'), icon: Home },
  { name: '活動管理', href: adminPath('/events'), icon: Calendar },
  { name: '服務管理', href: adminPath('/services'), icon: Briefcase },
  { name: '常見問題', href: adminPath('/faq'), icon: HelpCircle },
  { name: '聯絡訊息', href: adminPath('/contacts'), icon: Mail },
  { name: '關於我們', href: adminPath('/about'), icon: Info },
  { name: '用戶管理', href: adminPath('/users'), icon: Users },
  { name: '網站設定', href: adminPath('/settings'), icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { isOpen, close } = useSidebarStore();

  const handleLogout = async () => {
    await logout.mutateAsync();
    window.location.href = adminPath('/login');
  };

  return (
    <>
      {/* Backdrop for mobile/tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo + close button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <Link href={adminPath()} className="text-xl font-bold" onClick={close}>
            樂頤生健康管理
          </Link>
          <button
            onClick={close}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
            aria-label="關閉側邊選單"
          >
            <X className="h-5 w-5" />
          </button>
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
                onClick={close}
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
    </>
  );
}
