/**
 * @file academics.schema.ts
 * @description Zod validation schemas for academic structure (Academic Years, Classes, Sections, Subjects).
 */

import { z } from 'zod';

export const createAcademicYearSchema = z.object({
  body: z.object({
    name: z.string().min(4, 'e.g. 2026-2027'),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    isCurrent: z.boolean().default(false),
  }),
});

export const updateAcademicYearSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
  }),
});

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Class name is required (e.g. Class 10)'),
    numericOrder: z.number().int().default(0),
    initialSections: z.array(z.string()).optional().default(['A']),
  }),
});

export const createSectionSchema = z.object({
  body: z.object({
    classId: z.string().uuid('Invalid class ID'),
    name: z.string().min(1, 'Section name is required (e.g. A, B)'),
    roomNumber: z.string().optional(),
    capacity: z.number().int().positive().default(40),
  }),
});

export const createSubjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Subject name is required (e.g. Mathematics)'),
    code: z.string().min(2, 'Subject code is required (e.g. MATH101)'),
    type: z.enum(['CORE', 'ELECTIVE', 'LAB']).default('CORE'),
  }),
});

export const assignClassSubjectSchema = z.object({
  body: z.object({
    classId: z.string().uuid('Invalid class ID'),
    subjectId: z.string().uuid('Invalid subject ID'),
    teacherId: z.string().uuid('Invalid teacher ID').optional(),
  }),
});
