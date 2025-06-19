// Task Manager Frontend - Types

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

export interface UserLogin {
  username: string; // Backend expects 'username' field for email
  password: string;
}

// ============================================================================
// TASK TYPES
// ============================================================================

export type TaskStatus = 'por_hacer' | 'en_progreso' | 'completada';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TaskCreate {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string | null;
  status?: TaskStatus;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  completed: number;
  by_priority: {
    baja: number;
    media: number;
    alta: number;
  };
  completion_rate: number;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
  page?: number;
  size?: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date?: Date | null;
  status?: TaskStatus;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface LoadingState {
  [key: string]: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>; 