'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions, useAuthLoadingStates, useAuthError } from '@/stores/authStore';
import { toast } from 'sonner';
import { getInputClasses } from '@/utils/form';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/types/auth';

// Importar componentes
import { 
  AuthLayout, 
  AuthHeader, 
  ErrorAlert, 
  FormField, 
  PasswordInput, 
  LoadingButton,
  LockIcon,
  CheckIcon
} from '@/components';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuthActions();
  const { isResetPasswordLoading } = useAuthLoadingStates();
  const error = useAuthError();

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
  });

  // Obtener email de los parámetros de URL si existe
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const result = await resetPassword({
        email: data.email.trim(),
        code: data.code.trim().toUpperCase(),
        newPassword: data.newPassword,
      });
      
      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);
        reset();
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error de conexión. Inténtalo de nuevo.');
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthHeader
          title="¡Contraseña restablecida!"
          subtitle="Tu contraseña ha sido cambiada exitosamente. Serás redirigido al login en unos segundos..."
          icon={<CheckIcon />}
        />

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
          >
            Ir al login ahora
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Restablecer contraseña"
        subtitle="Ingresa el código que recibiste por email y tu nueva contraseña"
        icon={<LockIcon />}
      />

      {/* Mostrar error del store si existe */}
      <ErrorAlert error={error} />

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email */}
        <FormField
          label="Correo electrónico"
          htmlFor="email"
          error={errors.email?.message}
          required
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={getInputClasses(!!errors.email)}
            placeholder="tu@email.com"
            disabled={isResetPasswordLoading}
          />
        </FormField>

        {/* Código de verificación */}
        <FormField
          label="Código de verificación"
          htmlFor="code"
          error={errors.code?.message}
          helpText="Ingresa el código de 6 caracteres que recibiste por email"
          required
        >
          <input
            id="code"
            type="text"
            {...register('code')}
            className={`${getInputClasses(!!errors.code)} uppercase tracking-widest text-center`}
            placeholder="ABC123"
            maxLength={6}
            disabled={isResetPasswordLoading}
          />
        </FormField>

        {/* Nueva contraseña */}
        <FormField
          label="Nueva contraseña"
          htmlFor="newPassword"
          error={errors.newPassword?.message}
          required
        >
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            error={!!errors.newPassword}
            disabled={isResetPasswordLoading}
            {...register('newPassword')}
          />
        </FormField>

        {/* Confirmar contraseña */}
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
            disabled={isResetPasswordLoading}
            {...register('confirmPassword')}
          />
        </FormField>

        {/* Botón de envío */}
        <LoadingButton
          type="submit"
          isLoading={isResetPasswordLoading}
          loadingText="Restableciendo..."
        >
          Restablecer contraseña
        </LoadingButton>

        {/* Enlaces de navegación */}
        <div className="text-center space-y-3">
          <Link
            href="/forgot-password"
            className="block text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
          >
            ← Solicitar nuevo código
          </Link>
          <div className="text-sm text-slate-500">
            ¿Recordaste tu contraseña?{' '}
            <Link 
              href="/login" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
} 