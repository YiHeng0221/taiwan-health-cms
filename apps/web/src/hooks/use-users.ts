/**
 * @fileoverview Users hooks using TanStack Query
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@taiwan-health/shared-types';

export const userKeys = {
  all: ['users'] as const,
};

/** Fetch all users (admin) */
export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => api.get<User[]>('/users'),
  });
}
