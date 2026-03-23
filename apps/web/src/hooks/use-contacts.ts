/**
 * @fileoverview Contact Messages Admin hooks using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ContactSubmission } from '@taiwan-health/shared-types';

export const contactKeys = {
  all: ['contacts'] as const,
  admin: () => [...contactKeys.all, 'admin'] as const,
};

/** Fetch all contact submissions (admin) */
export function useAdminContacts() {
  return useQuery({
    queryKey: contactKeys.admin(),
    queryFn: () => api.get<ContactSubmission[]>('/contact'),
  });
}

/** Mark a contact as read */
export function useMarkContactRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch<ContactSubmission>(`/contact/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}

/** Delete a contact message */
export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}
