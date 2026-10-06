/**
 * @file teachers.schema.ts
 * @description Zod validation schemas for Teacher management.
 */

import { z } from 'zod';
import { Gender } from '@prisma/client';

export const createTeacherSchema = z.object({
  body: z.object({
    employeeId: z.string().min(1, 'Employee ID is required (e.g. TCH-001)'),
    name: z.string().min(2, 'Teacher full name is required'),
    email: z.string().email('Valid email address is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    designation: z.string().optional(),
    qualification: z.string().optional(),
    gender: z.nativeEnum(Gender).default(Gender.OTHER),
    phone: z.string().optional(),
    address: z.string().optional(),
    joiningDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  }),
});

export const updateTeacherSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(2).optional(),
    designation: z.string().optional(),
    qualification: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const listTeachersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    search: z.string().optional(),
  }),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>['body'];
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>['body'];
