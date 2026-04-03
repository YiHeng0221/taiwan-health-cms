/**
 * @fileoverview FAQ Admin hooks using TanStack Query
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const faqKeys = {
  all: ['faq'] as const,
  admin: () => [...faqKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...faqKeys.admin(), id] as const,
};

/** Fetch all FAQs (admin) */
export function useAdminFaqs() {
  return useQuery({
    queryKey: faqKeys.admin(),
    queryFn: () => api.get<Faq[]>('/faq/admin'),
  });
}

/** Fetch single FAQ by ID (admin) */
export function useAdminFaq(id: string) {
  return useQuery({
    queryKey: faqKeys.adminDetail(id),
    queryFn: () => api.get<Faq>(`/faq/admin/${id}`),
    enabled: !!id,
  });
}

/** Create FAQ */
export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      question: string;
      answer: string;
      order?: number;
      isActive?: boolean;
    }) => api.post<Faq>('/faq', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqKeys.all }),
  });
}

/** Update FAQ */
export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      question?: string;
      answer?: string;
      order?: number;
      isActive?: boolean;
    }) => api.put<Faq>(`/faq/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqKeys.all }),
  });
}

/** Delete FAQ */
export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/faq/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqKeys.all }),
  });
}

/** Reorder FAQs */
export function useReorderFaqs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      api.patch('/faq/reorder', { orderedIds }),
    onSuccess: () => qc.invalidateQueries({ queryKey: faqKeys.all }),
  });
}
