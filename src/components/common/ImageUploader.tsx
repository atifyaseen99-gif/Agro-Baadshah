import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageHelper';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 6,
  label = 'Product Images',
  helperText = 'Supports JPG, JPEG, PNG, WEBP (Max 10MB per file). First image is main display image.',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setLoading(true);

    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setError(`Maximum limit of ${maxImages} images reached.`);
      setLoading(false);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newBase64Images: string[] = [];

    for (const file of filesToProcess) {
      try {
        const base64 = await fileToBase64(file, 1000, 1000, 0.85);
        newBase64Images.push(base64);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error processing image';
        setError(msg);
      }
    }

    if (newBase64Images.length > 0) {
      onChange([...images, ...newBase64Images]);
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-stone-800">{label}</label>
        <span className="text-xs text-stone-500 font-medium">
          {images.length} of {maxImages} images
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-emerald-600 bg-emerald-50/50'
              : 'border-stone-300 hover:border-emerald-600 bg-white hover:bg-stone-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple={maxImages > 1}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              {loading ? (
                <div className="w-5 h-5 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800">
                <span className="text-emerald-700 font-semibold underline underline-offset-2">
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className="text-xs text-stone-500 mt-1">{helperText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-lg border border-stone-200 overflow-hidden bg-stone-50 shadow-sm"
            >
              <img
                src={img}
                alt={`Uploaded image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-semibold tracking-wider uppercase rounded shadow">
                  Main Image
                </div>
              )}

              {/* Actions bar */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                {idx > 0 && (
                  <button
                    type="button"
                    title="Move Left"
                    onClick={() => moveImage(idx, 'left')}
                    className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded shadow hover:scale-105 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    title="Move Right"
                    onClick={() => moveImage(idx, 'right')}
                    className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded shadow hover:scale-105 transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Remove Image"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded shadow hover:scale-105 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-stone-500 italic pt-0.5">
          <ImageIcon className="w-4 h-4 text-stone-400" />
          <span>No image uploaded yet. If omitted, an agricultural placeholder will be rendered.</span>
        </div>
      )}
    </div>
  );
};
