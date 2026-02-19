/**
 * @fileoverview Home Sections API hooks
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { HomeSection } from '@taiwan-health/shared-types';

export function useHomeSections() {
  return useQuery({
    queryKey: ['home-sections'],
    queryFn: () => api.get<HomeSection[]>('/home-sections'),
  });
}
