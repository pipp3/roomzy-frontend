import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  helpText?: string;
  children: ReactNode;
  required?: boolean;
}

export default function FormField({ 
  label, 
  htmlFor, 
  error, 
  helpText, 
  children, 
  required = false 
}: FormFieldProps) {
  return (
    <div>
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : helpText ? (
        <p id={`${htmlFor}-help`} className="mt-1 text-sm text-slate-500">
          {helpText}
        </p>
      ) : null}
    </div>
  );
} 