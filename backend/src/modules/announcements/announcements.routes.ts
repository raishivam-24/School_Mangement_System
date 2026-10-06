/**
 * @file announcements.routes.ts
 * @description Express routes for Announcements.
 */

import { Router } from 'express';
import { AnnouncementsController } from './announcements.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from './announcements.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// Read announcements (available to all authenticated school users)
router.get('/', AnnouncementsController.listAnnouncements);

// Publishing & Managing (Admins & Teachers)
router.post(
  '/',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN),
  validate(createAnnouncementSchema),
  AnnouncementsController.createAnnouncement
);

router.patch(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(updateAnnouncementSchema),
  AnnouncementsController.updateAnnouncement
);

router.delete(
  '/:id',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  AnnouncementsController.deleteAnnouncement
);

export const announcementRoutes = router;
