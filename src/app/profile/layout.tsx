import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Perfil | Roomzy',
  description: 'Gestiona tu información personal y configuración de cuenta en Roomzy',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 