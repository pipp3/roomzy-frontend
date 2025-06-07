'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface AdminRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

const AdminRoute = ({ 
  children, 
  redirectTo = '/inicio',
  fallback 
}: AdminRouteProps) => {
  const router = useRouter();
  
  // 🎯 Selectores optimizados
  const { isAuthenticated, isLoading } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    }))
  );
  
  const { refreshUser } = useAuthStore(
    useShallow((state) => ({
      refreshUser: state.refreshUser,
    }))
  );
  
  const user = useAuthStore((state) => state.user);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const checkAuth = async () => {
      // Si no hay usuario pero hay tokens, intentar refrescar
      if (!user && !isLoading) {
        await refreshUser();
      }
    };

    checkAuth();
  }, [user, isLoading, refreshUser]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Verificar si es admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      router.push(redirectTo);
    }
  }, [isAuthenticated, user, router, redirectTo]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  // Mostrar página de acceso denegado si no es admin
  if (user && user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Acceso Denegado
              </h2>
              <p className="text-slate-600 mb-4">
                No tienes permisos de administrador para acceder a esta página
              </p>
              <button
                onClick={() => router.push(redirectTo)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors duration-200"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mostrar contenido protegido para admin
  return <>{children}</>;
};

export default AdminRoute; 