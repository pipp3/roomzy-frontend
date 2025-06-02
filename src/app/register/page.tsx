'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

// Importar tipos y schemas
import { registerSchema, type RegisterFormData } from '@/types/auth';
import { getInputClasses } from '@/utils/form';

// Importar store de Zustand
import { useAuthStore } from '@/stores';
import type { RegisterData } from '@/stores';

// Importar componentes
import { 
  AuthLayout, 
  AuthHeader, 
  ErrorAlert, 
  FormField, 
  PasswordInput, 
  LoadingButton,
  RegionCitySelector,
  PhoneInput,
  RegisterIcon 
} from '@/components';

const RegisterPage = () => {
  const router = useRouter();
  
  // 🎯 Selectores de Zustand optimizados con useShallow
  const { register: registerUser } = useAuthStore(
    useShallow((state) => ({
      register: state.register,
    }))
  );
  
  const { isRegistering } = useAuthStore(
    useShallow((state) => ({
      isRegistering: state.isRegistering,
    }))
  );
  
  const error = useAuthStore((state) => state.error);
  
  const { pendingVerificationEmail, requiresEmailVerification } = useAuthStore(
    useShallow((state) => ({
      pendingVerificationEmail: state.pendingVerificationEmail,
      requiresEmailVerification: state.requiresEmailVerification,
    }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const selectedRegion = watch('region');
  const selectedCity = watch('city');

  // Efecto para redirigir a verificación si es necesario
  useEffect(() => {
    if (requiresEmailVerification && pendingVerificationEmail) {
      toast.success('¡Registro exitoso!', {
        description: 'Revisa tu email para verificar tu cuenta.',
      });
      router.push('/verify-email');
    }
  }, [requiresEmailVerification, pendingVerificationEmail, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Mapear datos del formulario al formato de la API
      const registerData: RegisterData = {
        name: data.firstName,
        lastName: data.lastName,
        email: data.email,
        region: data.region,
        city: data.city,
        phone: data.phone,
        password: data.password,
        role: 'seeker', // Por defecto seeker, podrías agregar un campo para esto
      };

      const result = await registerUser(registerData);
      
      if (result.success) {
        // El efecto se encargará de la redirección
        reset();
      } else {
        toast.error('Error en el registro', {
          description: result.message,
        });
      }
      
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      toast.error('Error al crear la cuenta', {
        description: error.message || 'Hubo un problema al procesar tu registro. Inténtalo de nuevo.',
      });
    }
  };

  return (
    <AuthLayout maxWidth="lg">
      <AuthHeader
        title="Crear cuenta"
        subtitle="Únete a Roomzy y encuentra tu hogar ideal"
        icon={<RegisterIcon />}
      />

      {/* Mostrar error del store si existe */}
      <ErrorAlert error={error} />

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Nombre"
            htmlFor="firstName"
            error={errors.firstName?.message}
            required
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              className={getInputClasses(!!errors.firstName)}
              placeholder="Tu nombre"
            />
          </FormField>

          <FormField
            label="Apellido"
            htmlFor="lastName"
            error={errors.lastName?.message}
            required
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              className={getInputClasses(!!errors.lastName)}
              placeholder="Tu apellido"
            />
          </FormField>
        </div>

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
          />
        </FormField>

        {/* Región y Comuna */}
        <RegionCitySelector
          regionValue={selectedRegion || ''}
          cityValue={selectedCity || ''}
          onRegionChange={(value) => setValue('region', value)}
          onCityChange={(value) => setValue('city', value)}
          regionError={errors.region?.message}
          cityError={errors.city?.message}
          disabled={isRegistering}
        />

        {/* Teléfono */}
        <FormField
          label="Teléfono"
          htmlFor="phone"
          error={errors.phone?.message}
          helpText="Ingresa solo los 9 dígitos de tu celular (ej: 987654321)"
          required
        >
          <PhoneInput
            id="phone"
            error={!!errors.phone}
            disabled={isRegistering}
            {...register('phone')}
          />
        </FormField>

        {/* Contraseña */}
        <FormField
          label="Contraseña"
          htmlFor="password"
          error={errors.password?.message}
          helpText="Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número"
          required
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            error={!!errors.password}
            disabled={isRegistering}
            {...register('password')}
          />
        </FormField>

        {/* Confirmar Contraseña */}
        <FormField
          label="Confirmar contraseña"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            error={!!errors.confirmPassword}
            disabled={isRegistering}
            {...register('confirmPassword')}
          />
        </FormField>

        {/* Botón de envío */}
        <LoadingButton
          type="submit"
          isLoading={isRegistering}
          loadingText="Creando cuenta..."
        >
          Crear cuenta
        </LoadingButton>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            href="/login" 
            className="font-semibold text-emerald-600 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 rounded-lg px-1 transition-colors duration-200"
            tabIndex={0}
          >
            Inicia sesión
          </Link>
        </p>
      </div>

      {/* Información de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🚀 Estado de Zustand</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Registrando: {isRegistering ? '✅' : '❌'}</p>
            <p>• Error: {error || 'Ninguno'}</p>
            <p>• Email pendiente: {pendingVerificationEmail || 'Ninguno'}</p>
            <p>• Requiere verificación: {requiresEmailVerification ? '✅' : '❌'}</p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default RegisterPage; 