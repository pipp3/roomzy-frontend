'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { adminService, CreateUserData } from '@/services/adminService';
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

// Datos de regiones y ciudades de Chile
const CHILE_REGIONS_CITIES = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
  'Antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
  'Atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
  'Valparaíso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'],
  'Metropolitana': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
  'O\'Higgins': ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
  'Maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
  'Ñuble': ['Chillán', 'Bulnes', 'Cobquecura', 'Coelemu', 'Coihueco', 'Chillán Viejo', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'],
  'Biobío': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'],
  'La Araucanía': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
  'Los Ríos': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
  'Aysén': ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
  'Magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine']
};

const CHILE_REGIONS = Object.keys(CHILE_REGIONS_CITIES).map(region => ({
  value: region,
  label: region === 'Metropolitana' ? 'Región Metropolitana' : 
         region === 'O\'Higgins' ? 'Libertador General Bernardo O\'Higgins' :
         region === 'Aysén' ? 'Aysén del General Carlos Ibáñez del Campo' :
         region === 'Magallanes' ? 'Magallanes y de la Antártica Chilena' :
         region
}));

export default function CreateUserPage() {
  const router = useRouter();
  const { canAccess } = useAdminAuth();
  
  const [isCreating, setIsCreating] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    lastName: '',
    email: '',
    region: '',
    city: '',
    phone: '',
    password: '',
    role: 'seeker',
    bio: '',
    habits: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!formData.region) {
      newErrors.region = 'La región es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La comuna es requerida';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (formData.phone.length !== 9) {
      newErrors.phone = 'El teléfono debe tener exactamente 9 dígitos';
    } else if (!/^9\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe comenzar con 9 seguido de 8 dígitos';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setIsCreating(true);
      
      const response = await adminService.createUser(formData);
      
      if (response.success && response.data) {
        toast.success('Usuario creado exitosamente');
        router.push(`/dashboard/admin/usuarios/${response.data.user.id}`);
      } else {
        toast.error('Error al crear el usuario');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear el usuario');
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Si se cambia la región, actualizar las ciudades disponibles y limpiar la ciudad
    if (field === 'region') {
      const cities = CHILE_REGIONS_CITIES[value as keyof typeof CHILE_REGIONS_CITIES] || [];
      setAvailableCities(cities);
      setFormData(prev => ({ ...prev, city: '' })); // Limpiar ciudad cuando cambia región
    }
    
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Mostrar página de acceso denegado si no es admin
  if (!canAccess) {
    return (
      <ProtectedRoute requireEmailVerification={true}>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center">
                <Shield className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-sm font-medium text-slate-900">Acceso Restringido</h3>
                <p className="mt-1 text-sm text-slate-500">
                  No tienes permisos para crear usuarios.
                </p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireEmailVerification={true}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
              
              <div className="flex items-center">
                <UserPlus className="w-8 h-8 text-emerald-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-emerald-600">
                    Crear Nuevo Usuario
                  </h1>
                  <p className="mt-2 text-slate-600">
                    Agrega un nuevo usuario a la plataforma
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Información Personal
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.name ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="Nombre del usuario"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.lastName ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="Apellido del usuario"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.email ? 'border-red-300' : 'border-slate-300'
                      }`}
                      placeholder="email@ejemplo.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Teléfono *
                    </label>
                                          <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 text-sm">+56</span>
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => {
                            // Solo permitir números y máximo 9 dígitos
                            const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                            handleInputChange('phone', value);
                          }}
                          className={`block text-black w-full pl-12 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                            errors.phone ? 'border-red-300' : 'border-slate-300'
                          }`}
                          placeholder="912345678"
                          maxLength={9}
                        />
                      </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Región */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Región *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.region ? 'border-red-300' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Selecciona una región</option>
                      {CHILE_REGIONS.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                    )}
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Comuna *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!formData.region}
                      className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed ${
                        errors.city ? 'border-red-300' : 'border-slate-300'
                      }`}
                    >
                      <option value="">
                        {!formData.region ? 'Primero selecciona una región' : 'Selecciona una comuna'}
                      </option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Configuración de la cuenta */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Configuración de la Cuenta
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`block text-black w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.password ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Contraseña segura"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      El usuario estará verificado automáticamente
                    </p>
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      Rol del Usuario
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'seeker' | 'host')}
                      className="block text-black w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="seeker">Buscador</option>
                      <option value="host">Anfitrión</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">
                  Información Adicional (Opcional)
                </h2>
                
                <div className="space-y-6">
                  {/* Biografía */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="block text-black w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Información personal del usuario..."
                    />
                  </div>

                  {/* Hábitos */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Hábitos
                    </label>
                    <textarea
                      value={formData.habits}
                      onChange={(e) => handleInputChange('habits', e.target.value)}
                      rows={3}
                      className="block text-black w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Hábitos y preferencias del usuario..."
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isCreating ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 