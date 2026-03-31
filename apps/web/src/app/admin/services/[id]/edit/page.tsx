/**
 * @fileoverview Admin Edit Service Page
 */

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAdminService } from '@/hooks/use-services';
import { ServiceEditor } from '@/components/admin/service-editor';
import { adminPath } from '@/lib/admin-path';

export default function EditServicePage() {
  const params = useParams();
  const id = params.id as string;
  const { data: service, isLoading } = useAdminService(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">找不到此服務</p>
        <Link href={adminPath('/services')} className="btn-primary mt-4 inline-flex">
          返回服務列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={adminPath('/services')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回服務列表
        </Link>
        <h1 className="text-2xl font-bold">編輯服務</h1>
      </div>

      <ServiceEditor
        initialData={{
          id: service.id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          image: service.image ?? '',
          features: service.features,
          order: service.order,
          isActive: service.isActive,
        }}
      />
    </div>
  );
}
