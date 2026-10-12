/**
 * @file assignments.schema.ts
 * @description Zod validation schemas for Assignments and Submissions.
 */

import { z } from 'zod';

export const createAssignmentSchema = z.object({
  body: z.object({
    academicYearId: z.string().uuid('Invalid academicYearId').optional(),
    classId: z.string().uuid('Invalid classId'),
    sectionId: z.string().uuid('Invalid sectionId').optional(),
    subjectId: z.string().uuid('Invalid subjectId'),
    title: z.string().min(2, 'Title is required'),
    description: z.string().min(5, 'Description is required'),
    dueDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    maxMarks: z.number().positive().default(100),
    attachmentUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const submitAssignmentSchema = z.object({
  params: z.object({ assignmentId: z.string().uuid() }),
  body: z.object({
    content: z.string().optional(),
    attachmentUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const gradeSubmissionSchema = z.object({
  params: z.object({ submissionId: z.string().uuid() }),
  body: z.object({
    marksObtained: z.number().min(0),
    feedback: z.string().optional(),
  }),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>['body'];
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>['body'];
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>['body'];
