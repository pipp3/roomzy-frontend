'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser, useAuthStatus, useAuthActions } from '@/stores/authStore';
import { User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, FileText, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfileView() {
  const user = useAuthUser();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const { refreshUser } = useAuthActions();
  const router = useRouter();

  // Refrescar datos del usuario al montar el componente
  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshUser();
    }
  }, [isAuthenticated, user, refreshUser]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };
  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                No autenticado
              </h2>
              <p className="text-slate-600">
                Debes iniciar sesión para ver tu perfil
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'seeker':
        return 'Roomie';
      case 'host':
        return 'Anfitrión';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-600">Mi Perfil</h1>
            <p className="mt-2 text-slate-600">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          {/* Tarjeta principal del perfil */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header de la tarjeta con foto de perfil */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {user.name} {user.lastName}
                  </h2>
                  <p className="text-emerald-100 flex items-center mt-1">
                    <Shield className="h-4 w-4 mr-2" />
                    {getRoleDisplayName(user.role)}
                  </p>
                  <div className="flex items-center mt-2">
                    {user.isEmailVerified ? (
                      <div className="flex items-center text-green-200">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Email verificado</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-200">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Email pendiente de verificación</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información de contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                    Información de Contacto
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Email</p>
                        <p className="text-slate-900">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Teléfono</p>
                        <p className="text-slate-900">{user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Ubicación</p>
                        <p className="text-slate-900">{user.city}, {user.region}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2">
                    Información de la Cuenta
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Miembro desde</p>
                        <p className="text-slate-900">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-500">Tipo de cuenta</p>
                        <p className="text-slate-900">{getRoleDisplayName(user.role)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {user.isEmailVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-500">Estado del email</p>
                        <p className={`text-sm ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                          {user.isEmailVerified ? 'Verificado' : 'Pendiente de verificación'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Biografía y Hábitos */}
              <div className="mt-8 space-y-6">
                {/* Biografía */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">
                    <FileText className="h-5 w-5 inline mr-2" />
                    Biografía
                  </h3>
                  {user.bio ? (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">{user.bio}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <p className="text-slate-500 italic">
                        No has agregado una biografía aún. 
                        <span className="text-emerald-600 font-medium"> Agrégala para que otros usuarios puedan conocerte mejor.</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Hábitos */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">
                    <Users className="h-5 w-5 inline mr-2" />
                    Hábitos y Estilo de Vida
                  </h3>
                  {user.habits ? (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 leading-relaxed">{user.habits}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <p className="text-slate-500 italic">
                        No has especificado tus hábitos aún. 
                        <span className="text-emerald-600 font-medium"> Es importante para la compatibilidad con futuros compañeros.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleEditProfile}
                    className="flex-1 bg-emerald-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Editar Perfil
                  </button>
                  <button
                  onClick={handleChangePassword}
                  className="flex-1 bg-slate-100 cursor-pointer text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                    Cambiar Contraseña
                  </button>
                  {!user.isEmailVerified && (
                    <button className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                      Verificar Email
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas o información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {user.isEmailVerified ? '✓' : '⏳'}
                </div>
                <p className="text-sm text-slate-600 mt-1">Estado de verificación</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {getRoleDisplayName(user.role)}
                </div>
                <p className="text-sm text-slate-600 mt-1">Tipo de cuenta</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {new Date(user.createdAt).getFullYear()}
                </div>
                <p className="text-sm text-slate-600 mt-1">Año de registro</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 