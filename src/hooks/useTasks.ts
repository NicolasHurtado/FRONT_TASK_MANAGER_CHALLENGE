// Task Manager Frontend - Task Hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import taskService from '@/services/taskService';
import { queryKeys } from '@/lib/queryClient';
import { TaskFilters, TaskFormData, TaskCreate, TaskUpdate, TaskStatus, UpdateTaskData, CreateTaskData, Task } from '@/types';

// ============================================================================
// TASK HOOKS
// ============================================================================

/**
 * Hook to get all tasks with optional filters
 */
export const useTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => taskService.getTasks(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get a specific task by ID
 */
export const useTask = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });
};

/**
 * Hook to get task statistics
 */
export const useTaskStats = () => {
  return useQuery({
    queryKey: queryKeys.tasks.stats,
    queryFn: taskService.getTaskStats,
    staleTime: 30 * 1000, // 30 seconds - more frequent updates for stats
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => {
      return taskService.createTask(data);
    },
    onSuccess: (newTask) => {
      // Add the new task to the list cache (for the main query without filters)
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return [newTask];
          return [newTask, ...oldData];
        }
      );
      
      // Invalidate and refetch all tasks queries and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      toast.success('Task created successfully!');
    },
    onError: (error: Error) => {
      console.error('Create task error:', error);
      toast.error(error.message || 'Failed to create task');
    },
  });
};

/**
 * Hook to update an existing task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => {
      return taskService.updateTask(id, data);
    },
    onSuccess: (updatedTask) => {
      // Update specific task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );
      
      // Update the task in the list cache (for the main query without filters)
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
      
      // Invalidate all tasks queries and stats to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      toast.success('Task updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Update task error:', error);
      toast.error(error.message || 'Failed to update task');
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: (_, deletedId) => {
      // Remove task from the list cache (for the main query without filters)
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.filter(task => task.id !== deletedId);
        }
      );
      
      // Remove task from cache
      queryClient.removeQueries({ queryKey: queryKeys.tasks.detail(deletedId) });
      
      // Invalidate all tasks queries and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      toast.success('Task deleted successfully!');
    },
    onError: (error: Error) => {
      console.error('Delete task error:', error);
      toast.error(error.message || 'Failed to delete task');
    },
  });
};

/**
 * Hook to update task status
 */
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => 
      taskService.updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      // Update specific task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );
      
      // Update the task in the list cache
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
      
      // Invalidate all tasks queries and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      const statusMessages = {
        por_hacer: 'Task marked as pending',
        en_progreso: 'Task started',
        completada: 'Task completed!',
      };
      
      toast.success(statusMessages[updatedTask.status]);
    },
    onError: (error: Error) => {
      console.error('Update task status error:', error);
      toast.error(error.message || 'Failed to update task status');
    },
  });
};

/**
 * Hook to complete a task
 */
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.completeTask(id),
    onSuccess: (updatedTask) => {
      // Update specific task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );
      
      // Update the task in the list cache
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
      
      // Invalidate all tasks queries and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      toast.success('🎉 Task completed!');
    },
    onError: (error: Error) => {
      console.error('Complete task error:', error);
      toast.error(error.message || 'Failed to complete task');
    },
  });
};

/**
 * Hook to start a task (mark as in progress)
 */
export const useStartTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.startTask(id),
    onSuccess: (updatedTask) => {
      // Update specific task in cache
      queryClient.setQueryData(
        queryKeys.tasks.detail(updatedTask.id),
        updatedTask
      );
      
      // Update the task in the list cache
      queryClient.setQueryData(
        queryKeys.tasks.list(undefined),
        (oldData: Task[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
        }
      );
      
      // Invalidate all tasks queries and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.stats });
      
      toast.success('Task started!');
    },
    onError: (error: Error) => {
      console.error('Start task error:', error);
      toast.error(error.message || 'Failed to start task');
    },
  });
}; 