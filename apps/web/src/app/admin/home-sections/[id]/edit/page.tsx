/**
 * @fileoverview Admin - Edit Home Section Page
 */

'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SectionEditor } from '@/components/admin/home-sections/section-editor';
import { useHomeSection } from '@/hooks/use-home-sections';

export default function EditHomeSectionPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: section, isLoading, error } = useHomeSection(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (error || !section) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">載入區塊資料失敗</p>
      </div>
    );
  }

  return <SectionEditor section={section} />;
}
