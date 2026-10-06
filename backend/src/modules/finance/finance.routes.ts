/**
 * @file finance.routes.ts
 * @description Express routes for school-level financial operations (Fees, Invoices, Payments).
 */

import { Router } from 'express';
import { FinanceController } from './finance.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireTenant } from '../../middleware/tenant.middleware.js';
import { requireRoles } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createFeeStructureSchema,
  generateInvoicesSchema,
  collectPaymentSchema,
} from './finance.schema.js';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate, requireTenant);

// Financial Overview / Stats (School Admin and Super Admin)
router.get(
  '/summary',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  FinanceController.getFeeSummary
);

// Fee Structures
router.get(
  '/structures',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  FinanceController.listFeeStructures
);
router.post(
  '/structures',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(createFeeStructureSchema),
  FinanceController.createFeeStructure
);

// Invoices
router.get(
  '/invoices',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.PARENT, UserRole.STUDENT, UserRole.SUPER_ADMIN),
  FinanceController.listInvoices
);
router.post(
  '/invoices/generate',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(generateInvoicesSchema),
  FinanceController.generateInvoices
);

// Payment Collection
router.post(
  '/payments/collect',
  requireRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN),
  validate(collectPaymentSchema),
  FinanceController.collectPayment
);

export const financeRoutes = router;
