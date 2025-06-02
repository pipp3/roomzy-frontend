'use client';

import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';

const DashboardPage = () => {
  // 🎯 Selectores optimizados
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );

  return (
    <ProtectedRoute requireEmailVerification={true}>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-slate-200 rounded-lg p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <svg
                    className="h-8 w-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  ¡Bienvenido a Roomzy!
                </h1>
                
                <p className="text-lg text-slate-600 mb-6">
                  Tu plataforma para encontrar el hogar perfecto
                </p>

                {user && (
                  <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                      Información de tu cuenta
                    </h2>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Nombre:</span>
                        <span className="font-medium text-slate-900">
                          {user.name} {user.lastName}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Email:</span>
                        <span className="font-medium text-slate-900">{user.email}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ubicación:</span>
                        <span className="font-medium text-slate-900">
                          {user.city}, {user.region}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Teléfono:</span>
                        <span className="font-medium text-slate-900">{user.phone}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Rol:</span>
                        <span className="font-medium text-slate-900 capitalize">
                          {user.role === 'seeker' ? 'Buscador' : 'Arrendador'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-600">Estado:</span>
                        <span className={`font-medium ${
                          user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {user.isEmailVerified ? '✓ Verificado' : '⚠ Sin verificar'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contenido adicional */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Buscar Propiedades
                      </h3>
                      <p className="text-sm text-slate-500">
                        Encuentra tu hogar ideal
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Próximamente →
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Publicar Propiedad
                      </h3>
                      <p className="text-sm text-slate-500">
                        Comparte tu espacio
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Próximamente →
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Mi Perfil
                      </h3>
                      <p className="text-sm text-slate-500">
                        Gestiona tu cuenta
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Próximamente →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Información de desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">
                  🚀 Estado de Desarrollo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium mb-2">Autenticación:</p>
                    <ul className="space-y-1">
                      <li>• ✅ Registro de usuarios</li>
                      <li>• ✅ Login con JWT</li>
                      <li>• ✅ Verificación de email</li>
                      <li>• ✅ Refresh tokens</li>
                      <li>• ✅ Rutas protegidas</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Próximas funcionalidades:</p>
                    <ul className="space-y-1">
                      <li>• 🔄 Gestión de propiedades</li>
                      <li>• 🔄 Sistema de búsqueda</li>
                      <li>• 🔄 Mensajería</li>
                      <li>• 🔄 Favoritos</li>
                      <li>• 🔄 Perfil de usuario</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage; 