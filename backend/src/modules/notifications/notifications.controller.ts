/**
 * @file notifications.controller.ts
 * @description Express controller for notification endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { NotificationsService } from './notifications.service.js';

export class NotificationsController {
  /**
   * GET /api/v1/notifications
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.listUserNotifications(
        req.user!.userId,
        req.user?.role,
        req.query as any
      );
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/notifications/unread-count
   */
  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.getUnreadCount(req.user!.userId);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/notifications/:id/read
   */
  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.markAsRead(req.params.id, req.user!.userId);
      res.status(200).json({
        status: 'success',
        message: 'Notification marked as read',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/notifications/read-all
   */
  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.markAllAsRead(req.user!.userId);
      res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/notifications/:id
   */
  static async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.deleteNotification(req.params.id, req.user!.userId);
      res.status(200).json({
        status: 'success',
        message: 'Notification deleted',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/notifications
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationsService.createNotification(
        req.schoolId || req.user?.schoolId || '',
        req.user!.userId,
        req.body
      );
      res.status(201).json({
        status: 'success',
        message: 'Notification(s) dispatched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
