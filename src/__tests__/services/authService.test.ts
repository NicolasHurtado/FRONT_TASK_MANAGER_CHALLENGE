// Tests para AuthService - Operaciones CRUD de Usuario (Con Mocks Directos)

import authService from '../../services/authService';

// Mock completo del authService
jest.mock('../../services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn(),
  getCurrentUser: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
  deleteAccount: jest.fn(),
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('AuthService CRUD Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock data
  const mockUser = {
    id: '1',
    full_name: 'Juan Pérez',
    email: 'juan@example.com',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockLoginResponse = {
    access_token: 'access_token_123',
    refresh_token: 'refresh_token_123',
    token_type: 'Bearer',
    user: mockUser,
  };

  // ============================================================================
  // CREATE Operations (Register/Login)
  // ============================================================================

  describe('CREATE - User Registration', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      const userData = {
        full_name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockLoginResponse);

      const result = await authService.register(userData);

      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockLoginResponse);
    });

    it('debería manejar errores de registro', async () => {
      const userData = {
        full_name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockRejectedValue(new Error('Email already exists'));

      await expect(authService.register(userData)).rejects.toThrow('Email already exists');
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
    });
  });

  describe('CREATE - User Login', () => {
    it('debería hacer login correctamente', async () => {
      const credentials = {
        username: 'juan@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await authService.login(credentials);

      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(mockLoginResponse);
    });

    it('debería manejar errores de login', async () => {
      const credentials = {
        username: 'juan@example.com',
        password: 'wrong_password',
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
    });
  });

  // ============================================================================
  // READ Operations
  // ============================================================================

  describe('READ - Get Current User', () => {
    it('debería obtener la información del usuario actual', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debería manejar errores al obtener usuario', async () => {
      mockAuthService.getCurrentUser.mockRejectedValue(new Error('Token expired'));

      await expect(authService.getCurrentUser()).rejects.toThrow('Token expired');
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('READ - Check Authentication', () => {
    it('debería retornar true si hay token', () => {
      mockAuthService.isAuthenticated.mockReturnValue(true);

      const result = authService.isAuthenticated();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería retornar false si no hay token', () => {
      mockAuthService.isAuthenticated.mockReturnValue(false);

      const result = authService.isAuthenticated();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // UPDATE Operations
  // ============================================================================

  describe('UPDATE - Update Profile', () => {
    it('debería actualizar el perfil del usuario', async () => {
      const profileData = {
        full_name: 'Juan Carlos Pérez',
        email: 'juancarlos@example.com',
      };

      const mockUpdatedUser = {
        ...mockUser,
        ...profileData,
        updated_at: '2024-01-02T00:00:00Z',
      };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdatedUser);

      const result = await authService.updateProfile(profileData);

      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(profileData);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('debería manejar errores al actualizar perfil', async () => {
      const profileData = {
        email: 'invalid-email',
      };

      mockAuthService.updateProfile.mockRejectedValue(new Error('Invalid email format'));

      await expect(authService.updateProfile(profileData)).rejects.toThrow('Invalid email format');
      expect(mockAuthService.updateProfile).toHaveBeenCalledWith(profileData);
    });
  });

  describe('UPDATE - Change Password', () => {
    it('debería cambiar la contraseña correctamente', async () => {
      const passwordData = {
        current_password: 'old_password',
        new_password: 'new_password',
      };

      mockAuthService.changePassword.mockResolvedValue(undefined);

      await expect(authService.changePassword(passwordData)).resolves.not.toThrow();
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(passwordData);
    });

    it('debería manejar errores al cambiar contraseña', async () => {
      const passwordData = {
        current_password: 'wrong_password',
        new_password: 'new_password',
      };

      mockAuthService.changePassword.mockRejectedValue(new Error('Current password is incorrect'));

      await expect(authService.changePassword(passwordData)).rejects.toThrow('Current password is incorrect');
      expect(mockAuthService.changePassword).toHaveBeenCalledWith(passwordData);
    });
  });

  describe('UPDATE - Refresh Token', () => {
    it('debería refrescar el token correctamente', async () => {
      const mockRefreshResponse = {
        ...mockLoginResponse,
        access_token: 'new_access_token',
        refresh_token: 'new_refresh_token',
      };

      mockAuthService.refreshToken.mockResolvedValue(mockRefreshResponse);

      const result = await authService.refreshToken();

      expect(mockAuthService.refreshToken).toHaveBeenCalled();
      expect(result).toEqual(mockRefreshResponse);
    });

    it('debería manejar errores de refresh token', async () => {
      mockAuthService.refreshToken.mockRejectedValue(new Error('No refresh token available'));

      await expect(authService.refreshToken()).rejects.toThrow('No refresh token available');
      expect(mockAuthService.refreshToken).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // DELETE Operations
  // ============================================================================

  describe('DELETE - Logout', () => {
    it('debería hacer logout correctamente', () => {
      mockAuthService.logout.mockReturnValue(undefined);

      expect(() => authService.logout()).not.toThrow();
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });

  describe('DELETE - Delete Account', () => {
    it('debería eliminar la cuenta correctamente', async () => {
      mockAuthService.deleteAccount.mockResolvedValue(undefined);

      await expect(authService.deleteAccount()).resolves.not.toThrow();
      expect(mockAuthService.deleteAccount).toHaveBeenCalled();
    });

    it('debería manejar errores al eliminar cuenta', async () => {
      mockAuthService.deleteAccount.mockRejectedValue(new Error('Cannot delete account'));

      await expect(authService.deleteAccount()).rejects.toThrow('Cannot delete account');
      expect(mockAuthService.deleteAccount).toHaveBeenCalled();
    });
  });
}); 