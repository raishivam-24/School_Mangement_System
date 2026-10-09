/**
 * @file uploads.routes.ts
 * @description API Routes for file and image uploads.
 */

import { Router } from 'express';
import { uploadsController } from './uploads.controller.js';
import {
  uploadSingleFile,
  uploadAvatarFile,
  uploadMultipleFiles,
} from './upload.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';

export const uploadRoutes = Router();

// All upload endpoints require authentication
uploadRoutes.use(authenticate);

// Single file upload (general, circulars, homework worksheets)
uploadRoutes.post('/', uploadSingleFile, uploadsController.uploadSingle);

// Avatar photo upload
uploadRoutes.post('/avatar', uploadAvatarFile, uploadsController.uploadAvatar);

// Batch attachments upload (up to 5 files)
uploadRoutes.post('/multiple', uploadMultipleFiles, uploadsController.uploadMultiple);
