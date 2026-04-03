'use client';

import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export function LineFloatButton() {
  return (
    <a
      href={COMPANY_INFO.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LINE 諮詢"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#06C755] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">LINE 諮詢</span>
    </a>
  );
}
