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
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

import { useTaskStats, useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority } from '@/types';

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_COLORS = {
  por_hacer: '#f44336',
  en_progreso: '#ff9800',
  completada: '#4caf50',
};

const PRIORITY_COLORS = {
  baja: '#4caf50',
  media: '#ff9800',
  alta: '#f44336',
};

// ============================================================================
// ANALYTICS PAGE COMPONENT
// ============================================================================

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  // Prepare data for charts
  const statusData = React.useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'To Do', value: stats.todo, color: STATUS_COLORS.por_hacer },
      { name: 'In Progress', value: stats.in_progress, color: STATUS_COLORS.en_progreso },
      { name: 'Completed', value: stats.completed, color: STATUS_COLORS.completada },
    ];
  }, [stats]);

  const priorityData = React.useMemo(() => {
    if (!stats?.by_priority) return [];
    
    return [
      { name: 'Low', value: stats.by_priority.baja || 0, color: PRIORITY_COLORS.baja },
      { name: 'Medium', value: stats.by_priority.media || 0, color: PRIORITY_COLORS.media },
      { name: 'High', value: stats.by_priority.alta || 0, color: PRIORITY_COLORS.alta },
    ];
  }, [stats]);

  const weeklyProgress = React.useMemo(() => {
    if (!tasks) return [];

    // Get tasks completed in the last 7 days
    const today = new Date();
    const lastWeek = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completed = tasks.filter(task => 
        task.status === 'completada' && 
        task.completed_at?.startsWith(dateStr)
      ).length;

      lastWeek.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
        date: dateStr,
      });
    }

    return lastWeek;
  }, [tasks]);

  const productivityMetrics = React.useMemo(() => {
    if (!tasks || !stats) return null;

    const completionRate = stats.completion_rate;
    const highPriorityCompleted = tasks.filter(
      task => task.priority === 'alta' && task.status === 'completada'
    ).length;
    const totalHighPriority = stats.by_priority.alta;
    const highPriorityRate = totalHighPriority > 0 ? (highPriorityCompleted / totalHighPriority) * 100 : 0;

    return {
      completionRate,
      highPriorityRate,
      totalTasks: stats.total,
      avgTasksPerDay: stats.total / 7, // Assuming 7 days of data
    };
  }, [tasks, stats]);

  if (statsLoading || tasksLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your productivity and task completion patterns
          </Typography>
        </Box>

        {/* Key Metrics */}
        {productivityMetrics && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main" fontWeight={600}>
                    {productivityMetrics.completionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main" fontWeight={600}>
                    {productivityMetrics.highPriorityRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main" fontWeight={600}>
                    {productivityMetrics.totalTasks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main" fontWeight={600}>
                    {productivityMetrics.avgTasksPerDay.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Tasks/Day
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Charts Row 1 */}
        <Grid container spacing={3}>
          {/* Task Status Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Status Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`status-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Priority Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Priority Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {priorityData.map((entry, index) => (
                          <Cell key={`priority-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Weekly Progress */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Task Completion
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#4caf50" 
                    strokeWidth={3}
                    name="Tasks Completed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Task Status Breakdown */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Task Status Breakdown
            </Typography>
            <Grid container spacing={3}>
              {statusData.map((status) => (
                <Grid item xs={12} sm={4} key={status.name}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: status.color, fontWeight: 600 }}>
                      {status.value}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {status.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats ? (status.value / stats.total) * 100 : 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: status.color,
                        },
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Productivity Insights
            </Typography>
            <Stack spacing={2}>
              {productivityMetrics && productivityMetrics.completionRate > 80 && (
                <Chip
                  label="🎉 Great job! You're completing most of your tasks"
                  color="success"
                  variant="outlined"
                />
              )}
              {productivityMetrics && productivityMetrics.highPriorityRate < 50 && (
                <Chip
                  label="⚠️ Focus on completing high priority tasks first"
                  color="warning"
                  variant="outlined"
                />
              )}
              {stats && stats.in_progress > stats.completed && (
                <Chip
                  label="🔄 You have more tasks in progress than completed"
                  color="info"
                  variant="outlined"
                />
              )}
              {weeklyProgress.reduce((sum, day) => sum + day.completed, 0) === 0 && (
                <Chip
                  label="💪 No tasks completed this week - time to get productive!"
                  color="error"
                  variant="outlined"
                />
              )}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
} 