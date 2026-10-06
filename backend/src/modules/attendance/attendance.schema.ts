/**
 * @file attendance.schema.ts
 * @description Zod validation schemas for Class & Student attendance operations.
 */

import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';

export const getAttendanceSheetSchema = z.object({
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
    classId: z.string().uuid('Invalid class ID'),
    sectionId: z.string().uuid('Invalid section ID'),
  }),
});

export const submitAttendanceSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
    academicYearId: z.string().uuid('Invalid academicYearId'),
    classId: z.string().uuid('Invalid classId'),
    sectionId: z.string().uuid('Invalid sectionId'),
    remarks: z.string().optional(),
    records: z
      .array(
        z.object({
          studentId: z.string().uuid('Invalid student ID'),
          status: z.nativeEnum(AttendanceStatus),
          reason: z.string().optional(),
        })
      )
      .min(1, 'At least one student record is required'),
  }),
});

export type SubmitAttendanceInput = z.infer<typeof submitAttendanceSchema>['body'];
