/**
 * @fileoverview Events Admin hooks using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Event } from '@taiwan-health/shared-types';

export const eventKeys = {
  all: ['events'] as const,
  published: () => [...eventKeys.all, 'published'] as const,
  admin: () => [...eventKeys.all, 'admin'] as const,
  adminDetail: (id: string) => [...eventKeys.admin(), id] as const,
};

/** Fetch published events (public) */
export function usePublicEvents() {
  return useQuery({
    queryKey: eventKeys.published(),
    queryFn: () => api.get<Event[]>('/events'),
  });
}

/** Fetch all events (admin) */
export function useAdminEvents() {
  return useQuery({
    queryKey: eventKeys.admin(),
    queryFn: () => api.get<Event[]>('/events/admin'),
  });
}

/** Fetch single event by ID (admin) */
export function useAdminEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.adminDetail(id),
    queryFn: () => api.get<Event>(`/events/admin/${id}`),
    enabled: !!id,
  });
}

/** Create event */
export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      slug: string;
      description: string;
      date: string;
      location: string;
      images?: string[];
      isPublished?: boolean;
    }) => api.post<Event>('/events', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

/** Update event */
export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      slug?: string;
      description?: string;
      date?: string;
      location?: string;
      images?: string[];
      isPublished?: boolean;
    }) => api.put<Event>(`/events/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

/** Delete event */
export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: eventKeys.all }),
  });
}
