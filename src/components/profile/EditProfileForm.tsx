'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthUser, useAuthActions } from '@/stores/authStore';
import { User, Mail, FileText, Users, Save } from 'lucide-react';
import { userService, UpdateUserProfileData } from '@/services/userService';
import { toast } from 'sonner';
import { getInputClasses } from '@/utils/form';

// Componentes de formulario
import FormField from '@/components/form/FormField';
import RegionCitySelector from '@/components/form/RegionCitySelector';
import LoadingButton from '@/components/form/LoadingButton';

interface EditProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// Schema de validación con Zod
const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .trim(),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone || phone.trim() === '') return true; // Opcional
      const phoneRegex = /^9[0-9]{8}$/;
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      return phoneRegex.test(cleanPhone);
    }, 'El teléfono debe tener 9 dígitos y empezar con 9 (ej: 987654321)'),
  
  city: z
    .string()
    .min(1, 'La ciudad es requerida')
    .max(50, 'La ciudad no puede exceder 50 caracteres')
    .trim(),
  
  region: z
    .string()
    .min(1, 'La región es requerida')
    .max(50, 'La región no puede exceder 50 caracteres'),
  
  bio: z
    .string()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .transform(val => val?.trim() || ''),
  
  habits: z
    .string()
    .max(1000, 'Los hábitos no pueden exceder 1000 caracteres')
    .transform(val => val?.trim() || ''),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfileForm({ onCancel, onSuccess }: EditProfileFormProps) {
  const user = useAuthUser();
  const { refreshUser } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      lastName: '',
      phone: '',
      city: '',
      region: '',
      bio: '',
      habits: '',
    },
  });

  const selectedRegion = watch('region');
  const selectedCity = watch('city');
  const bioValue = watch('bio') || '';
  const habitsValue = watch('habits') || '';

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (user) {
      const cleanPhone = user.phone ? user.phone.replace('+56 ', '').replace(/\s/g, '') : '';
      
      reset({
        name: user.name || '',
        lastName: user.lastName || '',
        phone: cleanPhone,
        city: user.city || '',
        region: user.region || '',
        bio: user.bio || '',
        habits: user.habits || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!isDirty) {
      toast.info('No hay cambios para guardar');
      return;
    }

    if (!user?.id) {
      toast.error('Error: Usuario no identificado');
      return;
    }

    try {
      const updateData: UpdateUserProfileData = {
        name: data.name,
        lastName: data.lastName,
        phone: data.phone?.trim() || undefined,
        city: data.city,
        region: data.region,
        bio: data.bio || '',
        habits: data.habits || '',
      };

      const result = await userService.updateUserProfile(user.id.toString(), updateData);

      if (!result.success) {
        if (result.errors) {
          // Los errores del servidor se manejan automáticamente por react-hook-form
          toast.error(result.message);
        } else {
          toast.error(result.message);
        }
        return;
      }

      // Actualizar el usuario en el store
      await refreshUser();
      
      toast.success(result.message);
      onSuccess();

    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      toast.error(error.message || 'Error al actualizar perfil');
    }
  };

  const handleRegionChange = (region: string) => {
    setValue('region', region, { shouldDirty: true, shouldValidate: true });
    setValue('city', '', { shouldDirty: true, shouldValidate: true }); // Reset city
  };

  const handleCityChange = (city: string) => {
    setValue('city', city, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nombre"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`${getInputClasses(!!errors.name)} pl-10`}
                placeholder="Tu nombre"
                disabled={isSubmitting}
              />
            </div>
          </FormField>

          <FormField
            label="Apellido"
            htmlFor="lastName"
            error={errors.lastName?.message}
            required
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={`${getInputClasses(!!errors.lastName)} pl-10`}
                placeholder="Tu apellido"
                disabled={isSubmitting}
              />
            </div>
          </FormField>
        </div>

        {/* Información de contacto */}
        <FormField
          label="Teléfono"
          htmlFor="phone"
          error={errors.phone?.message}
          helpText="Formato: 9 dígitos empezando con 9 (ej: 987654321)"
        >
          <div className="relative flex">
            {/* Prefijo +56 (no editable) */}
            <div className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium">
              +56
            </div>
            {/* Input para los 9 dígitos */}
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className={`flex-1 px-4 py-3 border text-black rounded-r-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm ${
                errors.phone 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-300'
              }`}
              placeholder="987654321"
              maxLength={9}
              disabled={isSubmitting}
            />
          </div>
        </FormField>

        {/* Ubicación */}
        <div>
          <RegionCitySelector
            regionValue={selectedRegion || ''}
            cityValue={selectedCity || ''}
            onRegionChange={handleRegionChange}
            onCityChange={handleCityChange}
            regionError={errors.region?.message}
            cityError={errors.city?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Biografía */}
        <FormField
          label="Biografía"
          htmlFor="bio"
          error={errors.bio?.message}
          helpText="Recomendado para que otros usuarios puedan conocerte mejor"
        >
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className={`${getInputClasses(!!errors.bio)} pl-10 resize-vertical`}
              placeholder="Cuéntanos sobre ti, tus intereses, estudios, trabajo, etc. Esta información ayuda a encontrar compañeros de cuarto compatibles."
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-2 right-2 text-sm text-slate-500">
              {bioValue.length}/500
            </div>
          </div>
        </FormField>

        {/* Hábitos */}
        <FormField
          label="Hábitos y Estilo de Vida"
          htmlFor="habits"
          error={errors.habits?.message}
          helpText="Importante para la compatibilidad con futuros compañeros de cuarto"
        >
          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              id="habits"
              {...register('habits')}
              rows={4}
              className={`${getInputClasses(!!errors.habits)} pl-10 resize-vertical`}
              placeholder="Describe tus hábitos: horarios, limpieza, ruido, mascotas, humo, visitantes, rutinas de ejercicio, etc. Esto ayuda a encontrar compatibilidad."
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-2 right-2 text-sm text-slate-500">
              {habitsValue.length}/1000
            </div>
          </div>
        </FormField>

        {/* Email (solo lectura) */}
        <FormField
          label="Email"
          htmlFor="email"
          helpText="El email no se puede cambiar desde aquí"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className={`${getInputClasses(false)} pl-10 bg-slate-50 text-slate-500 cursor-not-allowed`}
            />
          </div>
        </FormField>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
            loadingText="Guardando..."
            variant="custom"
            className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </LoadingButton>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        {isDirty && (
          <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <div className="h-4 w-4 mr-2 text-amber-500">⚠️</div>
            Tienes cambios sin guardar
          </div>
        )}
      </form>
    </div>
  );
}