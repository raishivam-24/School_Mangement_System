/**
 * @file upload.service.ts
 * @description Frontend API client service for file and image uploads.
 */

import { api } from '../lib/api';

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  category: string;
}

export const uploadService = {
  /**
   * Upload a single file (homework, circular PDF, leave note)
   */
  uploadFile: async (file: File, category: string = 'general'): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data?.data;
  },

  /**
   * Upload student or teacher avatar image
   */
  uploadAvatar: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await api.post('/uploads/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data?.data;
  },

  /**
   * Upload multiple attachment files (up to 5)
   */
  uploadMultiple: async (files: File[], category: string = 'general'): Promise<UploadResult[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('category', category);

    const res = await api.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data?.data;
  },

  /**
   * Helper to resolve relative upload paths to full backend URLs
   */
  getFileUrl: (relativeOrFullUrl: string): string => {
    if (!relativeOrFullUrl) return '';
    if (relativeOrFullUrl.startsWith('http://') || relativeOrFullUrl.startsWith('https://')) {
      return relativeOrFullUrl;
    }
    const backendBase = (api.defaults.baseURL || '').replace('/api/v1', '');
    return `${backendBase}${relativeOrFullUrl}`;
  },
};
