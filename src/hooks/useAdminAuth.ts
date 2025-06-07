import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook para verificar y manejar autenticación de administrador
 */
export function useAdminAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Si ya terminó de cargar y no está autenticado, redirigir al login
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Si está autenticado pero no es admin, redirigir al inicio
    if (!isLoading && isAuthenticated && user && user.role !== 'admin') {
      router.push('/inicio');
      return;
    }
  }, [user, isAuthenticated, isLoading, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === 'admin',
    canAccess: isAuthenticated && user?.role === 'admin'
  };
}

/**
 * Hook para proteger rutas de admin - versión más estricta
 */
export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading, canAccess } = useAdminAuth();
  
  // Retornar el estado de carga hasta que se determine si puede acceder
  if (isLoading || !canAccess) {
    return {
      user: null,
      isLoading: true,
      canAccess: false
    };
  }

  return {
    user,
    isLoading: false,
    canAccess: true
  };
} 