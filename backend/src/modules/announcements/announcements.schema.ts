/**
 * @file announcements.schema.ts
 * @description Zod validation schemas for School Announcements and Notices.
 */

import { z } from 'zod';
import { AudienceType } from '@prisma/client';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title is required'),
    content: z.string().min(5, 'Content is required'),
    targetAudience: z.nativeEnum(AudienceType).default(AudienceType.ALL),
    targetClassId: z.string().uuid().optional(),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  }),
});

export const updateAnnouncementSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    title: z.string().min(2).optional(),
    content: z.string().min(5).optional(),
    targetAudience: z.nativeEnum(AudienceType).optional(),
    priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
    isPublished: z.boolean().optional(),
  }),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>['body'];
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>['body'];
