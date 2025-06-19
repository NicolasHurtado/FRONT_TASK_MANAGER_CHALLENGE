// Tests para TaskService - Operaciones CRUD de Tareas (Con Mocks Directos)

import taskService from '../../services/taskService';

// Mock completo del taskService
jest.mock('../../services/taskService', () => ({
  getTasks: jest.fn(),
  getTask: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  getTaskStats: jest.fn(),
  updateTaskStatus: jest.fn(),
  completeTask: jest.fn(),
  startTask: jest.fn(),
  resetTask: jest.fn(),
}));

const mockTaskService = taskService as jest.Mocked<typeof taskService>;

describe('TaskService CRUD Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockTask = {
    id: '1',
    title: 'Tarea de prueba',
    description: 'Descripción de la tarea',
    status: 'por_hacer' as const,
    priority: 'alta' as const,
    due_date: '2024-12-31T23:59:59Z',
    user_id: 'user_1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null,
  };

  const mockTaskStats = {
    total: 10,
    todo: 2,
    in_progress: 3,
    completed: 5,
    by_priority: {
      alta: 3,
      media: 4,
      baja: 3,
    },
    completion_rate: 50,
  };

  // ============================================================================
  // CREATE Operations
  // ============================================================================

  describe('CREATE - Create Task', () => {
    it('debería crear una nueva tarea correctamente', async () => {
      const taskData = {
        title: 'Nueva tarea',
        description: 'Descripción de nueva tarea',
        priority: 'media' as const,
        due_date: '2024-12-31T23:59:59Z',
      };

             const mockCreatedTask = {
         ...mockTask,
         ...taskData,
         id: '2',
         completed_at: null,
       };

      mockTaskService.createTask.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockCreatedTask);
    });

    it('debería manejar errores al crear tarea', async () => {
      const taskData = {
        title: '',
        description: 'Tarea sin título',
        priority: 'media' as const,
      };

      mockTaskService.createTask.mockRejectedValue(new Error('Title is required'));

      await expect(taskService.createTask(taskData)).rejects.toThrow('Title is required');
      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
    });
  });

  // ============================================================================
  // READ Operations
  // ============================================================================

  describe('READ - Get Tasks', () => {
    it('debería obtener todas las tareas sin filtros', async () => {
      const mockTasks = [mockTask];

      mockTaskService.getTasks.mockResolvedValue(mockTasks);

      const result = await taskService.getTasks();

      expect(mockTaskService.getTasks).toHaveBeenCalledWith();
      expect(result).toEqual(mockTasks);
    });

    it('debería obtener tareas con filtros', async () => {
      const filters = {
        status: 'completada' as const,
        priority: 'alta' as const,
        search: 'prueba',
        page: 1,
        size: 10,
      };

      const mockTasks = [mockTask];

      mockTaskService.getTasks.mockResolvedValue(mockTasks);

      const result = await taskService.getTasks(filters);

      expect(mockTaskService.getTasks).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockTasks);
    });

    it('debería manejar errores al obtener tareas', async () => {
      mockTaskService.getTasks.mockRejectedValue(new Error('Server error'));

      await expect(taskService.getTasks()).rejects.toThrow('Server error');
      expect(mockTaskService.getTasks).toHaveBeenCalled();
    });

    it('debería manejar respuesta vacía', async () => {
      mockTaskService.getTasks.mockResolvedValue([]);

      const result = await taskService.getTasks();

      expect(mockTaskService.getTasks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('READ - Get Single Task', () => {
    it('debería obtener una tarea específica por ID', async () => {
      mockTaskService.getTask.mockResolvedValue(mockTask);

      const result = await taskService.getTask('1');

      expect(mockTaskService.getTask).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTask);
    });

    it('debería manejar errores al obtener tarea por ID', async () => {
      mockTaskService.getTask.mockRejectedValue(new Error('Task not found'));

      await expect(taskService.getTask('999')).rejects.toThrow('Task not found');
      expect(mockTaskService.getTask).toHaveBeenCalledWith('999');
    });
  });

  describe('READ - Get Task Stats', () => {
    it('debería obtener estadísticas de tareas', async () => {
      mockTaskService.getTaskStats.mockResolvedValue(mockTaskStats);

      const result = await taskService.getTaskStats();

      expect(mockTaskService.getTaskStats).toHaveBeenCalled();
      expect(result).toEqual(mockTaskStats);
    });

    it('debería manejar errores al obtener estadísticas', async () => {
      mockTaskService.getTaskStats.mockRejectedValue(new Error('Stats not available'));

      await expect(taskService.getTaskStats()).rejects.toThrow('Stats not available');
      expect(mockTaskService.getTaskStats).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // UPDATE Operations
  // ============================================================================

  describe('UPDATE - Update Task', () => {
    it('debería actualizar una tarea correctamente', async () => {
      const updateData = {
        title: 'Tarea actualizada',
        description: 'Descripción actualizada',
        priority: 'baja' as const,
      };

             const mockUpdatedTask = {
         ...mockTask,
         ...updateData,
         updated_at: '2024-01-02T00:00:00Z',
         completed_at: null,
       };

      mockTaskService.updateTask.mockResolvedValue(mockUpdatedTask);

      const result = await taskService.updateTask('1', updateData);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', updateData);
      expect(result).toEqual(mockUpdatedTask);
    });

    it('debería manejar errores al actualizar tarea', async () => {
      const updateData = {
        title: '',
      };

      mockTaskService.updateTask.mockRejectedValue(new Error('Title cannot be empty'));

      await expect(taskService.updateTask('1', updateData)).rejects.toThrow('Title cannot be empty');
      expect(mockTaskService.updateTask).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('UPDATE - Update Task Status', () => {
    it('debería actualizar el status de una tarea', async () => {
             const mockUpdatedTask = {
         ...mockTask,
         status: 'completada' as const,
         updated_at: '2024-01-02T00:00:00Z',
         completed_at: '2024-01-02T00:00:00Z',
       };

       mockTaskService.updateTaskStatus.mockResolvedValue(mockUpdatedTask);

       const result = await taskService.updateTaskStatus('1', 'completada');

       expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith('1', 'completada');
       expect(result).toEqual(mockUpdatedTask);
     });

     it('debería marcar tarea como completada', async () => {
       const mockCompletedTask = {
         ...mockTask,
         status: 'completada' as const,
         updated_at: '2024-01-02T00:00:00Z',
         completed_at: '2024-01-02T00:00:00Z',
       };

       mockTaskService.completeTask.mockResolvedValue(mockCompletedTask);

       const result = await taskService.completeTask('1');

       expect(mockTaskService.completeTask).toHaveBeenCalledWith('1');
       expect(result).toEqual(mockCompletedTask);
     });

     it('debería marcar tarea como en progreso', async () => {
       const mockInProgressTask = {
         ...mockTask,
         status: 'en_progreso' as const,
         updated_at: '2024-01-02T00:00:00Z',
         completed_at: null,
       };

       mockTaskService.startTask.mockResolvedValue(mockInProgressTask);

       const result = await taskService.startTask('1');

       expect(mockTaskService.startTask).toHaveBeenCalledWith('1');
       expect(result).toEqual(mockInProgressTask);
     });

     it('debería resetear tarea a pendiente', async () => {
       const mockResetTask = {
         ...mockTask,
         status: 'por_hacer' as const,
         updated_at: '2024-01-02T00:00:00Z',
         completed_at: null,
       };

      mockTaskService.resetTask.mockResolvedValue(mockResetTask);

      const result = await taskService.resetTask('1');

      expect(mockTaskService.resetTask).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockResetTask);
    });

    it('debería manejar errores al actualizar status', async () => {
      mockTaskService.updateTaskStatus.mockRejectedValue(new Error('Task not found'));

      await expect(taskService.updateTaskStatus('1', 'completada')).rejects.toThrow('Task not found');
      expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith('1', 'completada');
    });
  });

  // ============================================================================
  // DELETE Operations
  // ============================================================================

  describe('DELETE - Delete Task', () => {
    it('debería eliminar una tarea correctamente', async () => {
      mockTaskService.deleteTask.mockResolvedValue(undefined);

      await expect(taskService.deleteTask('1')).resolves.not.toThrow();
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    });

    it('debería manejar errores al eliminar tarea', async () => {
      mockTaskService.deleteTask.mockRejectedValue(new Error('Task not found'));

      await expect(taskService.deleteTask('999')).rejects.toThrow('Task not found');
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('999');
    });

    it('debería manejar errores de permisos al eliminar', async () => {
      mockTaskService.deleteTask.mockRejectedValue(new Error('Permission denied'));

      await expect(taskService.deleteTask('1')).rejects.toThrow('Permission denied');
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
    });
  });

  // ============================================================================
  // Casos Adicionales
  // ============================================================================

  describe('Edge Cases', () => {
    it('debería manejar filtros con fechas', async () => {
      const filters = {
        due_date_from: '2024-01-01',
        due_date_to: '2024-12-31',
      };

      mockTaskService.getTasks.mockResolvedValue([]);

      const result = await taskService.getTasks(filters);

      expect(mockTaskService.getTasks).toHaveBeenCalledWith(filters);
      expect(result).toEqual([]);
    });

    it('debería manejar timeout y errores de red', async () => {
      mockTaskService.getTasks.mockRejectedValue(new Error('Network timeout'));

      await expect(taskService.getTasks()).rejects.toThrow('Network timeout');
      expect(mockTaskService.getTasks).toHaveBeenCalled();
    });

    it('debería manejar errores de servidor', async () => {
      mockTaskService.getTasks.mockRejectedValue(new Error('Internal server error'));

      await expect(taskService.getTasks()).rejects.toThrow('Internal server error');
      expect(mockTaskService.getTasks).toHaveBeenCalled();
    });
  });
}); 