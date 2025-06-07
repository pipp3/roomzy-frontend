export const debugAuth = {
  // Verificar tokens en localStorage
  checkTokens: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log('🔍 Debug Auth - Tokens disponibles:');
    console.log('Access Token:', accessToken ? 'Existe' : 'No existe');
    console.log('Refresh Token:', refreshToken ? 'Existe' : 'No existe');
    
    if (accessToken) {
      try {
        // Decodificar token JWT para ver si está expirado
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        
        console.log('Token expirado:', isExpired);
        console.log('Token expira en:', new Date(payload.exp * 1000));
        console.log('Usuario en token:', payload);
      } catch (error) {
        console.log('Error decodificando token:', error);
      }
    }
    
    return { accessToken, refreshToken };
  },

  // Limpiar tokens y storage
  clearAll: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roomzy-auth-storage');
    console.log('🧹 Tokens y storage limpiados');
  },

  // Verificar configuración de API
  checkApiConfig: () => {
    console.log('🔍 Debug Auth - Configuración API:');
    console.log('BASE_URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1');
    console.log('Endpoint /auth/me:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/me`);
  },

  // Hacer petición directa al endpoint /auth/me
  testAuthMe: async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.log('❌ No hay access token para probar');
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${baseURL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Debug Auth - Respuesta /auth/me:');
      console.log('Status:', response.status);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('Data:', data);
      
      return data;
    } catch (error) {
      console.log('❌ Error en petición /auth/me:', error);
      return null;
    }
  }
};

// Hacer disponible en window para debugging en consola
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuth;
} 