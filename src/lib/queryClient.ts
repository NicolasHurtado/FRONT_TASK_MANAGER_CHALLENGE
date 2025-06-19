// Task Manager Frontend - React Query Configuration

import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TaskFilters } from '@/types';

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay that increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Show error toast on mutation error
      onError: (error: Error) => {
        const message = error?.message || 'An unexpected error occurred';
        toast.error(message);
      },
    },
  },
});

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
  // Auth queries
  auth: {
    user: ['auth', 'user'] as const,
  },
  // Task queries
  tasks: {
    all: ['tasks'] as const,
    list: (filters?: TaskFilters) => ['tasks', 'list', filters] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
    stats: ['tasks', 'stats'] as const,
  },
  // User queries
  users: {
    me: ['users', 'me'] as const,
  },
} as const;

export default queryClient; 