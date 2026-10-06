/**
 * @file rbac.middleware.ts
 * @description Role-Based Access Control (RBAC) guard middleware.
 * Restricts route access to specified user roles (e.g. SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, etc.).
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/apiError.js';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Forbidden. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
        )
      );
    }

    next();
  };
};
