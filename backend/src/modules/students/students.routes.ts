/**
 * @file students.routes.ts
 * @description Express routes for Student management.
 */

import { Router } from 'express';
import { StudentsController } from './students.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createStudentSchema,
  updateStudentSchema,
  listStudentsQuerySchema,
} from './students.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// Listing & Detailed views (accessible by School Admin, Teachers, and Super Admin)
router.get(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  validate(listStudentsQuerySchema),
  StudentsController.listStudents
);

router.get(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT, UserRole.SUPER_ADMIN),
  StudentsController.getStudentById
);

// Admission & Modifications restricted to School Admin / Super Admin
router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createStudentSchema),
  StudentsController.createStudent
);

router.patch(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(updateStudentSchema),
  StudentsController.updateStudent
);

export const studentRoutes = router;
