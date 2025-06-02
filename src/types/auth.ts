import { z } from 'zod';

// Schema de validación para registro
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),
  
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido')
    .max(100, 'El email no puede exceder 100 caracteres')
    .toLowerCase(),
  
  region: z
    .string()
    .min(1, 'La región es requerida'),
  
  city: z
    .string()
    .min(1, 'La comuna es requerida'),
  
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .length(9, 'El teléfono debe tener exactamente 9 dígitos')
    .regex(/^9[0-9]{8}$/, 'El teléfono debe comenzar con 9 y tener 9 dígitos (ej: 987654321)'),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Schema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

// Schema de validación para reset password
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido')
    .toLowerCase(),
  
  code: z
    .string()
    .min(1, 'El código de verificación es requerido')
    .length(6, 'El código debe tener exactamente 6 caracteres')
    .regex(/^[A-Z0-9]{6}$/, 'El código debe contener solo letras mayúsculas y números'),
  
  newPassword: z
    .string()
    .min(1, 'La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Tipos inferidos de los schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Tipos para el usuario (basados en el modelo del backend)
export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  region: string;
  city: string;
  phone: string;
  bio?: string;
  habits?: string;
  profilePhoto?: string;
  role: 'admin' | 'seeker' | 'host';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para respuestas de API
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
} 