/**
 * @file teachers.routes.ts
 * @description Express routes for Teacher management.
 */

import { Router } from 'express';
import { TeachersController } from './teachers.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createTeacherSchema,
  updateTeacherSchema,
  listTeachersQuerySchema,
} from './teachers.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

router.get(
  '/',
  validate(listTeachersQuerySchema),
  TeachersController.listTeachers
);

router.get('/:id', TeachersController.getTeacherById);

router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createTeacherSchema),
  TeachersController.createTeacher
);

router.patch(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(updateTeacherSchema),
  TeachersController.updateTeacher
);

export const teacherRoutes = router;
