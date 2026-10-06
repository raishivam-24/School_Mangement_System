/**
 * @file finance.schema.ts
 * @description Zod validation schemas for School Fee Structures, Invoices, and Payments.
 */

import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const createFeeStructureSchema = z.object({
  body: z.object({
    academicYearId: z.string().uuid('Invalid academicYearId'),
    classId: z.string().uuid('Invalid classId'),
    name: z.string().min(2, 'e.g. Annual Tuition Fee 2026'),
    frequency: z.enum(['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'ANNUALLY']).default('ONE_TIME'),
    dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
    items: z
      .array(
        z.object({
          name: z.string().min(1, 'Item name is required (e.g. Tuition, Lab, Sports)'),
          amount: z.number().positive('Item amount must be positive'),
        })
      )
      .min(1, 'At least one fee breakdown item is required'),
  }),
});

export const generateInvoicesSchema = z.object({
  body: z.object({
    academicYearId: z.string().uuid(),
    feeStructureId: z.string().uuid(),
    classId: z.string().uuid(),
    sectionId: z.string().uuid().optional(), // If omitted, generates for whole class
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
  }),
});

export const collectPaymentSchema = z.object({
  body: z.object({
    feeInvoiceId: z.string().uuid('Invalid feeInvoiceId'),
    amount: z.number().positive('Payment amount must be greater than zero'),
    paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
    transactionRef: z.string().optional(),
    remarks: z.string().optional(),
    paidAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  }),
});

export type CreateFeeStructureInput = z.infer<typeof createFeeStructureSchema>['body'];
export type GenerateInvoicesInput = z.infer<typeof generateInvoicesSchema>['body'];
export type CollectPaymentInput = z.infer<typeof collectPaymentSchema>['body'];
