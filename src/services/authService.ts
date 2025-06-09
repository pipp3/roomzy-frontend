import { api } from '@/services/apiClient';
import { ApiResponse, tokenUtils } from '@/services/apiClient';
import { API_ENDPOINTS } from '@/constants/api';

// Tipos para los datos de usuario
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  region: string;
  city: string;
  phone: string;
  bio: string;
  habits: string;
  profilePhoto?: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para las peticiones
export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  region: string;
  city: string;
  phone: string;
  password: string;
  role?: 'seeker' | 'landlord';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendCodeData {
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

// Servicio de autenticación
export const authService = {
  // Registro de usuario
  register: async (data: RegisterData): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<User>(API_ENDPOINTS.AUTH.REGISTER, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Login de usuario
  login: async (data: LoginData): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<User>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      // Guardar tokens si el login es exitoso
      if (response.data.success && response.data.tokens) {
        tokenUtils.setTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        );
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Verificar email
  verifyEmail: async (data: VerifyEmailData): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<User>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Reenviar código de verificación
  resendVerificationCode: async (data: ResendCodeData): Promise<ApiResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESEND_CODE, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Limpiar tokens locales
      tokenUtils.clearTokens();
      
      return response.data;
    } catch (error: any) {
      // Aunque falle la petición, limpiar tokens locales
      tokenUtils.clearTokens();
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Refresh token
  refreshToken: async (): Promise<ApiResponse> => {
    try {
      const refreshToken = tokenUtils.getRefreshToken();
      if (!refreshToken) {
        throw { success: false, message: 'No hay token de refresh' };
      }

      const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });

      // Actualizar tokens
      if (response.data.success && response.data.tokens) {
        tokenUtils.setTokens(
          response.data.tokens.accessToken,
          response.data.tokens.refreshToken
        );
      }

      return response.data;
    } catch (error: any) {
      // Si falla el refresh, limpiar tokens
      tokenUtils.clearTokens();
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return tokenUtils.isAuthenticated();
  },

  // Limpiar sesión
  clearSession: (): void => {
    tokenUtils.clearTokens();
  },

  // Cambiar contraseña
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse> => {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Solicitar restablecimiento de contraseña
  forgotPassword: async (data: ForgotPasswordData): Promise<ApiResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  // Restablecer contraseña con código
  resetPassword: async (data: ResetPasswordData): Promise<ApiResponse> => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },
}; 