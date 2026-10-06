/**
 * @file attendance.routes.ts
 * @description Express routes for daily attendance operations.
 */

import { Router } from 'express';
import { AttendanceController } from './attendance.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { getAttendanceSheetSchema, submitAttendanceSchema } from './attendance.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// Get attendance sheet for class & date (Teachers and Admins)
router.get(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  validate(getAttendanceSheetSchema),
  AttendanceController.getAttendanceSheet
);

// Submit / update attendance (Teachers and Admins)
router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  validate(submitAttendanceSchema),
  AttendanceController.submitAttendance
);

// View individual student's attendance history
router.get(
  '/student/:studentId',
  requireRoles(
    UserRole.SCHOOL_ADMIN,
    UserRole.TEACHER,
    UserRole.PARENT,
    UserRole.STUDENT,
    UserRole.SUPER_ADMIN
  ),
  AttendanceController.getStudentAttendance
);

export const attendanceRoutes = router;
