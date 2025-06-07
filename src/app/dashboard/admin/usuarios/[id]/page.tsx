'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminService, AdminUser } from '@/services/adminService';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { canAccess } = useAdminAuth();
  
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = parseInt(params.id as string);

  useEffect(() => {
    if (canAccess && userId) {
      loadUser();
    }
  }, [canAccess, userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminService.getUserById(userId);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        setError('No se pudo cargar la información del usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar el usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/admin/usuarios/${userId}/editar`);
  };

  const handleDelete = async () => {
    if (!user) return;
    
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`)) {
      return;
    }

    try {
      const response = await adminService.deleteUser(user.id);
      
      if (response.success) {
        toast.success('Usuario eliminado exitosamente');
        router.push('/dashboard/admin/usuarios');
      } else {
        toast.error('Error al eliminar el usuario');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el usuario');
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      seeker: 'bg-blue-100 text-blue-800 border-blue-200',
      host: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    
    const labels = {
      admin: 'Administrador',
      seeker: 'Buscador',
      host: 'Anfitrión'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        <Shield className="w-4 h-4 mr-2" />
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  const getVerificationStatus = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <div className="flex items-center">
          <UserCheck className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700 font-medium">Email verificado</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <UserX className="w-5 h-5 text-yellow-500 mr-2" />
        <span className="text-yellow-700 font-medium">Email pendiente de verificación</span>
      </div>
    );
  };

  // Mostrar página de acceso denegado si no es admin
  if (!canAccess) {
    return (
      <ProtectedRoute requireEmailVerification={true}>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">Acceso Restringido</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No tienes permisos para ver esta información.
                </p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireEmailVerification={true}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {isLoading ? 'Cargando...' : user ? `${user.name} ${user.lastName}` : 'Usuario no encontrado'}
                  </h1>
                  <p className="mt-2 text-slate-600">
                    Información detallada del usuario
                  </p>
                </div>
                
                {user && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-emerald-600 rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                    
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Estado de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={loadUser}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando información del usuario...</p>
              </div>
            )}

            {/* Información del usuario */}
            {user && !isLoading && (
              <div className="space-y-6">
                {/* Información básica */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-xl">
                        {user.name.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {user.name} {user.lastName}
                      </h2>
                      <p className="text-slate-600">ID: {user.id}</p>
                    </div>
                    <div className="ml-auto">
                      {getRoleBadge(user.role)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información de contacto */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Información de Contacto
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{user.email}</p>
                            <div className="mt-1">
                              {getVerificationStatus(user.isEmailVerified)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-slate-400 mr-3" />
                          <p className="text-sm text-slate-900">{user.phone}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{user.city}</p>
                            <p className="text-sm text-slate-500">{user.region}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información del sistema */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Información del Sistema
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Rol</p>
                            <p className="text-sm text-slate-900">{user.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Fecha de registro</p>
                            <p className="text-sm text-slate-900">
                              {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Última actualización</p>
                            <p className="text-sm text-slate-900">
                              {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                {(user.bio || user.habits) && (
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Información Adicional
                    </h3>
                    
                    {user.bio && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Biografía</h4>
                        <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md">
                          {user.bio}
                        </p>
                      </div>
                    )}
                    
                    {user.habits && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Hábitos</h4>
                        <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md">
                          {user.habits}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 