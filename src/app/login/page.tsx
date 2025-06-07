'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

// Importar tipos y schemas
import { loginSchema, type LoginFormData } from '@/types/auth';
import { getInputClasses } from '@/utils/form';

// Importar store de Zustand
import { useAuthStore } from '@/stores';

// Importar componentes
import { 
  AuthLayout, 
  AuthHeader, 
  ErrorAlert, 
  SuccessAlert, 
  FormField, 
  PasswordInput, 
  LoadingButton,
  LoginIcon 
} from '@/components';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  
  // 🎯 Selectores de Zustand optimizados con useShallow
  const { login } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
    }))
  );
  
  const { isLoggingIn } = useAuthStore(
    useShallow((state) => ({
      isLoggingIn: state.isLoggingIn,
    }))
  );
  
  const error = useAuthStore((state) => state.error);
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Verificar si viene de verificación exitosa
  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      setShowVerificationSuccess(true);
      toast.success('¡Email verificado exitosamente!', {
        description: 'Ahora puedes iniciar sesión con tu cuenta.',
        duration: 5000,
      });
    }
  }, [searchParams]);

  // Redirigir si ya está autenticado
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir a admin dashboard si es admin, sino al dashboard normal
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/inicio');
      }
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Enviando datos de login:', data);
      
      const result = await login(data);
      
      if (result.success) {
        if (result.requiresEmailVerification) {
          toast.info('Verificación requerida', {
            description: 'Debes verificar tu email antes de continuar.',
          });
          router.push('/verify-email');
        } else {
          // Obtener el usuario actualizado del store para determinar redirección
          const currentUser = useAuthStore.getState().user;
          
          toast.success('¡Bienvenido de vuelta!', {
            description: 'Has iniciado sesión exitosamente.',
          });
          
          // Redirigir según el rol del usuario
          if (currentUser?.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/inicio');
          }
        }
        reset();
      } else {
        toast.error('Error en el login', {
          description: result.message,
        });
      }
      
    } catch (error: any) {
      console.error('Error en el login:', error);
      
      toast.error('Error al iniciar sesión', {
        description: error.message || 'Hubo un problema al procesar tu login. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Iniciar sesión"
        subtitle="Bienvenido de vuelta a Roomzy"
        icon={<LoginIcon />}
      />

      {/* Mensaje de verificación exitosa */}
      {showVerificationSuccess && (
        <SuccessAlert
          title="¡Email verificado exitosamente!"
          message="Tu cuenta está completamente configurada. Ahora puedes iniciar sesión."
          onDismiss={() => setShowVerificationSuccess(false)}
        />
      )}

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
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </FormField>

        {/* Contraseña */}
        <FormField
          label="Contraseña"
          htmlFor="password"
          error={errors.password?.message}
          required
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {/* Botón de envío */}
        <LoadingButton
          type="submit"
          isLoading={isLoggingIn}
          loadingText="Iniciando sesión..."
        >
          Iniciar sesión
        </LoadingButton>
      </form>

      {/* Enlaces adicionales */}
      <div className="mt-6 space-y-4">
        {/* Enlace para recuperar contraseña */}
        <div className="text-center">
          <Link 
            href="/forgot-password" 
            className="text-sm text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 rounded-lg px-1 transition-colors duration-200"
            tabIndex={0}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Separador */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">o</span>
          </div>
        </div>

        {/* Enlace para registro */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              href="/register" 
              className="font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 rounded-lg px-1 transition-colors duration-200"
              tabIndex={0}
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Información de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🚀 Estado de Zustand</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Iniciando sesión: {isLoggingIn ? '✅' : '❌'}</p>
            <p>• Error: {error || 'Ninguno'}</p>
            <p>• Autenticado: {isAuthenticated ? '✅' : '❌'}</p>
            <p>• Verificación exitosa: {showVerificationSuccess ? '✅' : '❌'}</p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginPage; 