import { useEffect, useState } from 'react';

/**
 * Hook para manejar la hidratación de stores persistidos
 * Evita errores de SSR/client mismatch
 */
export const useHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Marcar como hidratado después del primer render del cliente
    setIsHydrated(true);
  }, []);

  return isHydrated;
}; 