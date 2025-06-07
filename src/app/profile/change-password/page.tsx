'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

// Importar tipos y schemas
import { changePasswordSchema, type ChangePasswordFormData } from '@/types/auth';

// Importar store de Zustand
import { useAuthStore } from '@/stores';

// Importar componentes
import { 
  ProtectedRoute,
  ErrorAlert, 
  FormField, 
  PasswordInput, 
  LoadingButton
} from '@/components';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ChangePasswordPage = () => {
  const router = useRouter();
  
  // 🎯 Selectores de Zustand optimizados con useShallow
  const { changePassword } = useAuthStore(
    useShallow((state) => ({
      changePassword: state.changePassword,
    }))
  );
  
  const { isChangingPassword } = useAuthStore(
    useShallow((state) => ({
      isChangingPassword: state.isChangingPassword,
    }))
  );
  
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      console.log('Enviando datos de cambio de contraseña');
      
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      if (result.success) {
        toast.success('¡Contraseña actualizada!', {
          description: 'Tu contraseña ha sido cambiada exitosamente.',
        });
        reset();
        router.push('/profile');
      } else {
        toast.error('Error al cambiar contraseña', {
          description: result.message,
        });
      }
      
    } catch (error: any) {
      console.error('Error cambiando contraseña:', error);
      
      toast.error('Error al cambiar contraseña', {
        description: error.message || 'Hubo un problema al cambiar tu contraseña. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <ProtectedRoute requireEmailVerification={true}>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header de la página */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Link 
                  href="/profile" 
                  className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 rounded-lg px-2 py-1 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Volver al perfil
                </Link>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-emerald-600">
                    Cambiar contraseña
                  </h1>
                  <p className="text-slate-600">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </p>
                </div>
              </div>
            </div>

            {/* Contenedor del formulario centrado */}
            <div className="max-w-2xl mx-auto">
              {/* Card principal */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-6">
                  {/* Mostrar error del store si existe */}
                  <ErrorAlert error={error} />

                  {/* Formulario */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                    {/* Contraseña actual */}
                    <FormField
                      label="Contraseña actual"
                      htmlFor="currentPassword"
                      error={errors.currentPassword?.message}
                      required
                    >
                      <PasswordInput
                        id="currentPassword"
                        autoComplete="current-password"
                        placeholder="Ingresa tu contraseña actual"
                        error={!!errors.currentPassword}
                        {...register('currentPassword')}
                      />
                    </FormField>

                    {/* Nueva contraseña */}
                    <FormField
                      label="Nueva contraseña"
                      htmlFor="newPassword"
                      error={errors.newPassword?.message}
                      helpText="Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas y números"
                      required
                    >
                      <PasswordInput
                        id="newPassword"
                        autoComplete="new-password"
                        placeholder="Ingresa tu nueva contraseña"
                        error={!!errors.newPassword}
                        {...register('newPassword')}
                      />
                    </FormField>

                    {/* Confirmar nueva contraseña */}
                    <FormField
                      label="Confirmar nueva contraseña"
                      htmlFor="confirmPassword"
                      error={errors.confirmPassword?.message}
                      required
                    >
                      <PasswordInput
                        id="confirmPassword"
                        autoComplete="new-password"
                        placeholder="Confirma tu nueva contraseña"
                        error={!!errors.confirmPassword}
                        {...register('confirmPassword')}
                      />
                    </FormField>

                    {/* Botón de envío */}
                    <LoadingButton
                      type="submit"
                      isLoading={isChangingPassword}
                      loadingText="Cambiando contraseña..."
                    >
                      Cambiar contraseña
                    </LoadingButton>
                  </form>
                </div>
              </div>

              {/* Información de seguridad */}
              <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Consejos de seguridad
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Usa una contraseña única que no hayas usado antes</li>
                        <li>Combina letras mayúsculas, minúsculas, números y símbolos</li>
                        <li>Evita información personal como nombres o fechas</li>
                        <li>Considera usar un gestor de contraseñas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default ChangePasswordPage; 