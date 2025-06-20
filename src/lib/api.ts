// Task Manager Frontend - API Configuration

import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import https from 'https';

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhostXXX:8000';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  ...(API_BASE_URL.startsWith('https:') && {
    httpsAgent: httpsAgent
  })
});

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(TOKEN_KEY) || null;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    Cookies.set(TOKEN_KEY, token, { 
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    Cookies.remove(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    Cookies.set(REFRESH_TOKEN_KEY, token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  },

  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  clearAll: (): void => {
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
  }
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError['config'] & { _retry?: boolean };

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        tokenManager.clearAll();
        processQueue(error, null);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        // Update tokens
        tokenManager.setToken(access_token);
        if (newRefreshToken) {
          tokenManager.setRefreshToken(newRefreshToken);
        }

        // Process queued requests
        processQueue(null, access_token);
        
        // Retry original request
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearAll();
        processQueue(refreshError as Error, null);
        
        if (typeof window !== 'undefined') {
          toast.error('Session expired. Please login again.');
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const status = error.response?.status;
    if (status === 403) {
      toast.error('Access denied');
    } else if (status === 404) {
      toast.error('Resource not found');
    } else if (status && status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    refresh: '/api/v1/auth/refresh',
  },
  // User endpoints
  users: {
    me: '/api/v1/users/me',
  },
  // Task endpoints
  tasks: {
    list: '/api/v1/tasks/',
    create: '/api/v1/tasks/',
    detail: (id: string) => `/api/v1/tasks/${id}`,
    update: (id: string) => `/api/v1/tasks/${id}`,
    delete: (id: string) => `/api/v1/tasks/${id}`,
    stats: '/api/v1/tasks/stats',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as {
      detail?: string | Array<{ msg: string }>;
      message?: string;
    };
    
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    
    if (Array.isArray(data.detail)) {
      return data.detail.map((err: { msg: string }) => err.msg).join(', ');
    }
    
    if (data.message) {
      return data.message;
    }
  }
  
  return error.message || 'An unexpected error occurred';
};

export const isApiError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true;
};

export default api; 