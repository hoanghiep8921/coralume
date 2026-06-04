'use client';

import { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  maxFiles?: number;
  accept?: string;
  maxSize?: number;
  value: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPT_DEFAULT = 'image/jpeg,image/png,image/webp,video/mp4,video/webm';
const MAX_SIZE_DEFAULT = 10 * 1024 * 1024; // 10MB

/**
 * Compress an image file using Canvas API.
 * Resizes to max 1920px width, converts to JPEG at 0.8 quality.
 * Returns the original file if Canvas is not supported or file is not an image.
 */
async function compressImage(file: File): Promise<File> {
  // Only compress images; pass videos through unchanged
  if (!file.type.startsWith('image/')) return file;
  if (file.size < 500 * 1024) return file; // Skip small files (< 500KB)

  try {
    const bitmap = await createImageBitmap(file);
    const MAX_WIDTH = 1920;
    let { width, height } = bitmap;

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return file; // Fallback to original on any error
  }
}

export function FileUpload({
  maxFiles = 5,
  accept = ACCEPT_DEFAULT,
  maxSize = MAX_SIZE_DEFAULT,
  value,
  onChange,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);

      const acceptedTypes = accept.split(',');
      const newFiles: File[] = [...value];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        // Check max files
        if (newFiles.length >= maxFiles) {
          setError(`Tối đa ${maxFiles} file`);
          break;
        }

        // Check type
        if (!acceptedTypes.some((t) => file.type.match(t.trim().replace('*', '.*')))) {
          setError(`Định dạng không hỗ trợ: ${file.type}`);
          continue;
        }

        // Check size
        if (file.size > maxSize) {
          const maxMB = maxSize / (1024 * 1024);
          setError(`File "${file.name}" quá lớn (tối đa ${maxMB}MB)`);
          continue;
        }

        newFiles.push(file);
      }

      if (newFiles.length > value.length) {
        setCompressing(true);
        try {
          const compressed = await Promise.all(
            newFiles.map((f) => (value.includes(f) ? f : compressImage(f)))
          );
          onChange(compressed);
        } finally {
          setCompressing(false);
        }
      }
    },
    [value, maxFiles, accept, maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      processFiles(e.dataTransfer.files);
    },
    [processFiles, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updated = value.filter((_, i) => i !== index);
      onChange(updated);
      setError(null);
    },
    [value, onChange]
  );

  const previewUrl = useCallback(
    (file: File, index: number) => {
      // For re-renders, use a persistent object URL cache via a ref
      return URL.createObjectURL(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-on-surface">
        Ảnh / Video ({value.length}/{maxFiles})
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          disabled
            ? 'border-outline-variant bg-surface-container-lowest/50 cursor-not-allowed'
            : isDragOver
            ? 'border-secondary bg-secondary-container/10'
            : 'border-outline-variant hover:border-primary bg-surface-container-lowest'
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files"
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          aria-hidden="true"
        />

        {compressing ? (
          <div className="text-on-surface-variant">
            <svg className="w-8 h-8 mx-auto mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Đang nén ảnh...</span>
          </div>
        ) : (
          <>
            <svg
              className="w-8 h-8 mx-auto mb-2 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-on-surface-variant">
              Kéo thả file vào đây hoặc <span className="text-secondary font-medium">chọn file</span>
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              JPEG, PNG, WebP, MP4, WebM • Tối đa {maxSize / (1024 * 1024)}MB/file
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error-container text-error text-sm px-3 py-2 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {value.map((file, i) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const url = previewUrl(file, i);

            return (
              <div key={`${file.name}-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                {isImage ? (
                  <img
                    src={url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      // Revoke object URL after load (optional, cleanup)
                      // setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }}
                  />
                ) : isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant p-2">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] leading-tight text-center break-all line-clamp-2">{file.name}</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}

                {/* Remove button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                    aria-label={`Xoá ${file.name}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
