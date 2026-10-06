/**
 * @file timetable.routes.ts
 * @description Express routes for Timetable schedules.
 */

import { Router } from 'express';
import { TimetableController } from './timetable.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createTimetableEntrySchema,
  getTimetableQuerySchema,
} from './timetable.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// View timetable (available to all authenticated school roles)
router.get('/', validate(getTimetableQuerySchema), TimetableController.getTimetable);

// Management (School Admin / Super Admin)
router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createTimetableEntrySchema),
  TimetableController.createEntry
);

router.delete(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  TimetableController.deleteEntry
);

export const timetableRoutes = router;
