/**
 * @file exams.schema.ts
 * @description Zod validation schemas for Exams, Subject schedules, Marks entry, and Results.
 */

import { z } from 'zod';
import { ExamStatus } from '@prisma/client';

export const createExamSchema = z.object({
  body: z.object({
    academicYearId: z.string().uuid('Invalid academicYearId'),
    name: z.string().min(2, 'e.g. Mid-Term Examination 2026'),
    term: z.string().optional(),
    startDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    endDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  }),
});

export const addExamSubjectSchema = z.object({
  params: z.object({ examId: z.string().uuid() }),
  body: z.object({
    classId: z.string().uuid('Invalid classId'),
    subjectId: z.string().uuid('Invalid subjectId'),
    examDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    startTime: z.string().min(1, 'e.g. 09:30'),
    endTime: z.string().min(1, 'e.g. 12:30'),
    maxMarks: z.number().positive().default(100),
    passMarks: z.number().positive().default(33),
    roomNumber: z.string().optional(),
  }),
});

export const submitExamMarksSchema = z.object({
  body: z.object({
    examSubjectId: z.string().uuid('Invalid examSubjectId'),
    marks: z
      .array(
        z.object({
          studentId: z.string().uuid('Invalid student ID'),
          marksObtained: z.number().min(0, 'Marks cannot be negative'),
          remarks: z.string().optional(),
        })
      )
      .min(1, 'At least one student mark entry is required'),
  }),
});

export type CreateExamInput = z.infer<typeof createExamSchema>['body'];
export type AddExamSubjectInput = z.infer<typeof addExamSubjectSchema>['body'];
export type SubmitExamMarksInput = z.infer<typeof submitExamMarksSchema>['body'];
