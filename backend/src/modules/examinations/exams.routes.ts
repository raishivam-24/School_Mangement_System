/**
 * @file exams.routes.ts
 * @description Express routes for Examinations, Marks, and Report Cards.
 */

import { Router } from 'express';
import { ExamsController } from './exams.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createExamSchema,
  addExamSubjectSchema,
  submitExamMarksSchema,
} from './exams.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// Listing & Detail
router.get('/', ExamsController.listExams);
router.get('/:id', ExamsController.getExamDetails);

// Report Cards (Accessible by Admin, Teachers, Parents, Students)
router.get(
  '/:examId/report-card/:studentId',
  requireRoles(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.SUPER_ADMIN
  ),
  ExamsController.getStudentReportCard
);

// Exam Creation & Scheduling (School Admin / Super Admin)
router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createExamSchema),
  ExamsController.createExam
);

router.post(
  '/:examId/subjects',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(addExamSubjectSchema),
  ExamsController.addExamSubject
);

// Marks Entry (Teachers and Admins)
router.post(
  '/marks',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  validate(submitExamMarksSchema),
  ExamsController.submitMarks
);

export const examRoutes = router;
