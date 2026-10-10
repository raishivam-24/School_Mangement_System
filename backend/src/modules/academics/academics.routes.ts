/**
 * @file academics.routes.ts
 * @description Academic management routes for school structure (Years, Classes, Sections, Subjects).
 */

import { Router } from 'express';
import { AcademicsController } from './academics.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAcademicYearSchema,
  createClassSchema,
  createSectionSchema,
  createSubjectSchema,
  assignClassSubjectSchema,
} from './academics.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Academic routes require tenant authentication
router.use(authenticate, requireTenant);

// Read endpoints accessible by School Admins and Teachers
router.get('/years', AcademicsController.listAcademicYears);
router.get('/classes', AcademicsController.listClasses);
router.get('/classes/:id', AcademicsController.getClassById);
router.get('/subjects', AcademicsController.listSubjects);

// Mutation endpoints restricted to School Admin / Super Admin
router.post(
  '/years',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createAcademicYearSchema),
  AcademicsController.createAcademicYear
);
router.patch(
  '/years/:id/set-current',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  AcademicsController.setCurrentAcademicYear
);
router.post(
  '/classes',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createClassSchema),
  AcademicsController.createClass
);
router.post(
  '/sections',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createSectionSchema),
  AcademicsController.createSection
);
router.post(
  '/subjects',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createSubjectSchema),
  AcademicsController.createSubject
);
router.post(
  '/classes/assign-subject',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(assignClassSubjectSchema),
  AcademicsController.assignClassSubject
);

// 1-Click CBSE Starter Kit for newly created schools
router.post(
  '/starter-pack',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  AcademicsController.initializeStarterPack
);

export const academicRoutes = router;
