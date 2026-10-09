/**
 * @file uploads.controller.ts
 * @description Upload Controller handling single/multiple file uploads and avatar assignments.
 */

import { Request, Response, NextFunction } from 'express';
import { storageService } from './storage.service.js';
import { AppError } from '../../utils/apiError.js';
import { prisma } from '../../db/prisma.js';

export const uploadsController = {
  /**
   * Upload a single file (general, homework, circulars, leave certificates)
   * POST /api/v1/uploads
   */
  uploadSingle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(AppError.badRequest('No file uploaded. Please attach a file under the field name "file".'));
      }

      const category = (req.body?.category || req.query?.category || 'general') as string;
      const result = await storageService.saveFile(
        {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer,
        },
        category
      );

      res.status(201).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Upload and update user avatar photo
   * POST /api/v1/uploads/avatar
   */
  uploadAvatar: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(AppError.badRequest('No avatar image uploaded under field name "avatar".'));
      }

      const result = await storageService.saveFile(
        {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer,
        },
        'avatars'
      );

      // Optionally update user profile avatar if authenticated
      if (req.user?.userId) {
        await prisma.user.update({
          where: { id: req.user.userId },
          data: { avatarUrl: result.url },
        }).catch(() => null);
      }

      res.status(201).json({
        status: 'success',
        message: 'Avatar uploaded successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Upload multiple files (up to 5 attachments)
   * POST /api/v1/uploads/multiple
   */
  uploadMultiple: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return next(AppError.badRequest('No files uploaded.'));
      }

      const category = (req.body?.category || req.query?.category || 'general') as string;
      const uploadPromises = files.map((file) =>
        storageService.saveFile(
          {
            fieldname: file.fieldname,
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: file.size,
            buffer: file.buffer,
          },
          category
        )
      );

      const results = await Promise.all(uploadPromises);

      res.status(201).json({
        status: 'success',
        message: `${results.length} files uploaded successfully`,
        data: results,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Delete file from cloud storage or local disk
   * DELETE /api/v1/uploads
   */
  deleteFile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const target = (req.body?.fileUrl || req.body?.key || req.query?.fileUrl || req.query?.key) as string;
      if (!target) {
        return next(AppError.badRequest('Missing fileUrl or key parameter for file deletion.'));
      }

      const success = await storageService.deleteFile(target);
      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: 'File could not be found or failed to delete from storage',
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'File deleted successfully from storage',
        data: { target },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Get active storage engine status (Cloudflare R2 / S3 / Local)
   * GET /api/v1/uploads/config
   */
  getConfig: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const { env } = await import('../../config/env.js');
      const isS3 = env.STORAGE_DRIVER === 's3';

      res.status(200).json({
        status: 'success',
        data: {
          driver: env.STORAGE_DRIVER,
          bucket: isS3 ? env.AWS_S3_BUCKET || 'Not configured' : 'Local Disk',
          endpoint: isS3 ? env.AWS_S3_ENDPOINT || 'AWS S3 Default' : 'Local Server',
          publicUrl: isS3 ? env.AWS_S3_PUBLIC_URL || 'Direct S3 URLs' : '/uploads',
          region: env.AWS_REGION || 'auto',
          isCloudflareR2: Boolean(env.AWS_S3_ENDPOINT?.includes('r2.cloudflarestorage.com')),
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
