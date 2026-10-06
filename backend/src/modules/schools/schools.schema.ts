/**
 * @file schools.schema.ts
 * @description Zod validation schemas for Super Admin school management.
 */

import { z } from 'zod';
import { SchoolStatus, SubscriptionPlan } from '@prisma/client';

export const createSchoolSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'School name is required'),
    code: z
      .string()
      .min(2, 'Code must be at least 2 characters')
      .max(20)
      .regex(/^[A-Z0-9_-]+$/i, 'Code must contain only alphanumeric, dash or underscore'),
    email: z.string().email('Valid school email required'),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    logoUrl: z.string().url().optional().or(z.literal('')),
    maxStudents: z.number().int().positive().default(1000),
    plan: z.nativeEnum(SubscriptionPlan).default(SubscriptionPlan.BASIC),
    // Initial School Admin creation credentials
    adminName: z.string().min(2, 'Admin full name is required'),
    adminEmail: z.string().email('Admin email is required'),
    adminPassword: z.string().min(8, 'Admin password must be at least 8 characters'),
  }),
});

export const updateSchoolSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid school ID'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    logoUrl: z.string().url().optional().or(z.literal('')),
    status: z.nativeEnum(SchoolStatus).optional(),
    maxStudents: z.number().int().positive().optional(),
  }),
});

export const getSchoolQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    search: z.string().optional(),
    status: z.nativeEnum(SchoolStatus).optional(),
  }),
});

export type CreateSchoolInput = z.infer<typeof createSchoolSchema>['body'];
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>['body'];
