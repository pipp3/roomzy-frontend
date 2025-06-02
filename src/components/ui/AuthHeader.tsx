import { ReactNode } from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string | ReactNode;
  icon: ReactNode;
}

export default function AuthHeader({ title, subtitle, icon }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          {icon}
        </div>
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <div className="text-slate-600">
        {subtitle}
      </div>
    </div>
  );
} 