
import { Router } from 'express';
import { UserRole } from '@prisma/client';

import { ParentController } from './parent.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

import {
  parentDashboardSchema,
  parentStudentParamsSchema,
} from './parent.schema.js';

const router = Router();

// All parent routes require authentication, a school tenant,
// and the PARENT role.
router.use(authenticate, requireTenant, requireRoles(UserRole.PARENT));

// GET /api/v1/parent/children
router.get('/children', ParentController.getChildren);

// GET /api/v1/parent/dashboard?studentId=<uuid>
router.get(
  '/dashboard',
  validate(parentDashboardSchema),
  ParentController.getDashboard
);

// GET /api/v1/parent/children/:studentId/attendance
router.get(
  '/children/:studentId/attendance',
  validate(parentStudentParamsSchema),
  ParentController.getAttendance
);

// GET /api/v1/parent/children/:studentId/fees
router.get(
  '/children/:studentId/fees',
  validate(parentStudentParamsSchema),
  ParentController.getFees
);

export const parentRoutes = router;
