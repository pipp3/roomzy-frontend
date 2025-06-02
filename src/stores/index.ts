// 🏪 STORES
export { useAuthStore } from './authStore';

// 🎯 SELECTORES OPTIMIZADOS
export {
  useAuthUser,
  useAuthStatus,
  useAuthError,
  useAuthLoadingStates,
  useAuthVerification,
  useAuthActions,
} from './authStore';

// 📝 TIPOS
export type { User, RegisterData, LoginData, VerifyEmailData, ResendCodeData } from '@/services/authService';

// Aquí puedes agregar más stores en el futuro:
// export { useUserStore, useUserActions } from './userStore';
// export { usePropertyStore, usePropertyActions } from './propertyStore';
// export { useNotificationStore, useNotificationActions } from './notificationStore'; 