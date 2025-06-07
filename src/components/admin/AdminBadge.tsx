'use client';

import { Shield } from 'lucide-react';

interface AdminBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'minimal';
}

export default function AdminBadge({ size = 'md', variant = 'default' }: AdminBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  const variantClasses = {
    default: 'bg-purple-100 text-purple-800 border border-purple-200',
    outline: 'bg-white text-purple-700 border-2 border-purple-300',
    minimal: 'bg-purple-600 text-white'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <Shield className={iconSizes[size]} />
      Admin
    </span>
  );
} 