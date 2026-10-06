/**
 * @file timetable.schema.ts
 * @description Zod validation schemas for Class & Teacher Timetable schedules.
 */

import { z } from 'zod';
import { DayOfWeek } from '@prisma/client';

export const createTimetableEntrySchema = z.object({
  body: z.object({
    academicYearId: z.string().uuid(),
    classId: z.string().uuid(),
    sectionId: z.string().uuid(),
    subjectId: z.string().uuid(),
    teacherId: z.string().uuid().optional(),
    dayOfWeek: z.nativeEnum(DayOfWeek),
    periodNumber: z.number().int().min(1).max(12),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'e.g. 09:00'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'e.g. 09:45'),
    roomNumber: z.string().optional(),
  }),
});

export const getTimetableQuerySchema = z.object({
  query: z.object({
    classId: z.string().uuid().optional(),
    sectionId: z.string().uuid().optional(),
    teacherId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
  }),
});

export type CreateTimetableEntryInput = z.infer<typeof createTimetableEntrySchema>['body'];
