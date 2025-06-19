'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

import { useCurrentUser, useLogout, useUpdateProfile, useChangePassword, useDeleteAccount } from '@/hooks/useAuth';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase and number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ============================================================================
// TYPES
// ============================================================================

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ============================================================================
// SETTINGS PAGE COMPONENT
// ============================================================================

export default function SettingsPage() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState('');
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    taskReminders: true,
    weeklyReport: true,
  });

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update forms when user data loads
  React.useEffect(() => {
    if (user) {
      resetProfile({
        full_name: user.full_name,
        email: user.email,
      });
    }
  }, [user, resetProfile]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        resetProfile(data);
      },
    });
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      current_password: data.currentPassword,
      new_password: data.newPassword,
    }, {
      onSuccess: () => {
        setIsPasswordDialogOpen(false);
        resetPassword();
      },
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success('Notification preferences updated');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') return;
    deleteAccountMutation.mutate();
    setIsDeleteDialogOpen(false);
    setDeleteConfirmation('');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Profile Section */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">Profile Information</Typography>
                <Chip label="Active Account" color="success" size="small" />
              </Box>

              {/* Avatar Section */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 80, height: 80, fontSize: '2rem' }}>
                  {user.full_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {user.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Button
                    startIcon={<PhotoCameraIcon />}
                    size="small"
                    variant="outlined"
                    disabled
                  >
                    Change Photo (Coming Soon)
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Profile Form */}
              <Box component="form" onSubmit={handleSubmitProfile(onSubmitProfile)}>
                <Stack spacing={3}>
                  <TextField
                    {...registerProfile('full_name')}
                    label="Full Name"
                    fullWidth
                    error={!!profileErrors.full_name}
                    helperText={profileErrors.full_name?.message}
                  />

                  <TextField
                    {...registerProfile('email')}
                    label="Email Address"
                    type="email"
                    fullWidth
                    error={!!profileErrors.email}
                    helperText={profileErrors.email?.message}
                  />

                  <Box display="flex" gap={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={!isProfileDirty || updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => resetProfile()}
                      disabled={!isProfileDirty}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Security & Privacy</Typography>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Last changed: Never (or recent date)
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Account Created
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6">Notification Preferences</Typography>

              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                  }
                  label="Push Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.taskReminders}
                      onChange={() => handleNotificationChange('taskReminders')}
                    />
                  }
                  label="Task Reminders"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.weeklyReport}
                      onChange={() => handleNotificationChange('weeklyReport')}
                    />
                  }
                  label="Weekly Progress Report"
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6" color="error.main">
                Danger Zone
              </Typography>

              <Alert severity="warning">
                These actions are irreversible. Please proceed with caution.
              </Alert>

              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Change Password Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                {...registerPassword('currentPassword')}
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                fullWidth
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />

              <TextField
                {...registerPassword('newPassword')}
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                fullWidth
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />

              <TextField
                {...registerPassword('confirmPassword')}
                label="Confirm New Password"
                type="password"
                fullWidth
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword?.message}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPasswordDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPassword(onSubmitPassword)}
            variant="contained"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteConfirmation('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error.main">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. All your tasks and data will be permanently deleted.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete your account? Type <strong>"DELETE"</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            error={deleteConfirmation !== '' && deleteConfirmation !== 'DELETE'}
            helperText={deleteConfirmation !== '' && deleteConfirmation !== 'DELETE' ? 'Please type "DELETE" exactly' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDeleteDialogOpen(false);
              setDeleteConfirmation('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleteConfirmation !== 'DELETE' || deleteAccountMutation.isPending}
          >
            {deleteAccountMutation.isPending ? <CircularProgress size={20} /> : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 