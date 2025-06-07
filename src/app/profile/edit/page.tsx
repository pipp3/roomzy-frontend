'use client';

import { useRouter } from 'next/navigation';
import EditProfileForm from '@/components/profile/EditProfileForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ArrowLeft } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/profile');
  };

  const handleSuccess = () => {
    router.push('/profile');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header con navegación */}
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver al perfil
              </button>
              
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-emerald-600">Editar Perfil</h1>
                <p className="mt-2 text-slate-600">
                  Actualiza tu información personal y preferencias
                </p>
              </div>
            </div>

            {/* Formulario de edición */}
            <EditProfileForm 
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 