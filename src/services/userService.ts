import { api, ApiResponse } from './apiClient';
import { User } from '@/types/auth';

export interface UpdateUserProfileData {
  name?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  region?: string;
  bio?: string;
  habits?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  user: User;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export const userService = {
  /**
   * Obtener perfil de usuario por ID
   */
  getUserProfile: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await api.get<User>(`/users/profile/${userId}`);
    return response.data;
  },

  /**
   * Actualizar perfil de usuario
   */
  updateUserProfile: async (
    userId: string, 
    updateData: UpdateUserProfileData
  ): Promise<UpdateUserProfileResponse> => {
    try {
      const response = await api.patch<User>(`/users/profile/${userId}`, updateData);
      
      return {
        success: response.data.success,
        message: response.data.message || 'Perfil actualizado exitosamente',
        user: response.data.user!
      };
    } catch (error: any) {
      // Manejar errores de validación del servidor
      if (error.response?.status === 400 && error.response.data?.errors) {
        return {
          success: false,
          message: error.response.data.message || 'Error de validación',
          user: {} as User,
          errors: error.response.data.errors
        };
      }

      // Manejar otros errores
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al actualizar perfil'
      );
    }
  },

  /**
   * Eliminar usuario
   */
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
}; 