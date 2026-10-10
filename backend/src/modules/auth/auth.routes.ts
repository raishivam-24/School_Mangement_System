/**
 * @file auth.routes.ts
 * @description Express routes for user authentication.
 */

import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  loginSchema,
  changePasswordSchema,
  registerSchoolSchema,
  createSubscriptionOrderSchema,
} from './auth.schema.js';

const router = Router();

// Public routes
router.get('/payment-config', AuthController.getPaymentConfig);
router.post('/subscription-order', validate(createSubscriptionOrderSchema), AuthController.createSubscriptionOrder);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/register-school', validate(registerSchoolSchema), AuthController.registerSchool);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

export const authRoutes = router;
