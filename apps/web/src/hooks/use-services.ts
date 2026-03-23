/**
 * @fileoverview Services data hook
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ServiceEntity } from '@taiwan-health/shared-types';

export function useServices() {
  return useQuery<ServiceEntity[]>({
    queryKey: ['services'],
    queryFn: () => api.get<ServiceEntity[]>('/services'),
  });
}
