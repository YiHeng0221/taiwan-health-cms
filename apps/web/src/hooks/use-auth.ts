/**
 * @fileoverview Auth API hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User, LoginDto } from '@taiwan-health/shared-types';

export const authKeys = {
  user: ['auth', 'user'] as const,
};

interface LoginResponse {
  user: User;
  message: string;
}

/**
 * Get current authenticated user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => api.get<{ user: User }>('/auth/me').then((res) => res.user),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) =>
      api.post<LoginResponse>('/auth/login', credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      queryClient.clear();
    },
  });
}
