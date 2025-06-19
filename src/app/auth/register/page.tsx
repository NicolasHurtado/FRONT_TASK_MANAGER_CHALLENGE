'use client';

import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

import { useRegister, useIsAuthenticated } from '@/hooks/useAuth';
import { RegisterFormData } from '@/types';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(1, 'Full name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ============================================================================
// REGISTER PAGE COMPONENT
// ============================================================================

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by the mutation
      console.error('Registration error:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Header */}
              <Box textAlign="center">
                <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                  Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join Task Manager and boost your productivity
                </Typography>
              </Box>

              {/* Error Alert */}
              {registerMutation.isError && (
                <Alert severity="error">
                  {registerMutation.error?.message || 'Registration failed. Please try again.'}
                </Alert>
              )}

              {/* Register Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={3}>
                  <TextField
                    {...register('full_name')}
                    fullWidth
                    label="Full Name"
                    autoComplete="name"
                    autoFocus
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                  />

                  <TextField
                    {...register('email')}
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    {...register('password')}
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />

                  <TextField
                    {...register('confirmPassword')}
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || registerMutation.isPending}
                    sx={{ mt: 2 }}
                  >
                    {isSubmitting || registerMutation.isPending ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Stack>
              </Box>

              {/* Footer Links */}
              <Stack spacing={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link component={NextLink} href="/auth/login" color="primary">
                    Sign in here
                  </Link>
                </Typography>

                <Link component={NextLink} href="/" color="text.secondary" sx={{ textDecoration: 'none' }}>
                  ← Back to home
                </Link>
              </Stack>

              {/* Password Requirements */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Password requirements:
                </Typography>
                <Typography variant="caption" color="text.secondary" component="ul" sx={{ pl: 2, mt: 1 }}>
                  <li>At least 6 characters long</li>
                  <li>Contains uppercase and lowercase letters</li>
                  <li>Contains at least one number</li>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 