'use client';

import { ReactNode } from 'react';
import { useRequireAdmin } from '@/hooks/useAdminAuth';
import { useAuthActions } from '@/stores/authStore';
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthActions();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      exact: true
    },
    {
      href: '/dashboard/users',
      label: 'Gestión de Usuarios',
      icon: Users,
      exact: false
    },
    {
      href: '/dashboard/settings',
      label: 'Configuración',
      icon: Settings,
      exact: false
    }
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-400">Roomzy</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href, item.exact)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-start px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

function AdminHeader({ user }: { user: any }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Panel de Administración
          </h2>
          <p className="text-sm text-gray-600">
            Gestiona usuarios y configuraciones del sistema
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {user?.name} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {user?.name?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verificando permisos...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, canAccess } = useRequireAdmin();

  if (isLoading || !canAccess) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 