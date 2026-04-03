/**
 * @fileoverview Upload Hook
 *
 * React hook for uploading images via the API.
 * Returns a mutation that uploads a file and returns the public URL.
 */

import { useMutation } from '@tanstack/react-query';

// Use relative URL so requests go through Next.js rewrite proxy.
// This ensures cookies are sent on the same domain (no cross-origin issues).
const API_BASE_URL = '';

interface UploadResponse {
  url: string;
}

interface UploadMultipleResponse {
  urls: string[];
}

/**
 * Upload a single image file
 */
async function uploadImage(
  file: File,
  folder: string = 'articles',
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/api/upload/image?folder=${folder}`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '上傳失敗' }));
    throw new Error(error.message || `上傳失敗 (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Upload multiple image files
 */
async function uploadImages(
  files: File[],
  folder: string = 'articles',
): Promise<UploadMultipleResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(
    `${API_BASE_URL}/api/upload/images?folder=${folder}`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '上傳失敗' }));
    throw new Error(error.message || `上傳失敗 (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Hook for uploading a single image
 */
export function useUploadImage(folder: string = 'articles') {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file, folder),
  });
}

/**
 * Hook for uploading multiple images
 */
export function useUploadImages(folder: string = 'articles') {
  return useMutation({
    mutationFn: (files: File[]) => uploadImages(files, folder),
  });
}
