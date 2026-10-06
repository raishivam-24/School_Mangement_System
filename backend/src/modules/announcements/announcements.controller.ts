/**
 * @file announcements.controller.ts
 * @description Controller for School Announcements.
 */

import { Request, Response, NextFunction } from 'express';
import { AnnouncementsService } from './announcements.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AnnouncementsController {
  static async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await AnnouncementsService.createAnnouncement(
        req.schoolId!,
        req.user!.userId,
        req.body
      );
      return ApiResponse.created(res, announcement, 'Announcement published successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await AnnouncementsService.listAnnouncements(
        req.schoolId!,
        req.user!.role
      );
      return ApiResponse.success(res, list);
    } catch (error) {
      next(error);
    }
  }

  static async updateAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AnnouncementsService.updateAnnouncement(
        req.schoolId!,
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, updated, 'Announcement updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AnnouncementsService.deleteAnnouncement(
        req.schoolId!,
        req.params.id
      );
      return ApiResponse.success(res, result, 'Announcement deleted');
    } catch (error) {
      next(error);
    }
  }
}
