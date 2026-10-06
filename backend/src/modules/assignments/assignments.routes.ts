/**
 * @file assignments.routes.ts
 * @description Express routes for Homework, Assignments, Submissions, and Grading.
 */

import { Router } from 'express';
import { AssignmentsController } from './assignments.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAssignmentSchema,
  submitAssignmentSchema,
  gradeSubmissionSchema,
} from './assignments.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// List & View assignments
router.get('/', AssignmentsController.listAssignments);
router.get('/:id', AssignmentsController.getAssignmentById);

// Create Assignment (Teachers & Admins)
router.post(
  '/',
  requireRoles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createAssignmentSchema),
  AssignmentsController.createAssignment
);

// Submit Homework (Students)
router.post(
  '/:assignmentId/submit',
  requireRoles(UserRole.STUDENT),
  validate(submitAssignmentSchema),
  AssignmentsController.submitAssignment
);

// Grade Submission (Teachers & Admins)
router.post(
  '/submissions/:submissionId/grade',
  requireRoles(UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(gradeSubmissionSchema),
  AssignmentsController.gradeSubmission
);

export const assignmentRoutes = router;
