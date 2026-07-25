/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadControlProps {
  label?: string;
  value?: string;
  publicId?: string;
  onChange: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  csrfToken?: string;
  className?: string;
}

export const ImageUploadControl: React.FC<ImageUploadControlProps> = ({
  label = 'Upload Image Asset',
  value,
  publicId,
  onChange,
  onRemove,
  csrfToken = '',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const processFile = async (file: File) => {
    setErrorMsg(null);

    // Client-side file type validation
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMsg('Invalid file format. Allowed formats: JPG, PNG, WEBP.');
      return;
    }

    // Client-side file size validation (5MB max)
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setIsUploading(true);
    try {
      // Read file as Base64 Data URL
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({ image: base64Data })
          });

          const data = await res.json();
          if (res.ok && data.url) {
            onChange(data.url, data.public_id);
          } else {
            setErrorMsg(data.error || 'Failed to upload image to server.');
          }
        } catch (err) {
          setErrorMsg('Network error while uploading image.');
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setErrorMsg('Error reading selected image file.');
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = async () => {
    if (!value) return;

    if (publicId) {
      try {
        await fetch('/api/admin/delete-image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({ public_id: publicId })
        });
      } catch (err) {
        console.warn('Failed to send Cloudinary deletion request:', err);
      }
    }

    onChange('', '');
    if (onRemove) onRemove();
  };

  return (
    <div className={`space-y-2 text-xs font-sans ${className}`}>
      {label && <label className="block font-mono font-bold text-gray-700 uppercase tracking-wider">{label}</label>}

      {errorMsg && (
        <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 text-[11px]">
          <AlertCircle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {value ? (
        <div className="relative group p-3 bg-ivory-50/80 rounded-2xl border border-gold-600/20 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-14 h-14 rounded-xl object-cover border border-gold-500/30 bg-black shadow-sm shrink-0"
            />
            <div className="overflow-hidden">
              <div className="flex items-center space-x-1 text-emerald-600 font-mono text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <CheckCircle2 size={12} />
                <span>Asset Ready</span>
              </div>
              <p className="font-mono text-[10px] text-gray-500 truncate max-w-xs">{value}</p>
              {publicId && (
                <span className="inline-block px-1.5 py-0.5 bg-gold-500/10 text-gold-800 text-[9px] font-mono rounded mt-0.5">
                  ID: {publicId}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-gold-50 text-maroon-950 rounded-lg font-mono text-[11px] font-bold flex items-center gap-1 border border-gold-500/20 transition-all cursor-pointer"
            >
              <RefreshCw size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-mono text-[11px] font-bold flex items-center gap-1 border border-red-200 transition-all cursor-pointer"
              title="Remove & Destroy Asset from Cloudinary"
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center space-y-2 ${
            isDragging
              ? 'border-gold-600 bg-gold-50/50 scale-[1.01]'
              : 'border-gray-200 hover:border-gold-500/50 bg-ivory-50/40 hover:bg-ivory-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <RefreshCw className="w-6 h-6 text-gold-600 animate-spin" />
              <span className="font-mono text-xs font-bold text-maroon-950 uppercase tracking-widest">
                Uploading Asset to Cloudinary...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-700 flex items-center justify-center">
                <UploadCloud size={20} />
              </div>
              <div>
                <span className="font-semibold text-gray-900 block text-xs">
                  Drag & drop image file here, or <span className="text-gold-700 underline font-bold">browse</span>
                </span>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">
                  Supports JPG, PNG, WEBP — Max File Size: 5MB
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
