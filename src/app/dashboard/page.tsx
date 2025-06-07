'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminService, UserStatsResponse } from '@/services/adminService';
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp,
  AlertCircle,
  Shield 
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatsCard({ title, value, icon: Icon, description, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-100',
    green: 'bg-emerald-500 text-emerald-100',
    yellow: 'bg-yellow-500 text-yellow-100',
    purple: 'bg-purple-500 text-purple-100'
  };

  const bgColorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-emerald-50 border-emerald-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 border ${bgColorClasses[color]} hover:shadow-xl transition-shadow duration-300`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function LoadingStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white shadow-lg rounded-lg p-6 border animate-pulse">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-slate-200 w-12 h-12"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { canAccess } = useAdminAuth();
  const [stats, setStats] = useState<UserStatsResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canAccess) {
      loadStats();
    }
  }, [canAccess]);

  async function loadStats() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getUserStats();
      
      if (response.success && response.data) {
        setStats(response.data.stats);
      } else {
        setError('No se pudieron cargar las estadísticas');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  }

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
                  No tienes permisos para acceder al panel de administración.
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
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Panel de Administración
              </h1>
              <p className="text-lg text-slate-600">
                Resumen general del sistema y estadísticas de usuarios
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={loadStats}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            {isLoading ? (
              <LoadingStats />
            ) : stats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total de Usuarios"
                  value={stats.totalUsers}
                  icon={Users}
                  description="Usuarios registrados"
                  color="blue"
                />
                <StatsCard
                  title="Usuarios Verificados"
                  value={stats.verifiedUsers}
                  icon={UserCheck}
                  description="Emails verificados"
                  color="green"
                />
                <StatsCard
                  title="Sin Verificar"
                  value={stats.unverifiedUsers}
                  icon={UserX}
                  description="Pendientes verificación"
                  color="yellow"
                />
                <StatsCard
                  title="Administradores"
                  value={stats.usersByRole.admin}
                  icon={TrendingUp}
                  description="Usuarios admin"
                  color="purple"
                />
              </div>
            ) : null}

            {/* Detailed Stats */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Users by Role */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Usuarios por Rol
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Buscadores (Seekers)</span>
                      <span className="font-semibold text-slate-900">
                        {stats.usersByRole.seeker.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Anfitriones (Hosts)</span>
                      <span className="font-semibold text-slate-900">
                        {stats.usersByRole.host.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Administradores</span>
                      <span className="font-semibold text-slate-900">
                        {stats.usersByRole.admin.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Estado de Verificación
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-slate-600">Verificados</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats.verifiedUsers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserX className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-slate-600">Sin verificar</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {stats.unverifiedUsers.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-sm text-slate-500">
                        Tasa de verificación:{' '}
                        <span className="font-medium text-slate-700">
                          {((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => router.push('/dashboard/admin/usuarios')}
                  className="p-4 border cursor-pointer border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left hover:shadow-md"
                >
                  <Users className="h-6 w-6 text-blue-500 mb-2" />
                  <h4 className="font-medium text-slate-900">Gestionar Usuarios</h4>
                  <p className="text-sm text-slate-600">Ver, crear y editar usuarios</p>
                </button>
                <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left hover:shadow-md opacity-50 cursor-not-allowed">
                  <UserCheck className="h-6 w-6 text-green-500 mb-2" />
                  <h4 className="font-medium text-slate-900">Verificaciones</h4>
                  <p className="text-sm text-slate-600">Próximamente disponible</p>
                </button>
                <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left hover:shadow-md opacity-50 cursor-not-allowed">
                  <TrendingUp className="h-6 w-6 text-purple-500 mb-2" />
                  <h4 className="font-medium text-slate-900">Reportes</h4>
                  <p className="text-sm text-slate-600">Próximamente disponible</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 