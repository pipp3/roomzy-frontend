'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores';
import AdminBadge from '@/components/admin/AdminBadge';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 🎯 Selectores optimizados
  const { logout } = useAuthStore(
    useShallow((state) => ({
      logout: state.logout,
    }))
  );
  
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Tipo para los enlaces de navegación
  type NavigationLink = {
    name: string;
    href: string;
    icon: React.ReactElement;
    isAdmin?: boolean;
  };

  // Enlaces de navegación
  const navigationLinks: NavigationLink[] = [
    {
      name: 'Inicio',
      href: '/inicio',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Buscar Propiedades',
      href: '/propiedades',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      name: 'Publicar Propiedad',
      href: '/publicar',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      name: 'Mi Perfil',
      href: '/profile',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  // Enlaces específicos para admin
  const adminLinks: NavigationLink[] = [
    {
      name: 'Panel Admin',
      href: '/dashboard',
      isAdmin: true,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  // Combinar enlaces según el rol del usuario
  const allNavigationLinks = user?.role === 'admin' 
    ? [...navigationLinks, ...adminLinks] 
    : navigationLinks;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="w-full px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/inicio" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
              Roomzy
            </Link>
          </div>

          {/* Enlaces de navegación - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-6">
              {allNavigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-max ${
                    link.isAdmin
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800 border border-purple-200 shadow-sm'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span className="whitespace-nowrap">{link.name}</span>
                  {link.isAdmin && (
                    <AdminBadge size="sm" variant="minimal" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Información del usuario - Desktop y Tablet */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 min-w-0 flex-shrink-0">
            {user && (
              <>
                <div className="text-sm text-slate-600 text-right hidden lg:block">
                  <div>Bienvenido, <span className="font-semibold text-slate-900">{user.name}</span></div>
                  {/* Estado de verificación */}
                  <div className="mt-1">
                    {user.isEmailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⚠ Sin verificar
                      </span>
                    )}
                  </div>
                </div>

                {/* Información compacta para tablets */}
                <div className="flex lg:hidden items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900">{user.name}</span>
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠
                    </span>
                  )}
                </div>

                {/* Botón de logout */}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 lg:px-5 py-2 lg:py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 whitespace-nowrap"
                >
                  <span className="hidden lg:inline">Cerrar sesión</span>
                  <span className="lg:hidden">Salir</span>
                </button>
              </>
            )}
          </div>

          {/* Navegación compacta para tablets */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            {allNavigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  link.isAdmin
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                }`}
                title={link.name}
              >
                {link.icon}
                <span className="hidden xl:inline">{link.name}</span>
                {link.isAdmin && <AdminBadge size="sm" variant="minimal" />}
              </Link>
            ))}
          </div>

          {/* Menú móvil - Botón */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono hamburguesa */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icono X */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil - Panel */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-50 border-t border-slate-200">
          {/* Enlaces de navegación - Móvil */}
          <div className="space-y-1 mb-4">
            {allNavigationLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  link.isAdmin
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                    : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
                {link.isAdmin && (
                  <AdminBadge size="sm" variant="minimal" />
                )}
              </Link>
            ))}
          </div>

          {/* Información del usuario - Móvil */}
          {user && (
            <>
              <div className="px-3 py-2 border-t border-slate-200">
                <div className="text-sm font-medium text-slate-900">
                  {user.name} {user.lastName}
                </div>
                <div className="text-sm text-slate-500">{user.email}</div>
                <div className="mt-2">
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Email verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠ Email sin verificar
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-3 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 