'use client';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/stores';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Datos estáticos de alojamientos destacados
const featuredAccommodations = [
  {
    id: 1,
    title: "Habitación en Las Condes",
    description: "Hermosa habitación con baño privado en el corazón de Las Condes",
    price: "$450.000",
    location: "Las Condes, Santiago",
    image: "🏠",
    features: ["Baño privado", "WiFi", "Gym"]
  },
  {
    id: 2,
    title: "Departamento compartido Providencia",
    description: "Acogedor departamento para compartir con estudiantes",
    price: "$320.000",
    location: "Providencia, Santiago",
    image: "🏢",
    features: ["Cocina equipada", "Lavandería", "Terraza"]
  },
  {
    id: 3,
    title: "Casa en Ñuñoa",
    description: "Casa familiar con amplios espacios comunes",
    price: "$280.000",
    location: "Ñuñoa, Santiago",
    image: "🏡",
    features: ["Jardín", "Parrilla", "Estacionamiento"]
  },
  {
    id: 4,
    title: "Loft en Bellavista",
    description: "Moderno loft en el vibrante barrio Bellavista",
    price: "$380.000",
    location: "Bellavista, Santiago",
    image: "🏠",
    features: ["Amoblado", "Céntrico", "Vista panorámica"]
  },
  {
    id: 5,
    title: "Habitación en San Miguel",
    description: "Habitación cómoda cerca del metro",
    price: "$250.000",
    location: "San Miguel, Santiago",
    image: "🛏️",
    features: ["Metro cercano", "Internet", "Limpieza incluida"]
  },
  {
    id: 6,
    title: "Departamento en Maipú",
    description: "Departamento nuevo con todas las comodidades",
    price: "$350.000",
    location: "Maipú, Santiago",
    image: "🏢",
    features: ["Nuevo", "Piscina", "Seguridad 24/7"]
  }
];

const InicioPage = () => {
  // 🎯 Selectores optimizados
  const user = useAuthStore((state) => state.user);
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );

  return (
    <ProtectedRoute requireEmailVerification={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <svg
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                ¡Bienvenido a Roomzy!
              </h1>
              
              <p className="text-lg text-slate-600 mb-6">
                Descubre los mejores alojamientos disponibles
              </p>

              {user && (
                <div className="bg-white rounded-lg shadow-sm p-4 max-w-md mx-auto">
                  <p className="text-slate-700">
                    Hola <span className="font-semibold text-emerald-600">{user.name} {user.lastName}</span> 👋
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alojamientos Destacados */}
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                🏆 Alojamientos Destacados
              </h2>
              <p className="text-slate-600">
                Los espacios más populares y mejor valorados de nuestra plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Imagen */}
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                    <span className="text-6xl">{accommodation.image}</span>
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {accommodation.title}
                      </h3>
                      <span className="text-lg font-bold text-emerald-600 whitespace-nowrap">
                        {accommodation.price}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {accommodation.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {accommodation.location}
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {accommodation.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="bg-slate-50 px-6 py-3">
                    <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sección de acciones rápidas */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Buscar Propiedades
                      </h3>
                      <p className="text-sm text-slate-500">
                        Encuentra tu hogar ideal
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Próximamente →
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Publicar Propiedad
                      </h3>
                      <p className="text-sm text-slate-500">
                        Comparte tu espacio
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Próximamente →
                  </button>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-slate-900">
                        Mi Perfil
                      </h3>
                      <p className="text-sm text-slate-500">
                        Gestiona tu cuenta
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-6 py-3">
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                    Ir al perfil →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default InicioPage; 