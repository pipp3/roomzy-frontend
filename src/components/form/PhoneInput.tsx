import { forwardRef } from 'react';

interface PhoneInputProps {
  id: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ id, placeholder = "987654321", error, disabled, maxLength = 9, ...props }, ref) => {
    return (
      <div className="relative flex">
        {/* Prefijo +56 (no editable) */}
        <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium">
          +56
        </div>
        {/* Input para los 9 dígitos */}
        <input
          ref={ref}
          id={id}
          type="tel"
          autoComplete="tel"
          className={`flex-1 px-4 py-3 border text-black rounded-r-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm ${
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-slate-300'
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput; 