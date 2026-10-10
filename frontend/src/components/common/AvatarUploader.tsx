/**
 * @file AvatarUploader.tsx
 * @description Reusable Avatar / Profile Picture uploader with direct Cloudflare R2 streaming,
 * live preview, progress indicators, and instant cloud deletion.
 */

import React, { useState, useRef } from 'react';
import { Camera, Trash2, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onAvatarChange: (newUrl: string | null) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackName?: string;
  allowDelete?: boolean;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatarUrl,
  onAvatarChange,
  size = 'md',
  fallbackName = 'User',
  allowDelete = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-xl',
    lg: 'w-28 h-28 text-3xl',
    xl: 'w-36 h-36 text-4xl',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image MIME type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadService.uploadAvatar(file);
      onAvatarChange(res.url);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      setError(err?.response?.data?.message || 'Failed to upload photo to Cloudflare R2.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;

    setIsDeleting(true);
    setError(null);

    try {
      // If it's a cloud storage URL, call delete
      if (currentAvatarUrl.includes('r2.dev') || currentAvatarUrl.includes('amazonaws.com') || currentAvatarUrl.startsWith('/uploads')) {
        await uploadService.deleteFile(currentAvatarUrl);
      }
      onAvatarChange(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Failed to remove avatar:', err);
      setError('Could not remove file from storage.');
    } finally {
      setIsDeleting(false);
    }
  };

  const initialLetter = (fallbackName || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        {/* Avatar Container */}
        <div
          className={`${sizeClasses[size]} rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-sky to-brand-lilac p-1 shadow-md flex items-center justify-center relative`}
        >
          {currentAvatarUrl ? (
            <img
              src={uploadService.getFileUrl(currentAvatarUrl)}
              alt={fallbackName}
              className="w-full h-full rounded-2xl object-cover bg-surface"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-accent-blue text-white flex items-center justify-center font-bold">
              {initialLetter}
            </div>
          )}

          {/* Loading Overlay */}
          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 bg-slate-900/60 rounded-3xl flex items-center justify-center z-10 backdrop-blur-xs">
              <RefreshCw className="w-6 h-6 text-white animate-spin" />
            </div>
          )}

          {/* Hover Camera Overlay */}
          {!isUploading && !isDeleting && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer z-10"
              title="Upload new photo to Cloudflare R2"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-wider uppercase">Change</span>
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Floating Quick Action Badge */}
        {!isUploading && !isDeleting && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-accent-blue hover:bg-brand-sky-dark text-white shadow-md border-2 border-surface transition-all cursor-pointer"
            title="Upload photo"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Auxiliary Action Buttons */}
      <div className="flex items-center gap-2 mt-1">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isDeleting}
          className="text-[11px] font-bold text-accent-blue hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
        >
          {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
        </button>

        {allowDelete && currentAvatarUrl && (
          <>
            <span className="text-muted text-[10px]">•</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
              className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer flex items-center gap-0.5 disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
