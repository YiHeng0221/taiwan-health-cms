/**
 * @fileoverview Admin Header Component
 */

'use client';

import { useCurrentUser } from '@/hooks/use-auth';
import { Menu, Bell, User } from 'lucide-react';

export function AdminHeader() {
  const { data: user } = useCurrentUser();

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden p-2">
        <Menu className="h-6 w-6" />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-yellow/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-brand-yellow" />
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {user?.email || '管理員'}
          </span>
        </div>
      </div>
    </header>
  );
}
