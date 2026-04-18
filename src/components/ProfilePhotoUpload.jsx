import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

const ProfilePhotoUpload = ({ currentPhoto, onPhotoChange, disabled = false, theme = 'default' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(currentPhoto);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_DIMENSION = 1000;

  useEffect(() => {
    setPreviewPhoto(currentPhoto);
  }, [currentPhoto]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      alert('Lütfen JPEG, PNG veya WebP formatında bir fotoğraf seçin.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('Fotoğraf boyutu 5MB\'den küçük olmalıdır.');
      return;
    }
    processImage(file);
  };

  const processImage = (file) => {
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewPhoto(optimizedDataUrl);
        setIsUploading(false);
        if (onPhotoChange) onPhotoChange(optimizedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => handleFileSelect(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  
  const handleRemovePhoto = () => {
    setPreviewPhoto(null);
    if (onPhotoChange) onPhotoChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const getThemeClasses = () => {
    if (theme === 'profile') {
      return {
        border: 'border-white border-opacity-40',
        borderHover: 'hover:border-opacity-100',
        borderDrag: 'border-white bg-white/20',
        text: 'text-white',
        spinner: 'border-white border-t-transparent',
        photoBackground: 'bg-white/10 backdrop-blur-md',
        fallbackIcon: 'text-white/60'
      };
    }
    return {
      border: 'border-slate-200',
      borderHover: 'hover:border-primary-400',
      borderDrag: 'border-primary-500 bg-primary-50',
      text: 'text-slate-500',
      spinner: 'border-primary-600 border-t-transparent',
      photoBackground: 'bg-slate-100',
      fallbackIcon: 'text-slate-400'
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="space-y-4">
      <div className="relative group mx-auto w-40 h-40">
        {previewPhoto ? (
          <>
            <div className={`w-full h-full rounded-[2.5rem] overflow-hidden border-4 ${themeClasses.border} p-1 shadow-2xl transition-all duration-500 group-hover:scale-[1.02]`}>
              <img 
                src={previewPhoto} 
                alt="Profile" 
                className="w-full h-full rounded-[2.1rem] object-cover"
              />
            </div>
            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-[2.5rem] backdrop-blur-[2px]">
                <button
                  onClick={handleRemovePhoto}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors mx-1"
                >
                  <X className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={openFileDialog}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-primary-600 transition-colors mx-1"
                >
                  <Camera className="h-5 w-5 mx-auto" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className={`w-full h-full rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center ${
              isDragOver ? themeClasses.borderDrag : `${themeClasses.border} ${themeClasses.borderHover}`
            } ${disabled ? 'bg-slate-50/50 cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-slate-50/10'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={!disabled ? openFileDialog : undefined}
          >
            {isUploading ? (
              <div className={`w-8 h-8 border-2 ${themeClasses.spinner} rounded-full animate-spin`} />
            ) : (
              <div className={`flex flex-col items-center ${themeClasses.text}`}>
                <Camera className="h-8 w-8 mb-2 opacity-50" />
                <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">
                  {isDragOver ? 'BIRAKIN' : 'FOTOĞRAF YÜKLE'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ProfilePhotoUpload;