// Task Manager Frontend - Auth Service

import api, { endpoints, handleApiError, tokenManager } from '@/lib/api';
import { LoginResponse, UserCreate, UserLogin, RefreshTokenRequest, User } from '@/types';
import { AxiosError } from 'axios';
import https from 'https';

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
  /**
   * User login
   */
  async login(credentials: UserLogin): Promise<LoginResponse> {
    try {
      // Backend expects form data for OAuth2PasswordRequestForm
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await api.post(endpoints.auth.login, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data: LoginResponse = response.data;

      // Store tokens
      tokenManager.setToken(data.access_token);
      tokenManager.setRefreshToken(data.refresh_token);

      return data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * User registration
   */
  async register(userData: UserCreate): Promise<LoginResponse> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      console.log('userData', userData);
      const response = await api.post(endpoints.auth.register, userData, {
        httpsAgent,
      });
      console.log('response', response);
      const data: LoginResponse = response.data;

      // Store tokens
      tokenManager.setToken(data.access_token);
      tokenManager.setRefreshToken(data.refresh_token);

      return data;
    } catch (error) {
      console.log('error', error);
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const request: RefreshTokenRequest = {
        refresh_token: refreshToken,
      };

      const response = await api.post(endpoints.auth.refresh, request);
      const data: LoginResponse = response.data;

      // Update tokens
      tokenManager.setToken(data.access_token);
      if (data.refresh_token) {
        tokenManager.setRefreshToken(data.refresh_token);
      }

      return data;
    } catch (error) {
      // Clear tokens on refresh failure
      tokenManager.clearAll();
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Logout user
   */
  logout(): void {
    tokenManager.clearAll();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.getToken() !== null;
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(endpoints.users.me);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: { full_name?: string; email?: string }): Promise<User> {
    try {
      const response = await api.put(endpoints.users.me, profileData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Change user password
   */
  async changePassword(passwordData: { 
    current_password: string; 
    new_password: string; 
  }): Promise<void> {
    try {
      await api.put('/api/v1/users/me/password', passwordData);
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      await api.delete(endpoints.users.me);
      // Clear tokens after successful deletion
      tokenManager.clearAll();
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },
};

export default authService; 