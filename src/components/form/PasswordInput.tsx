'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getInputClasses } from '@/utils/form';

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  autoComplete?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, placeholder, autoComplete, error, disabled, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          className={`${getInputClasses(!!error)} ${className || ''}`}
          placeholder={placeholder}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 cursor-pointer"
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 