import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cambiar Contraseña | Roomzy',
  description: 'Actualiza tu contraseña para mantener tu cuenta segura en Roomzy',
};

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 