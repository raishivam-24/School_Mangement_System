/**
 * @file students.schema.ts
 * @description Zod validation schemas for Student management.
 */

import { z } from 'zod';
import { Gender, UserStatus } from '@prisma/client';

export const createStudentSchema = z.object({
  body: z.object({
    admissionNo: z.string().min(1, 'Admission number is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    gender: z.nativeEnum(Gender).default(Gender.OTHER),
    bloodGroup: z.string().optional(),
    emergencyContact: z.string().optional(),
    address: z.string().optional(),
    // Initial Enrollment Link
    academicYearId: z.string().uuid('Valid academicYearId required'),
    classId: z.string().uuid('Valid classId required'),
    sectionId: z.string().uuid('Valid sectionId required'),
    rollNumber: z.string().optional(),
    // Optional Parent Link
    parentId: z.string().uuid().optional(),
    // Optional User Login creation for student
    createLoginAccount: z.boolean().default(false),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  }),
});

export const updateStudentSchema = z.object({
  params: z.object({ id: z.string().uuid('Invalid student ID') }),
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    bloodGroup: z.string().optional(),
    emergencyContact: z.string().optional(),
    address: z.string().optional(),
    status: z.nativeEnum(UserStatus).optional(),
    parentId: z.string().uuid().nullable().optional(),
  }),
});

export const listStudentsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    search: z.string().optional(),
    classId: z.string().uuid().optional(),
    sectionId: z.string().uuid().optional(),
    academicYearId: z.string().uuid().optional(),
    status: z.nativeEnum(UserStatus).optional(),
  }),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>['body'];
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>['body'];
