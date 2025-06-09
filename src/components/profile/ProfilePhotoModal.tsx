'use client';

import { useState, useRef } from 'react';
import { X, Upload, Camera, AlertCircle } from 'lucide-react';
import { userService } from '@/services/userService';
import { useAuthActions } from '@/stores/authStore';
import Avatar from '@/components/ui/Avatar';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto?: string | null;
  userName?: string;
  userLastName?: string;
}

const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  userName,
  userLastName
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshUser } = useAuthActions();

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos JPG, PNG o WebP');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('El archivo no puede ser mayor a 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await userService.updateProfilePhoto(selectedFile);
      
      if (response.success) {
        // Actualizar el estado del usuario en el store
        await refreshUser();
        onClose();
        
        // Limpiar el estado
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setError(response.message || 'Error al subir la imagen');
      }
    } catch (error: any) {
      setError(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-900">
            Actualizar foto de perfil
          </h2>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isUploading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Vista previa actual */}
          <div className="text-center">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Foto actual
            </h3>
            <Avatar
              profilePhoto={currentPhoto}
              name={userName}
              lastName={userLastName}
              size="lg"
              showBorder={true}
              className="mx-auto"
            />
          </div>

          {/* Área de subida de archivo */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-700">
              Nueva foto de perfil
            </h3>
            
            {/* Vista previa de la nueva imagen */}
            {previewUrl && (
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {selectedFile?.name}
                </p>
              </div>
            )}

            {/* Área de drag and drop */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <Camera className="h-8 w-8 text-slate-400 mx-auto" />
                <p className="text-sm text-slate-600">
                  Arrastra una imagen aquí o{' '}
                  <button
                    type="button"
                    onClick={handleOpenFileDialog}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                    disabled={isUploading}
                  >
                    selecciona un archivo
                  </button>
                </p>
                <p className="text-xs text-slate-500">
                  JPG, PNG o WebP hasta 5MB
                </p>
              </div>
            </div>

            {/* Input oculto para archivos */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-slate-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Actualizar foto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoModal; 