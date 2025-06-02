import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { authService } from '@/services/authService';
import type { User, RegisterData, LoginData, VerifyEmailData, ResendCodeData, ChangePasswordData, ForgotPasswordData, ResetPasswordData } from '@/services/authService';

// Tipos para el estado de autenticación
interface AuthState {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Estados específicos para diferentes operaciones
  isRegistering: boolean;
  isLoggingIn: boolean;
  isVerifyingEmail: boolean;
  isResendingCode: boolean;
  isChangingPassword: boolean;
  isForgotPasswordLoading: boolean;
  isResetPasswordLoading: boolean;
  
  // Datos temporales para el flujo de registro
  pendingVerificationEmail: string | null;
  requiresEmailVerification: boolean;
}

// Tipos para las acciones
interface AuthActions {
  // Acciones de autenticación
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; message: string; requiresEmailVerification?: boolean }>;
  verifyEmail: (data: VerifyEmailData) => Promise<{ success: boolean; message: string }>;
  resendVerificationCode: (data: ResendCodeData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (data: ForgotPasswordData) => Promise<{ success: boolean; message: string }>;
  resetPassword: (data: ResetPasswordData) => Promise<{ success: boolean; message: string }>;
  
  // Acciones para limpiar estado
  clearError: () => void;
  clearPendingVerification: () => void;
  
  // Acciones internas
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type AuthStore = AuthState & AuthActions;

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRegistering: false,
  isLoggingIn: false,
  isVerifyingEmail: false,
  isResendingCode: false,
  isChangingPassword: false,
  isForgotPasswordLoading: false,
  isResetPasswordLoading: false,
  pendingVerificationEmail: null,
  requiresEmailVerification: false,
};

// Store principal de autenticación
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // 🔐 REGISTRO DE USUARIO
        register: async (data: RegisterData) => {
          set((state) => {
            state.isRegistering = true;
            state.error = null;
          });

          try {
            const response = await authService.register(data);
            
            set((state) => {
              state.isRegistering = false;
              if (response.success) {
                // Guardar email para verificación posterior
                state.pendingVerificationEmail = data.email;
                state.requiresEmailVerification = true;
              }
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isRegistering = false;
              state.error = error.message || 'Error en el registro';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // 🔑 LOGIN DE USUARIO
        login: async (data: LoginData) => {
          set((state) => {
            state.isLoggingIn = true;
            state.error = null;
          });

          try {
            const response = await authService.login(data);
            
            set((state) => {
              state.isLoggingIn = false;
              if (response.success && response.user) {
                state.user = response.user;
                state.isAuthenticated = true;
                state.requiresEmailVerification = response.requiresEmailVerification || false;
                state.pendingVerificationEmail = response.requiresEmailVerification ? data.email : null;
              }
            });

            return {
              success: response.success,
              message: response.message,
              requiresEmailVerification: response.requiresEmailVerification,
            };
          } catch (error: any) {
            set((state) => {
              state.isLoggingIn = false;
              state.error = error.message || 'Error en el login';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // ✅ VERIFICAR EMAIL
        verifyEmail: async (data: VerifyEmailData) => {
          set((state) => {
            state.isVerifyingEmail = true;
            state.error = null;
          });

          try {
            const response = await authService.verifyEmail(data);
            
            set((state) => {
              state.isVerifyingEmail = false;
              if (response.success && response.user) {
                state.user = response.user;
                state.isAuthenticated = true;
                state.requiresEmailVerification = false;
                state.pendingVerificationEmail = null;
              }
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isVerifyingEmail = false;
              state.error = error.message || 'Error verificando email';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // 📧 REENVIAR CÓDIGO
        resendVerificationCode: async (data: ResendCodeData) => {
          set((state) => {
            state.isResendingCode = true;
            state.error = null;
          });

          try {
            const response = await authService.resendVerificationCode(data);
            
            set((state) => {
              state.isResendingCode = false;
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isResendingCode = false;
              state.error = error.message || 'Error reenviando código';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // 🚪 LOGOUT
        logout: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            await authService.logout();
          } catch (error) {
            console.error('Error en logout:', error);
          } finally {
            set((state) => {
              // Limpiar todo el estado
              Object.assign(state, initialState);
            });
          }
        },

        // 🔄 REFRESCAR USUARIO
        refreshUser: async () => {
          if (!authService.isAuthenticated()) {
            set((state) => {
              Object.assign(state, initialState);
            });
            return;
          }

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.getCurrentUser();
            
            set((state) => {
              state.isLoading = false;
              if (response.success && response.user) {
                state.user = response.user;
                state.isAuthenticated = true;
              } else {
                Object.assign(state, initialState);
              }
            });
          } catch (error: any) {
            console.error('Error obteniendo usuario:', error);
            set((state) => {
              Object.assign(state, initialState);
            });
          }
        },

        // 🧹 LIMPIAR ERROR
        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        // 🧹 LIMPIAR VERIFICACIÓN PENDIENTE
        clearPendingVerification: () => {
          set((state) => {
            state.pendingVerificationEmail = null;
            state.requiresEmailVerification = false;
          });
        },

        // ⚙️ SETTERS INTERNOS
        setUser: (user: User | null) => {
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },

        // 🔧 CAMBIAR CONTRASEÑA
        changePassword: async (data: ChangePasswordData) => {
          set((state) => {
            state.isChangingPassword = true;
            state.error = null;
          });

          try {
            const response = await authService.changePassword(data);
            
            set((state) => {
              state.isChangingPassword = false;
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isChangingPassword = false;
              state.error = error.message || 'Error cambiando contraseña';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // 🔑 OLVIDÉ MI CONTRASEÑA
        forgotPassword: async (data: ForgotPasswordData) => {
          set((state) => {
            state.isForgotPasswordLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.forgotPassword(data);
            
            set((state) => {
              state.isForgotPasswordLoading = false;
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isForgotPasswordLoading = false;
              state.error = error.message || 'Error olvidando contraseña';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },

        // 🔄 RESETAR CONTRASEÑA
        resetPassword: async (data: ResetPasswordData) => {
          set((state) => {
            state.isResetPasswordLoading = true;
            state.error = null;
          });

          try {
            const response = await authService.resetPassword(data);
            
            set((state) => {
              state.isResetPasswordLoading = false;
            });

            return {
              success: response.success,
              message: response.message,
            };
          } catch (error: any) {
            set((state) => {
              state.isResetPasswordLoading = false;
              state.error = error.message || 'Error reseteando contraseña';
            });

            return {
              success: false,
              message: error.message || 'Error de conexión',
            };
          }
        },
      })),
      {
        name: 'roomzy-auth-storage',
        storage: createJSONStorage(() => localStorage),
        // Solo persistir datos importantes, no estados de loading
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          pendingVerificationEmail: state.pendingVerificationEmail,
          requiresEmailVerification: state.requiresEmailVerification,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

// 🎯 SELECTORES OPTIMIZADOS CON useShallow
// Estos selectores evitan re-renders innecesarios usando shallow comparison
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () => useAuthStore(
  useShallow((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }))
);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthLoadingStates = () => useAuthStore(
  useShallow((state) => ({
    isRegistering: state.isRegistering,
    isLoggingIn: state.isLoggingIn,
    isVerifyingEmail: state.isVerifyingEmail,
    isResendingCode: state.isResendingCode,
    isChangingPassword: state.isChangingPassword,
    isForgotPasswordLoading: state.isForgotPasswordLoading,
    isResetPasswordLoading: state.isResetPasswordLoading,
  }))
);
export const useAuthVerification = () => useAuthStore(
  useShallow((state) => ({
    pendingVerificationEmail: state.pendingVerificationEmail,
    requiresEmailVerification: state.requiresEmailVerification,
  }))
);

// 🎬 ACCIONES OPTIMIZADAS
export const useAuthActions = () => useAuthStore(
  useShallow((state) => ({
    register: state.register,
    login: state.login,
    verifyEmail: state.verifyEmail,
    resendVerificationCode: state.resendVerificationCode,
    logout: state.logout,
    refreshUser: state.refreshUser,
    clearError: state.clearError,
    clearPendingVerification: state.clearPendingVerification,
    changePassword: state.changePassword,
    forgotPassword: state.forgotPassword,
    resetPassword: state.resetPassword,
  }))
); 