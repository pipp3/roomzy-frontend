'use client';

import { useAuthStore } from '@/stores/authStore';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminFloatingButton() {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  // Solo mostrar si el usuario es admin y no está ya en el dashboard
  if (!user || user.role !== 'admin' || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/dashboard"
        className="flex items-center justify-center w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        title="Ir al Panel de Administración"
      >
        <Shield className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        
        {/* Tooltip */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Panel de Admin
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </Link>
    </div>
  );
} 