// Exportar todos los servicios desde aquí para facilitar las importaciones
export { authService } from './authService';
export { api, apiClient, tokenUtils } from './apiClient';
export type { ApiResponse } from './apiClient';
export type { User, LoginData, RegisterData, VerifyEmailData, ResendCodeData } from './authService';

// Aquí puedes agregar más servicios en el futuro:
// export { userService } from './userService';
// export { propertyService } from './propertyService';
// export { notificationService } from './notificationService'; 