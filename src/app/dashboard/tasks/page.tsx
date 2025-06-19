'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority, CreateTaskData, UpdateTaskData } from '@/types';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  priority: z.enum(['baja', 'media', 'alta'] as const),
  status: z.enum(['por_hacer', 'en_progreso', 'completada'] as const),
  completed: z.boolean().optional(),
});

// ============================================================================
// TYPES
// ============================================================================

type TaskFormData = z.infer<typeof taskSchema>;

// ============================================================================
// TASKS PAGE COMPONENT
// ============================================================================

export default function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | 'all'>('all');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'media',
      status: 'por_hacer',
      completed: false,
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEdit = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        status: selectedTask.status,
        completed: selectedTask.status === 'completada',
      });
      setIsDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedTask) {
      try {
        await deleteTaskMutation.mutateAsync(selectedTask.id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
    handleMenuClose();
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      priority: 'media',
      status: 'por_hacer',
      completed: false,
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
    reset();
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        // Update existing task
        const updateData: UpdateTaskData = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.completed ? 'completada' : (data.status || editingTask.status),
        };
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          data: updateData,
        });
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const createData: CreateTaskData = {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status || 'por_hacer',
        };
        await createTaskMutation.mutateAsync(createData);
        toast.success('Task created successfully');
      }
      handleDialogClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completada': return 'success';
      case 'en_progreso': return 'info';
      case 'por_hacer': return 'default';
      default: return 'default';
    }
  };

  // Filter tasks
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load tasks. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            My Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your tasks efficiently
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="por_hacer">To Do</MenuItem>
                    <MenuItem value="en_progreso">In Progress</MenuItem>
                    <MenuItem value="completada">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="baja">Low</MenuItem>
                    <MenuItem value="media">Medium</MenuItem>
                    <MenuItem value="alta">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Task List */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : filteredTasks.length > 0 ? (
          <Grid container spacing={3}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} md={6} lg={4} key={task.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Typography variant="h6" fontWeight={500} sx={{ flex: 1 }}>
                          {task.title}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, task)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                        {task.description}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={task.status.replace('_', ' ')}
                          color={getStatusColor(task.status) as any}
                        />
                        <Chip
                          size="small"
                          label={task.priority}
                          color={getPriorityColor(task.priority) as any}
                        />
                      </Stack>

                      {task.created_at && (
                        <Typography variant="caption" color="text.secondary">
                          Created: {new Date(task.created_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tasks found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters to see more tasks.'
                  : 'Create your first task to get started!'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateNew}
              >
                Create Task
              </Button>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} disabled={deleteTaskMutation.isPending}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={handleCreateNew}
      >
        <AddIcon />
      </Fab>

      {/* Create/Edit Task Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </Typography>
            <IconButton onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel>Priority</InputLabel>
                        <Select {...field} label="Priority">
                          <MenuItem value="baja">Low</MenuItem>
                          <MenuItem value="media">Medium</MenuItem>
                          <MenuItem value="alta">High</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.status}>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="por_hacer">To Do</MenuItem>
                          <MenuItem value="en_progreso">In Progress</MenuItem>
                          <MenuItem value="completada">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              {editingTask && (
                <Controller
                  name="completed"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Mark as completed"
                    />
                  )}
                />
              )}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting || createTaskMutation.isPending || updateTaskMutation.isPending}
          >
            {isSubmitting || createTaskMutation.isPending || updateTaskMutation.isPending ? (
              <CircularProgress size={20} />
            ) : editingTask ? (
              'Update Task'
            ) : (
              'Create Task'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 