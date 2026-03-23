/**
 * @fileoverview Home Sections API hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { HomeSection, HomeSectionType, HomeSectionConfig } from '@taiwan-health/shared-types';

export function useHomeSections() {
  return useQuery({
    queryKey: ['home-sections'],
    queryFn: () => api.get<HomeSection[]>('/home-sections'),
  });
}

export function useAdminHomeSections() {
  return useQuery({
    queryKey: ['home-sections', 'admin'],
    queryFn: () => api.get<HomeSection[]>('/home-sections/admin'),
  });
}

export function useHomeSection(id: string) {
  return useQuery({
    queryKey: ['home-sections', id],
    queryFn: () => api.get<HomeSection>(`/home-sections/admin/${id}`),
    enabled: !!id,
  });
}

export function useCreateHomeSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      type: HomeSectionType;
      config: HomeSectionConfig;
      order?: number;
      isActive?: boolean;
    }) => api.post<HomeSection>('/home-sections', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['home-sections'] }),
  });
}

export function useUpdateHomeSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      type?: HomeSectionType;
      config?: HomeSectionConfig;
      order?: number;
      isActive?: boolean;
    }) => api.put<HomeSection>(`/home-sections/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['home-sections'] }),
  });
}

export function useDeleteHomeSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/home-sections/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['home-sections'] }),
  });
}

export function useReorderHomeSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.patch<HomeSection[]>('/home-sections/reorder', { orderedIds }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['home-sections'] }),
  });
}
