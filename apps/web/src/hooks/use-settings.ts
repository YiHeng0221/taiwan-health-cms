/**
 * @fileoverview Site Settings hooks using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface SiteSettings {
  id: string;
  siteName: string;
  logo: string | null;
  favicon: string | null;
  footer: {
    copyright?: string;
    links?: { label: string; url: string }[];
  } | null;
  social: {
    facebook?: { name: string; url: string };
    instagram?: { name: string; url: string };
    line?: { name: string; url: string };
    youtube?: { name: string; url: string };
  } | null;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  } | null;
  aboutPage: AboutPageConfig | null;
}

export interface AboutPageConfig {
  heroTitle: string;
  heroDescription: string;
  heroImage?: string;
  mission: string;
  vision: string;
  values: { title: string; description: string }[];
}

export const settingsKeys = {
  all: ['settings'] as const,
};

/** Fetch site settings */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: () => api.get<SiteSettings>('/settings'),
  });
}

/** Update site settings */
export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<SiteSettings, 'id'>>) =>
      api.put<SiteSettings>('/settings', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingsKeys.all }),
  });
}
