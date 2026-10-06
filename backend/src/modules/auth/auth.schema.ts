/**
 * @file auth.schema.ts
 * @description Zod input validation schemas for authentication endpoints.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

export const registerSchoolSchema = z.object({
  body: z.object({
    // School Details
    schoolName: z.string().min(2, 'School name is required'),
    schoolCode: z
      .string()
      .min(2, 'School code must be at least 2 characters')
      .max(20)
      .regex(/^[A-Z0-9_-]+$/i, 'Code must contain only alphanumeric characters, dashes, or underscores'),
    schoolEmail: z.string().email('Valid school email is required'),
    schoolPhone: z.string().optional(),
    schoolAddress: z.string().optional(),
    // Plan chosen on landing page
    plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']).default('BASIC'),
    billingCycle: z.enum(['MONTHLY', 'ANNUALLY']).default('MONTHLY'),
    // Initial Admin Account
    adminName: z.string().min(2, 'Admin full name is required'),
    adminEmail: z.string().email('Admin email is required'),
    adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type RegisterSchoolInput = z.infer<typeof registerSchoolSchema>['body'];
