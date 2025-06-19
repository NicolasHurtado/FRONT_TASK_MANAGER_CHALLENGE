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
  Fab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  TaskAlt as TaskIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { useTaskStats, useTasks } from '@/hooks/useTasks';

// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return 'success';
      case 'en_progreso': return 'info';
      case 'por_hacer': return 'default';
      default: return 'default';
    }
  };

  if (userLoading || statsLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography variant="h4" fontWeight={600}>
                {getGreeting()}, {user?.full_name?.split(' ')[0] || 'User'}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Listo para afrontar tus tareas hoy?
              </Typography>
            </Stack>
            <IconButton
              onClick={handleLogout}
              sx={{ color: 'white' }}
              disabled={logoutMutation.isPending}
            >
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Statistics Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      }}
                    >
                      <AssignmentIcon />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={600}>
                        {stats?.total || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Tareas
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'success.light',
                        color: 'success.contrastText',
                      }}
                    >
                      <TaskIcon />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={600}>
                        {stats?.completed || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completadas
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'info.light',
                        color: 'info.contrastText',
                      }}
                    >
                      <ScheduleIcon />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={600}>
                        {stats?.in_progress || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        En Progreso
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'warning.light',
                        color: 'warning.contrastText',
                      }}
                    >
                      <TrendingUpIcon />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={600}>
                        {stats?.by_priority?.alta || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Alta Prioridad
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Progress Overview */}
          {stats && stats.total > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de Progreso
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.completion_rate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stats.completed} de {stats.total} tareas completadas ({stats.completion_rate.toFixed(1)}%)
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Recent Tasks */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tareas Recientes
              </Typography>
              {tasksLoading ? (
                <LinearProgress />
              ) : tasks && tasks.length > 0 ? (
                <Stack spacing={2}>
                  {tasks.slice(0, 5).map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={500}>
                            {task.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {task.description}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              size="small"
                              label={task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              color={getStatusColor(task.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                            />
                            <Chip
                              size="small"
                              label={task.priority.replace(/\b\w/g, l => l.toUpperCase())}
                              color={getPriorityColor(task.priority) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                            />
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1" color="text.secondary">
                    No hay tareas todavía. Crea tu primera tarea para empezar!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => {
          // TODO: Open task creation modal
          console.log('Open create task modal');
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
} 