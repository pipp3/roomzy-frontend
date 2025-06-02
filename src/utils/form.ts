import { KeyboardEvent } from 'react';

/**
 * Maneja eventos de teclado para botones (Enter y Espacio)
 * @param e - Evento de teclado
 */
export const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (form) {
      form.requestSubmit();
    }
  }
};

/**
 * Genera clases CSS para inputs basado en el estado de error
 * @param hasError - Si el campo tiene error
 * @param baseClasses - Clases base del input
 * @returns String con las clases CSS
 */
export const getInputClasses = (
  hasError: boolean,
  baseClasses: string = 'w-full px-4 py-3 border-2 text-black rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200'
): string => {
  const errorClasses = hasError 
    ? 'border-red-400 bg-red-50/50' 
    : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50';
  
  return `${baseClasses} ${errorClasses}`;
};

/**
 * Genera clases CSS para selectores basado en el estado de error y habilitado
 * @param hasError - Si el campo tiene error
 * @param isDisabled - Si el campo está deshabilitado
 * @param baseClasses - Clases base del selector
 * @returns String con las clases CSS
 */
export const getSelectClasses = (
  hasError: boolean,
  isDisabled: boolean = false,
  baseClasses: string = 'w-full px-4 py-3 border-2 text-black rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200'
): string => {
  const errorClasses = hasError 
    ? 'border-red-400 bg-red-50/50' 
    : 'border-slate-200 hover:border-emerald-300 bg-slate-50/50';
  
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return `${baseClasses} ${errorClasses} ${disabledClasses}`.trim();
};

/**
 * Genera clases CSS para botones de envío basado en el estado de carga
 * @param isSubmitting - Si el formulario se está enviando
 * @param baseClasses - Clases base del botón
 * @returns String con las clases CSS
 */
export const getSubmitButtonClasses = (
  isSubmitting: boolean,
  baseClasses: string = 'w-full py-3 px-4 rounded-xl hover:cursor-pointer font-semibold text-white transition-all duration-300 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 shadow-lg'
): string => {
  const stateClasses = isSubmitting
    ? 'bg-slate-400 cursor-not-allowed shadow-none'
    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 hover:shadow-xl hover:shadow-emerald-500/25';
  
  return `${baseClasses} ${stateClasses}`;
}; 