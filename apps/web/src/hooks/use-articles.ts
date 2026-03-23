/**
 * @fileoverview Article API hooks using TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  Article,
  ArticleListItem,
  PaginatedResponse,
  CreateArticleDto,
  UpdateArticleDto,
} from '@taiwan-health/shared-types';

// Query keys for cache management
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  admin: () => [...articleKeys.all, 'admin'] as const,
  adminList: (filters: Record<string, unknown>) => [...articleKeys.admin(), filters] as const,
};

interface ArticleListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

/**
 * Fetch published articles (public)
 */
export function useArticles(params: ArticleListParams = {}) {
  return useQuery({
    queryKey: articleKeys.list(params as Record<string, unknown>),
    queryFn: () =>
      api.get<PaginatedResponse<ArticleListItem>>('/articles', params as Record<string, string | number | boolean | undefined>),
  });
}

/**
 * Fetch single article by slug (public)
 */
export function useArticle(slug: string) {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: () => api.get<Article>(`/articles/slug/${slug}`),
    enabled: !!slug,
  });
}

/**
 * Fetch all articles for admin (includes unpublished)
 */
export function useAdminArticles(params: ArticleListParams & { isPublished?: boolean } = {}) {
  return useQuery({
    queryKey: articleKeys.adminList(params as Record<string, unknown>),
    queryFn: () =>
      api.get<PaginatedResponse<ArticleListItem>>('/articles/admin', params as Record<string, string | number | boolean | undefined>),
  });
}

/**
 * Fetch article by ID for editing
 */
export function useAdminArticle(id: string) {
  return useQuery({
    queryKey: ['articles', 'admin', id],
    queryFn: () => api.get<Article>(`/articles/admin/${id}`),
    enabled: !!id,
  });
}

/**
 * Create new article
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleDto) =>
      api.post<Article>('/articles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

/**
 * Update article
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleDto }) =>
      api.put<Article>(`/articles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

/**
 * Delete article
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}

/**
 * Toggle article publish status
 */
export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.patch<Article>(`/articles/${id}/publish`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.all });
    },
  });
}
