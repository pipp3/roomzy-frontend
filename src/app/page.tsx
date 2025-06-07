'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores';

export default function Home() {
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

  useEffect(() => {
    const handleRedirect = async () => {
      // Si no hay usuario pero podría haber tokens, intentar refrescar
      if (!user && !isLoading) {
        await refreshUser();
      }
      
      // Después de verificar, redirigir según el estado
      if (!isLoading) {
        if (isAuthenticated) {
          router.push('/inicio');
        } else {
          router.push('/login');
        }
      }
    };

    handleRedirect();
  }, [isAuthenticated, isLoading, user, router, refreshUser]);

  // Mostrar loading mientras verifica la autenticación
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Roomzy</h2>
        <p className="text-slate-600">Cargando...</p>
      </div>
    </div>
  );
}
