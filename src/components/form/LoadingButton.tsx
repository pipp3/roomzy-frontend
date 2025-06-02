import { ReactNode } from 'react';
import { getSubmitButtonClasses } from '@/utils/form';

interface LoadingButtonProps {
  type?: 'button' | 'submit' | 'reset';
  isLoading: boolean;
  disabled?: boolean;
  children: ReactNode;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'custom';
}

export default function LoadingButton({
  type = 'button',
  isLoading,
  disabled,
  children,
  loadingText = 'Cargando...',
  onClick,
  className,
  variant = 'primary'
}: LoadingButtonProps) {
  // Si variant es 'custom', usar solo la className proporcionada
  // Si no, usar los estilos por defecto y agregar className adicional si existe
  const buttonClassName = variant === 'custom' 
    ? className || ''
    : `${getSubmitButtonClasses(isLoading)} ${className || ''}`.trim();

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={buttonClassName}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
} 