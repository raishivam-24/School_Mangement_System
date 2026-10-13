/**
 * @file notifications.schema.ts
 * @description Zod validation schemas for Notification domain actions.
 */

import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(150, 'Title cannot exceed 150 characters'),
    message: z.string().min(3, 'Message must be at least 3 characters').max(1000, 'Message cannot exceed 1000 characters'),
    type: z.enum(['INFO', 'WARNING', 'SUCCESS', 'ALERT', 'ACADEMIC', 'FEE', 'ATTENDANCE', 'ANNOUNCEMENT']).default('INFO'),
    link: z.string().optional().nullable(),
    targetUserId: z.string().uuid().optional().nullable(),
    targetAudience: z.enum(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS']).optional().nullable(),
  }),
});

export const notificationQuerySchema = z.object({
  query: z.object({
    unreadOnly: z.enum(['true', 'false']).optional(),
    type: z.string().optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
  }).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];
export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>['query'];
