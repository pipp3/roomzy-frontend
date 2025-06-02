'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthActions, useAuthLoadingStates, useAuthError } from '@/stores/authStore';
import { toast } from 'sonner';

// Importar componentes
import { 
  AuthLayout, 
  AuthHeader, 
  ErrorAlert, 
  FormField, 
  LoadingButton,
  SuccessAlert,
  KeyIcon,
  MailSentIcon
} from '@/components';
import { getInputClasses } from '@/utils/form';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuthActions();
  const { isForgotPasswordLoading } = useAuthLoadingStates();
  const error = useAuthError();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    try {
      const result = await forgotPassword({ email: email.trim() });
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error de conexión. Inténtalo de nuevo.');
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <AuthHeader
          title="¡Email enviado!"
          subtitle="Si tu email existe en nuestro sistema, recibirás un código de restablecimiento en unos minutos."
          icon={<MailSentIcon />}
        />

        {/* Mensaje informativo */}
        <SuccessAlert
          title="Revisa tu email"
          message="Revisa tu bandeja de entrada y también la carpeta de spam."
        />

        {/* Botones de acción */}
        <div className="space-y-4">
          <LoadingButton
            type="button"
            isLoading={false}
            onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
            variant="custom"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Ya tengo el código
          </LoadingButton>

          <LoadingButton
            type="button"
            isLoading={false}
            onClick={() => setIsSubmitted(false)}
            variant="custom"
            className="w-full flex justify-center py-3 px-4 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
          >
            Enviar a otro email
          </LoadingButton>
        </div>

        {/* Enlaces de navegación */}
        <div className="mt-8 text-center space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="¿Olvidaste tu contraseña?"
        subtitle="No te preocupes, te enviaremos un código para restablecerla"
        icon={<KeyIcon />}
      />

      {/* Mostrar error del store si existe */}
      <ErrorAlert error={error} />

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <FormField
          label="Correo electrónico"
          htmlFor="email"
          required
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={getInputClasses(false)}
            placeholder="tu@email.com"
            disabled={isForgotPasswordLoading}
          />
        </FormField>

        <LoadingButton
          type="submit"
          isLoading={isForgotPasswordLoading}
          loadingText="Enviando..."
        >
          Enviar código de restablecimiento
        </LoadingButton>
      </form>

      {/* Enlaces de navegación */}
      <div className="mt-8 text-center space-y-4">
        <Link
          href="/login"
          className="inline-flex items-center text-slate-600 hover:text-emerald-600 text-sm font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al login
        </Link>
        
        <div className="text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link 
            href="/register" 
            className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors duration-200"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
} 