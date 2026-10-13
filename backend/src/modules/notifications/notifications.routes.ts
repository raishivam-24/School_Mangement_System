/**
 * @file notifications.routes.ts
 * @description Express routes for notification center and real-time alerts.
 */

import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createNotificationSchema, notificationQuerySchema } from './notifications.schema.js';

const router = Router();

// All notification operations require authentication
router.use(authenticate);

// List user notifications
router.get('/', validate(notificationQuerySchema), NotificationsController.list);

// Unread count badge
router.get('/unread-count', NotificationsController.getUnreadCount);

// Mark all as read
router.post('/read-all', NotificationsController.markAllAsRead);

// Create / Dispatch notification
router.post('/', validate(createNotificationSchema), NotificationsController.create);

// Mark single notification as read
router.patch('/:id/read', NotificationsController.markAsRead);

// Delete notification
router.delete('/:id', NotificationsController.deleteNotification);

export const notificationRoutes = router;
