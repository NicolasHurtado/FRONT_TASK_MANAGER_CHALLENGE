'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import { 
  TaskAlt as TaskIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CloudSync as CloudIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import { useIsAuthenticatedClient } from '@/hooks/useAuth';

// ============================================================================
// LANDING PAGE COMPONENT
// ============================================================================

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isClient } = useIsAuthenticatedClient();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const features = [
    {
      icon: <TaskIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Task Management',
      description: 'Create, organize, and track your tasks with ease. Set priorities and due dates.',
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Intuitive Dashboard',
      description: 'Get a clear overview of your work with our clean and modern interface.',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Progress Analytics',
      description: 'Track your productivity with detailed statistics and insights.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your data is protected with JWT authentication and secure storage.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Fast & Responsive',
      description: 'Built with modern technologies for optimal performance.',
    },
    {
      icon: <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Sync',
      description: 'Access your tasks from anywhere with real-time synchronization.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip 
                  label="Modern Task Management" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
                <Typography variant="h1" component="h1" sx={{ fontWeight: 700 }}>
                  Organize Your Work,{' '}
                  <Typography component="span" variant="h1" sx={{ color: '#ffeb3b' }}>
                    Boost Productivity
                  </Typography>
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  A powerful and intuitive task management system built with modern technologies. 
                  Stay organized, meet deadlines, and achieve your goals.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    {isClient && isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                    onClick={() => router.push('/auth/register')}
                  >
                    Sign Up Free
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                }}
              >
                <TaskIcon sx={{ fontSize: 200, opacity: 0.8 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography variant="h2" component="h2" gutterBottom>
              Everything You Need to Stay Organized
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Our comprehensive task management solution provides all the tools you need 
              to manage your work efficiently and effectively.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Stack spacing={2} alignItems="center">
                      {feature.icon}
                      <Typography variant="h6" component="h3" fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Stack spacing={3} textAlign="center">
            <Typography variant="h3" component="h2" fontWeight={600}>
              Ready to Get Organized?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join thousands of users who have transformed their productivity with our task management system.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                alignSelf: 'center',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {isClient && isAuthenticated ? 'Open Dashboard' : 'Start Managing Tasks'}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            © 2024 Task Manager. Built with Next.js, FastAPI, and MongoDB.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
