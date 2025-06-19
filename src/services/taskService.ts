// Task Manager Frontend - Task Service

import api, { endpoints, handleApiError, API_BASE_URL } from '@/lib/api';
import { Task, TaskCreate, TaskUpdate, TaskStats, TaskFilters, CreateTaskData, UpdateTaskData } from '@/types';
import { AxiosError } from 'axios';

// ============================================================================
// TASK SERVICE
// ============================================================================

export const taskService = {
  /**
   * Get all tasks with optional filters
   */
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    console.log("API_BASE_URL", API_BASE_URL);
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        if (filters.due_date_from) params.append('due_date_from', filters.due_date_from);
        if (filters.due_date_to) params.append('due_date_to', filters.due_date_to);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.size) params.append('size', filters.size.toString());
      }

      const queryString = params.toString();
      const url = queryString ? `${endpoints.tasks.list}?${queryString}` : endpoints.tasks.list;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Get a specific task by ID
   */
  async getTask(id: string): Promise<Task> {
    try {
      const response = await api.get(endpoints.tasks.detail(id));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post(endpoints.tasks.create, taskData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Update an existing task
   */
  async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
    try {
      const response = await api.put(endpoints.tasks.update(id), taskData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(endpoints.tasks.delete(id));
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Get task statistics
   */
  async getTaskStats(): Promise<TaskStats> {
    try {
      const response = await api.get(endpoints.tasks.stats);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Update task status only
   */
  async updateTaskStatus(id: string, status: 'por_hacer' | 'en_progreso' | 'completada'): Promise<Task> {
    try {
      const response = await api.put(endpoints.tasks.update(id), { status });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error as AxiosError));
    }
  },

  /**
   * Mark task as completed
   */
  async completeTask(id: string): Promise<Task> {
    return this.updateTaskStatus(id, 'completada');
  },

  /**
   * Mark task as in progress
   */
  async startTask(id: string): Promise<Task> {
    return this.updateTaskStatus(id, 'en_progreso');
  },

  /**
   * Mark task as pending
   */
  async resetTask(id: string): Promise<Task> {
    return this.updateTaskStatus(id, 'por_hacer');
  },
};

export default taskService; 