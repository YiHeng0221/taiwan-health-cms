/**
 * @fileoverview Services hooks using TanStack Query
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ServiceEntity, PaginatedResponse } from '@taiwan-health/shared-types';

export const serviceKeys = {
  all: ['services'] as const,
  public: () => [...serviceKeys.all, 'public'] as const,
  admin: () => [...serviceKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...serviceKeys.admin(), id] as const,
};

/** Fetch active services (public) */
export function useServices() {
  return useQuery<ServiceEntity[]>({
    queryKey: serviceKeys.public(),
    queryFn: () => api.get<ServiceEntity[]>('/services'),
  });
}

/** Fetch all services (admin) */
export function useAdminServices() {
  return useQuery({
    queryKey: serviceKeys.admin(),
    queryFn: () =>
      api
        .get<PaginatedResponse<ServiceEntity>>('/services/admin')
        .then((res) => res.items),
  });
}

/** Fetch single service by ID (admin) */
export function useAdminService(id: string) {
  return useQuery({
    queryKey: serviceKeys.adminDetail(id),
    queryFn: () => api.get<ServiceEntity>(`/services/admin/${id}`),
    enabled: !!id,
  });
}

/** Create service */
export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      icon?: string;
      image?: string;
      features?: string[];
      order?: number;
      isActive?: boolean;
    }) => api.post<ServiceEntity>('/services/admin', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}

/** Update service */
export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      description?: string;
      icon?: string;
      image?: string;
      features?: string[];
      order?: number;
      isActive?: boolean;
    }) => api.put<ServiceEntity>(`/services/admin/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}

/** Delete service */
export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/services/admin/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  });
}
