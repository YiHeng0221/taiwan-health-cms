/**
 * @fileoverview Tags hooks using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export const tagKeys = {
  all: ['tags'] as const,
};

/** Fetch all tags (public) */
export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: () => api.get<Tag[]>('/tags'),
  });
}

/** Create a new tag */
export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => api.post<Tag>('/tags', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

/** Update a tag */
export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.put<Tag>(`/tags/${id}`, { name }),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

/** Delete a tag */
export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tags/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}
