/**
 * @file dashboard.routes.ts
 * @description Express routes for Dashboard data aggregation.
 */

import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Super Admin Platform Dashboard: /api/v1/admin/dashboard
router.get(
  '/admin/dashboard',
  authenticate,
  requireRoles(UserRole.SUPER_ADMIN),
  DashboardController.getSuperAdminDashboard
);

// School Admin Tenant Dashboard: /api/v1/dashboard
router.get(
  '/dashboard',
  authenticate,
  requireTenant,
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  DashboardController.getSchoolAdminDashboard
);

export const dashboardRoutes = router;
