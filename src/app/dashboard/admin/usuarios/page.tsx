'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminService, AdminUser, UsersFilters } from '@/services/adminService';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  AlertCircle,
  Shield,
  Home,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onView: (user: AdminUser) => void;
}

function UserTable({ users, onEdit, onDelete, onView }: UserTableProps) {
  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      seeker: 'bg-blue-100 text-blue-800 border-blue-200',
      host: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    
    const labels = {
      admin: 'Admin',
      seeker: 'Buscador',
      host: 'Anfitrión'
    };

    const icons = {
      admin: Shield,
      seeker: Users,
      host: Home
    };

    const Icon = icons[role as keyof typeof icons] || Users;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        <Icon className="w-3 h-3 mr-1" />
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  const getVerificationStatus = (isVerified: boolean) => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <UserCheck className="w-3 h-3 mr-1" />
          Verificado
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <UserX className="w-3 h-3 mr-1" />
        Pendiente
      </span>
    );
  };

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <Users className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-slate-500">
          No se encontraron usuarios con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-medium text-sm">
                        {user.name.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {user.name} {user.lastName}
                      </div>
                      <div className="text-sm text-slate-500">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{user.email}</div>
                  <div className="text-sm text-slate-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getVerificationStatus(user.isEmailVerified)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{user.city}</div>
                  <div className="text-sm text-slate-500">{user.region}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="text-emerald-600 hover:text-emerald-900 p-1 rounded-md hover:bg-emerald-50 transition-colors"
                      title="Editar usuario"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, totalUsers, limit, onPageChange }: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalUsers);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Mostrando{' '}
            <span className="font-medium">{startItem}</span>
            {' '}-{' '}
            <span className="font-medium">{endItem}</span>
            {' '}de{' '}
            <span className="font-medium">{totalUsers}</span>
            {' '}resultados
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Páginas */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pageNumber === currentPage
                      ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                      : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function ManageUsersPage() {
  const router = useRouter();
  const { canAccess } = useAdminAuth();
  
  // Estados principales
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'seeker' | 'host' | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar usuarios
  const loadUsers = async (filters: UsersFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await adminService.getUsers({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: (roleFilter as 'admin' | 'seeker' | 'host' | undefined) || undefined,
        ...filters,
      });
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setTotalUsers(response.data.pagination.totalUsers);
      } else {
        setError('No se pudieron cargar los usuarios');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    if (canAccess) {
      loadUsers();
    }
  }, [canAccess, currentPage]);

  // Manejar búsqueda
  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers({ page: 1 });
  };

  // Manejar filtro de rol
  const handleRoleFilter = (role: string) => {
    const validRole = role as 'admin' | 'seeker' | 'host' | '';
    setRoleFilter(validRole);
    setCurrentPage(1);
    loadUsers({ page: 1, role: validRole || undefined });
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setCurrentPage(1);
    loadUsers({ page: 1 });
  };

  // Manejar acciones
  const handleView = (user: AdminUser) => {
    router.push(`/dashboard/admin/usuarios/${user.id}`);
  };

  const handleEdit = (user: AdminUser) => {
    router.push(`/dashboard/admin/usuarios/${user.id}/editar`);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`)) {
      return;
    }

    try {
      const response = await adminService.deleteUser(user.id);
      
      if (response.success) {
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      } else {
        toast.error('Error al eliminar el usuario');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar el usuario');
    }
  };

  const handleCreateUser = () => {
    router.push('/dashboard/admin/usuarios/crear');
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
                  No tienes permisos para acceder a la gestión de usuarios.
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
            <div className="mb-8">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-emerald-600">Gestión de Usuarios</h1>
                  <p className="mt-2 text-slate-600">
                    Administra todos los usuarios de la plataforma
                  </p>
                </div>
                <button
                  onClick={handleCreateUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </button>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Búsqueda */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Buscar por nombre, apellido o email..."
                      className="block text-black w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </button>
                </div>
              </div>

              {/* Filtros expandidos */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Filtrar por rol
                      </label>
                      <select
                        value={roleFilter}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="">Todos los roles</option>
                        <option value="admin">Administradores</option>
                        <option value="seeker">Buscadores</option>
                        <option value="host">Anfitriones</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2 flex items-end">
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Estado de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center mb-6">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={() => loadUsers()}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de usuarios */}
            {isLoading ? (
              <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando usuarios...</p>
              </div>
            ) : (
              <>
                <UserTable
                  users={users}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalUsers={totalUsers}
                    limit={limit}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 