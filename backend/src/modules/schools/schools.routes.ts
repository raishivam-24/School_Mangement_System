/**
 * @file schools.routes.ts
 * @description Super Admin school management routes.
 */

import { Router } from 'express';
import { SchoolsController } from './schools.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createSchoolSchema, updateSchoolSchema, getSchoolQuerySchema } from './schools.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Public endpoint: Search active schools for login dropdown
router.get('/public', SchoolsController.listPublicSchools);

// All subsequent school management endpoints require Super Admin authentication
router.use(authenticate, requireRoles(UserRole.SUPER_ADMIN));

router.post('/', validate(createSchoolSchema), SchoolsController.createSchool);
router.get('/', validate(getSchoolQuerySchema), SchoolsController.listSchools);
router.get('/:id', SchoolsController.getSchool);
router.patch('/:id', validate(updateSchoolSchema), SchoolsController.updateSchool);

export const schoolRoutes = router;
