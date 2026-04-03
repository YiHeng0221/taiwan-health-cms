'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PaginatedResponse } from '@taiwan-health/shared-types';

interface DashboardStats {
  articleCount: number;
  publishedArticleCount: number;
  eventCount: number;
  unreadContactCount: number;
  totalContactCount: number;
  serviceCount: number;
  faqCount: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const [articles, publishedArticles, events, contacts, services, faqs] =
        await Promise.all([
          api.get<PaginatedResponse<unknown>>('/articles/admin', {
            page: 1,
            pageSize: 1,
          }),
          api.get<PaginatedResponse<unknown>>('/articles/admin', {
            page: 1,
            pageSize: 1,
            isPublished: true,
          }),
          api.get<PaginatedResponse<unknown>>('/events/admin', {
            page: 1,
            pageSize: 1,
          }),
          api.get<PaginatedResponse<unknown>>('/contact', {
            page: 1,
            pageSize: 1,
          }),
          api.get<PaginatedResponse<unknown>>('/services/admin', {
            page: 1,
            pageSize: 1,
          }),
          api.get<unknown[]>('/faq/admin'),
        ]);

      // Count unread contacts from full list
      const allContacts = await api.get<
        PaginatedResponse<{ isRead: boolean }>
      >('/contact', { page: 1, pageSize: 100 });
      const unreadCount = (allContacts.items || []).filter(
        (c) => !c.isRead,
      ).length;

      return {
        articleCount: articles.total ?? 0,
        publishedArticleCount: publishedArticles.total ?? 0,
        eventCount: events.total ?? 0,
        unreadContactCount: unreadCount,
        totalContactCount: allContacts.total ?? 0,
        serviceCount: services.total ?? 0,
        faqCount: Array.isArray(faqs) ? faqs.length : 0,
      };
    },
    refetchInterval: 30000,
  });
}
