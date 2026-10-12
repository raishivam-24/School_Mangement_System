/**
 * @file upload.middleware.ts
 * @description Multer configuration and file validation middleware.
 * Validates file MIME types, file sizes, and memory buffering for downstream storage providers.
 */

import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../../utils/apiError.js';

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

// Configure in-memory storage so storage provider can stream or write to disk/S3
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, PDF, DOC, DOCX, XLS, XLSX.`,
        400
      )
    );
  }
};

export const uploadSingleFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 1,
  },
}).single('file');

export const uploadAvatarFile = multer({
  storage,
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files (JPEG, PNG, WEBP) are allowed for profile photos.', 400));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for photos
    files: 1,
  },
}).single('avatar');

export const uploadMultipleFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit per file
    files: 5, // Up to 5 files at once
  },
}).array('files', 5);
