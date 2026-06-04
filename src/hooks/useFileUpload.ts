'use client';

import { useState, useCallback } from 'react';

interface UseFileUploadReturn {
  /** Upload files to the server and return the public URLs */
  upload: (files: File[], type?: string) => Promise<string[]>;
  /** Upload is in progress */
  uploading: boolean;
  /** Error message if upload failed */
  error: string | null;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Hook for uploading files to the server via POST /api/v1/upload.
 * Returns uploaded URLs that can be stored in the database.
 */
export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const upload = useCallback(async (files: File[], type = 'coral'): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('type', type);
      files.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Upload thất bại');
        return [];
      }

      return json.data?.urls || [];
    } catch {
      setError('Không thể kết nối đến server');
      return [];
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error, clearError };
}
