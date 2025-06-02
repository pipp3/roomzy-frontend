'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores';

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  requireEmailVerification = false,
  redirectTo = '/login',
  fallback 
}: ProtectedRouteProps) => {
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
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Verificar si requiere verificación de email
  useEffect(() => {
    if (
      requireEmailVerification && 
      isAuthenticated && 
      user && 
      !user.isEmailVerified
    ) {
      router.push('/verify-email');
    }
  }, [requireEmailVerification, isAuthenticated, user, router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está autenticado (se está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar email si es requerido
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return null; // Se está redirigiendo a verificación
  }

  // Mostrar contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute; 