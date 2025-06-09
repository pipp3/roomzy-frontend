
import { User } from 'lucide-react';
// Función para combinar clases CSS
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface AvatarProps {
  profilePhoto?: string | null;
  name?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  xl: 'h-24 w-24'
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12'
};

const Avatar: React.FC<AvatarProps> = ({
  profilePhoto,
  name,
  lastName,
  size = 'md',
  className,
  showBorder = false,
  onClick
}) => {
  const initials = name && lastName ? `${name[0]}${lastName[0]}`.toUpperCase() : '';
  
  const baseClasses = cn(
    'rounded-full flex items-center justify-center overflow-hidden',
    sizeClasses[size],
    showBorder && 'border-4 border-white shadow-lg',
    onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  if (profilePhoto) {
    return (
      <div className={baseClasses} onClick={onClick}>
        <img
          src={profilePhoto}
          alt={`Foto de perfil de ${name} ${lastName}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Si la imagen falla al cargar, mostrar el avatar por defecto
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentNode) {
              const fallback = document.createElement('div');
              fallback.className = 'h-full w-full bg-slate-100 flex items-center justify-center';
              if (initials) {
                fallback.innerHTML = `<span class="text-slate-600 font-semibold ${size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : 'text-sm'}">${initials}</span>`;
              } else {
                const iconSize = iconSizeClasses[size];
                fallback.innerHTML = `<svg class="${iconSize} text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
              }
              target.parentNode.appendChild(fallback);
            }
          }}
        />
      </div>
    );
  }

  // Avatar por defecto sin imagen
  return (
    <div className={cn(baseClasses, 'bg-slate-100')} onClick={onClick}>
      {initials ? (
        <span className={cn(
          'text-slate-600 font-semibold',
          size === 'xl' ? 'text-xl' : size === 'lg' ? 'text-lg' : 'text-sm'
        )}>
          {initials}
        </span>
      ) : (
        <User className={cn('text-slate-400', iconSizeClasses[size])} />
      )}
    </div>
  );
};

export default Avatar; 