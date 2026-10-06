/**
 * @file tenant.middleware.ts
 * @description Multi-tenancy resolution and isolation middleware.
 * Ensures all tenant-scoped operations are securely locked to the authenticated user's `schoolId`.
 * Prevents cross-tenant data access attacks and checks school subscription/status.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiError.js';
import { prisma } from '../db/prisma.js';

export const requireTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    let tenantId: string | null = null;

    // If Super Admin, allow setting target school via header or query, otherwise require explicit school selection
    if (req.user.role === 'SUPER_ADMIN') {
      const headerSchoolId = req.headers['x-school-id'] as string;
      const querySchoolId = req.query.schoolId as string;
      tenantId = headerSchoolId || querySchoolId || null;

      if (!tenantId) {
        return next(
          AppError.badRequest(
            'Super Admin must provide target schoolId via header (x-school-id) or query (?schoolId=)'
          )
        );
      }
    } else {
      // Normal School User: Tenant is strictly bound to user's registered schoolId
      if (!req.user.schoolId) {
        return next(AppError.forbidden('User does not belong to any school tenant'));
      }
      tenantId = req.user.schoolId;
    }

    // Verify school existence and check active status
    const school = await prisma.school.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, status: true },
    });

    if (!school) {
      return next(AppError.notFound('School tenant not found'));
    }

    if (school.status === 'SUSPENDED') {
      return next(
        AppError.forbidden('School access has been suspended. Please contact platform support.')
      );
    }

    if (school.status === 'EXPIRED') {
      return next(
        AppError.forbidden('School subscription has expired. Please renew subscription.')
      );
    }

    // Attach resolved tenant ID to request
    req.schoolId = school.id;

    next();
  } catch (error) {
    next(error);
  }
};
