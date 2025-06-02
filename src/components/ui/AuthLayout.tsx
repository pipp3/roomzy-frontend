import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export default function AuthLayout({ children, maxWidth = 'md' }: AuthLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-orange-50 flex items-center justify-center p-4">
      <div className={`${maxWidthClasses[maxWidth]} w-full space-y-8`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100/50 p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 