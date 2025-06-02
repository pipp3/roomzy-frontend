'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

// Importar store de Zustand
import { useAuthStore } from '@/stores';

// Importar componentes
import { 
  AuthLayout, 
  AuthHeader, 
  ErrorAlert, 
  FormField, 
  LoadingButton,
  EmailIcon 
} from '@/components';

const VerifyEmailPage = () => {
  const router = useRouter();
  
  // 🎯 Selectores de Zustand optimizados con useShallow
  const { 
    verifyEmail, 
    resendVerificationCode, 
    clearPendingVerification 
  } = useAuthStore(
    useShallow((state) => ({
      verifyEmail: state.verifyEmail,
      resendVerificationCode: state.resendVerificationCode,
      clearPendingVerification: state.clearPendingVerification,
    }))
  );
  
  const { isVerifyingEmail, isResendingCode } = useAuthStore(
    useShallow((state) => ({
      isVerifyingEmail: state.isVerifyingEmail,
      isResendingCode: state.isResendingCode,
    }))
  );
  
  const error = useAuthStore((state) => state.error);
  
  const { pendingVerificationEmail, requiresEmailVerification } = useAuthStore(
    useShallow((state) => ({
      pendingVerificationEmail: state.pendingVerificationEmail,
      requiresEmailVerification: state.requiresEmailVerification,
    }))
  );
  
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );

  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  // Redirigir si no hay email pendiente
  useEffect(() => {
    // Si ya está autenticado y verificado, ir al dashboard
    if (isAuthenticated && user?.isEmailVerified) {
      toast.success('¡Email ya verificado!', {
        description: 'Tu cuenta está completamente configurada.',
      });
      // TODO: Descomentar cuando el dashboard esté listo
      // router.push('/dashboard');
      console.log('Email ya verificado - Dashboard pendiente de implementar');
      return;
    }

    // Si no hay verificación pendiente, ir al registro
    if (!pendingVerificationEmail && !requiresEmailVerification) {
      toast.error('No hay verificación pendiente', {
        description: 'Regístrate primero para verificar tu email.',
      });
      router.push('/register');
    }
  }, [isAuthenticated, user, pendingVerificationEmail, requiresEmailVerification, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!pendingVerificationEmail) {
      toast.error('No hay email para verificar');
      return;
    }

    if (!code.trim()) {
      toast.error('Ingresa el código de verificación');
      return;
    }

    try {
      const result = await verifyEmail({
        email: pendingVerificationEmail,
        code: code.trim().toUpperCase(),
      });

      if (result.success) {
        toast.success('¡Email verificado exitosamente!', {
          description: 'Ahora puedes iniciar sesión con tu cuenta.',
          duration: 4000,
        });
        setMessage('✅ ' + result.message);
        
        // Limpiar el estado de verificación pendiente
        clearPendingVerification();
        
        // Redirigir al login con parámetro de verificación exitosa
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 1000);
      } else {
        setMessage('❌ ' + result.message);
        toast.error('Error en la verificación', {
          description: result.message,
        });
      }
    } catch (error: any) {
      setMessage('❌ Error de conexión');
      toast.error('Error de conexión', {
        description: 'No se pudo verificar el email. Inténtalo de nuevo.',
      });
    }
  };

  const handleResend = async () => {
    setMessage('');

    if (!pendingVerificationEmail) {
      toast.error('No hay email para reenviar código');
      return;
    }

    try {
      const result = await resendVerificationCode({
        email: pendingVerificationEmail,
      });

      if (result.success) {
        setMessage('📧 ' + result.message);
        toast.success('Código reenviado', {
          description: 'Revisa tu bandeja de entrada y spam.',
        });
      } else {
        setMessage('❌ ' + result.message);
        toast.error('Error al reenviar', {
          description: result.message,
        });
      }
    } catch (error: any) {
      setMessage('❌ Error de conexión');
      toast.error('Error de conexión', {
        description: 'No se pudo reenviar el código. Inténtalo de nuevo.',
      });
    }
  };

  const handleGoBack = () => {
    clearPendingVerification();
    router.push('/register');
  };

  // No mostrar nada mientras se verifica la redirección
  if (!pendingVerificationEmail && !requiresEmailVerification) {
    return null;
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Verificar Email"
        subtitle={
          <>
            Hemos enviado un código de verificación a:{' '}
            <span className="font-semibold text-emerald-600 block mt-2 text-lg">
              {pendingVerificationEmail}
            </span>
          </>
        }
        icon={<EmailIcon />}
      />

      {/* Mostrar error del store si existe */}
      <ErrorAlert error={error} />

      {/* Formulario de verificación */}
      <form onSubmit={handleVerify} className="space-y-6">
        <FormField
          label="Código de verificación"
          htmlFor="code"
          helpText="Ingresa el código de 6 caracteres que recibiste por email"
          required
        >
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full px-4 text-black py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-center text-lg tracking-widest font-mono"
            placeholder="ABCD12"
            maxLength={6}
            required
            autoComplete="one-time-code"
          />
        </FormField>

        <LoadingButton
          type="submit"
          isLoading={isVerifyingEmail}
          disabled={!code.trim()}
          loadingText="Verificando..."
        >
          Verificar Email
        </LoadingButton>
      </form>

      {/* Botón para reenviar código */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600 mb-3">
          ¿No recibiste el código?
        </p>
        <LoadingButton
          type="button"
          isLoading={isResendingCode}
          loadingText="Reenviando..."
          onClick={handleResend}
          variant="custom"
          className="text-emerald-600 hover:text-emerald-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer bg-transparent border-none shadow-none hover:shadow-none"
        >
          Reenviar código
        </LoadingButton>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
          <p className="text-sm text-center">{message}</p>
        </div>
      )}

      {/* Botón para volver */}
      <div className="mt-8 text-center">
        <button
          onClick={handleGoBack}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200 cursor-pointer"
        >
          ← Volver al registro
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Consejos</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Revisa tu bandeja de entrada y carpeta de spam</li>
          <li>• El código expira en 15 minutos</li>
          <li>• Puedes reenviar el código si no lo recibes</li>
          <li>• Asegúrate de que el email sea correcto</li>
        </ul>
      </div>

      {/* Información de desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">🚀 Estado de Zustand</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• Verificando: {isVerifyingEmail ? '✅' : '❌'}</p>
            <p>• Reenviando: {isResendingCode ? '✅' : '❌'}</p>
            <p>• Error: {error || 'Ninguno'}</p>
            <p>• Email: {pendingVerificationEmail}</p>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default VerifyEmailPage; 