// Task Manager Frontend - Auth Hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import React from 'react';

import authService from '@/services/authService';
import { queryKeys } from '@/lib/queryClient';
import { LoginFormData } from '@/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

const authKeys = {
  user: ['auth', 'user'] as const,
};

// ============================================================================
// AUTH HOOKS
// ============================================================================

/**
 * Hook to get current user data
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: authService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if ((error as Error & { response?: { status?: number } })?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginFormData) => {
      console.log('🔄 useLogin mutationFn called with:', credentials);
      return authService.login({
        username: credentials.email, // Backend expects 'username' field
        password: credentials.password,
      });
    },
    retry: false, // Deshabilitar retry para login
    onSuccess: (data) => {
      console.log('🎉 Login success in hook:', data);
      // Cache user data
      queryClient.setQueryData(authKeys.user, data.user);
      
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      console.log('❌ Login error in hook:', error);
      console.log('❌ Error message:', error.message);
      console.log('❌ Error stack:', error.stack);
      // No mostrar toast aquí, dejamos que el componente maneje el error
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      // Cache user data
      queryClient.setQueryData(authKeys.user, data.user);
      
      toast.success('Registration successful!');
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(authService.logout()),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.removeQueries({ queryKey: authKeys.user });
      queryClient.clear(); // Clear all cached data
      
      toast.success('Logged out successfully');
      router.push('/auth/login');
    },
  });
};

/**
 * Hook to check if user is authenticated (safe for SSR)
 */
export const useIsAuthenticated = () => {
  return authService.isAuthenticated();
};

/**
 * Hook to check if user is authenticated (client-side only, avoids hydration issues)
 */
export const useIsAuthenticatedClient = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return { isAuthenticated: isClient ? isAuthenticated : false, isClient };
};

/**
 * Hook for token refresh
 */
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.users.me, data.user);
    },
    onError: () => {
      // Clear cache on refresh failure
      queryClient.clear();
    },
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: { full_name?: string; email?: string }) => 
      authService.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(authKeys.user, updatedUser);
      
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

/**
 * Hook to change user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData: { current_password: string; new_password: string }) => 
      authService.changePassword(passwordData),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

/**
 * Hook to delete user account
 */
export const useDeleteAccount = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      // Clear all cached data
      queryClient.removeQueries({ queryKey: authKeys.user });
      queryClient.clear();
      
      toast.success('Account deleted successfully');
      router.push('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
}; 