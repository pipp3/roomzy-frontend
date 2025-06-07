import { api } from '@/services/apiClient';
import { ApiResponse } from '@/services/apiClient';
import { User } from '@/services/authService';
import { API_ENDPOINTS } from '@/constants/api';

// Interfaces para los tipos de admin
export interface AdminUser extends User {
  profilePhoto?: string;
}

export interface CreateUserData {
  name: string;
  lastName: string;
  email: string;
  region: string;
  city: string;
  phone: string;
  password: string;
  role: 'admin' | 'seeker' | 'host';
  bio?: string;
  habits?: string;
}

export interface UpdateUserData {
  name?: string;
  lastName?: string;
  email?: string;
  region?: string;
  city?: string;
  phone?: string;
  role?: 'admin' | 'seeker' | 'host';
  bio?: string;
  habits?: string;
  isEmailVerified?: boolean;
}

export interface UsersPaginationResponse {
  users: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UserStatsResponse {
  stats: {
    totalUsers: number;
    usersByRole: {
      admin: number;
      seeker: number;
      host: number;
    };
    verifiedUsers: number;
    unverifiedUsers: number;
  };
}

export interface UsersFilters {
  page?: number;
  limit?: number;
  role?: 'admin' | 'seeker' | 'host';
  search?: string;
}

// Usar endpoints centralizados
const ADMIN_ENDPOINTS = API_ENDPOINTS.ADMIN;

export const adminService = {
  /**
   * Obtener lista de usuarios con paginación y filtros
   */
  getUsers: async (filters: UsersFilters = {}): Promise<ApiResponse<UsersPaginationResponse>> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const url = queryString ? `${ADMIN_ENDPOINTS.USERS}?${queryString}` : ADMIN_ENDPOINTS.USERS;
      
      const response = await api.get<UsersPaginationResponse>(url);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  /**
   * Obtener un usuario por ID
   */
  getUserById: async (id: number): Promise<ApiResponse<{ user: AdminUser }>> => {
    try {
      const response = await api.get<{ user: AdminUser }>(ADMIN_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  /**
   * Crear un nuevo usuario
   */
  createUser: async (userData: CreateUserData): Promise<ApiResponse<{ user: AdminUser }>> => {
    try {
      const response = await api.post<{ user: AdminUser }>(ADMIN_ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  /**
   * Actualizar un usuario
   */
  updateUser: async (id: number, userData: UpdateUserData): Promise<ApiResponse<{ user: AdminUser }>> => {
    try {
      const response = await api.put<{ user: AdminUser }>(ADMIN_ENDPOINTS.USER_BY_ID(id), userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  /**
   * Eliminar un usuario
   */
  deleteUser: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(ADMIN_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },

  /**
   * Obtener estadísticas de usuarios
   */
  getUserStats: async (): Promise<ApiResponse<UserStatsResponse>> => {
    try {
      const response = await api.get<UserStatsResponse>(ADMIN_ENDPOINTS.USER_STATS);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error de conexión' };
    }
  },
}; 