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

import { useLogin, useIsAuthenticated } from '@/hooks/useAuth';
import { LoginFormData } from '@/types';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// ============================================================================
// LOGIN FORM COMPONENT
// ============================================================================

export default function LoginForm() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  React.useEffect(() => {
    console.log('🔄 Login mutation:', loginMutation);
  }, [
    loginMutation.isError, 
    loginMutation.isSuccess, 
    loginMutation.error,
    loginMutation.isPending,
    loginMutation.isIdle
  ]);

  // Mostrar loading si está autenticado
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
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to your Task Manager account
                </Typography>
              </Box>

              {/* Error Alert */}
              {loginMutation.isError && (
                <Alert severity="error">
                  {loginMutation.error?.message || 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.'}
                </Alert>
              )}

              {/* Success Alert (for debugging) */}
              {loginMutation.isSuccess && (
                <Alert severity="success">
                  ¡Login exitoso! Redirigiendo...
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleFormSubmit} noValidate>
                <Stack spacing={3}>
                  <TextField
                    {...register('email')}
                    fullWidth
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    {...register('password')}
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting || loginMutation.isPending}
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      console.log('🔄 Button clicked');
                      // No prevenir aquí, dejamos que el form maneje el submit
                    }}
                  >
                    {isSubmitting || loginMutation.isPending ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>

              {/* Footer Links */}
              <Stack spacing={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{' '}
                  <Link component={NextLink} href="/auth/register" color="primary">
                    Sign up here
                  </Link>
                </Typography>

                <Link component={NextLink} href="/" color="text.secondary" sx={{ textDecoration: 'none' }}>
                  ← Back to home
                </Link>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
} 