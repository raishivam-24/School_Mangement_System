/**
 * @file auth.middleware.ts
 * @description Authentication guard middleware.
 * Verifies JWT access token extracted from HttpOnly cookies (default) or Authorization Bearer header (fallback).
 * Populates `req.user` with authenticated identity and tenant metadata.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/apiError.js';
import { prisma } from '../db/prisma.js';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1. Check HttpOnly cookie first
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2. Fallback to Authorization Header (Bearer token)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next(AppError.unauthorized('Authentication required. Please login.'));
    }

    // 3. Verify JWT payload
    const decoded = verifyAccessToken(token);

    // 4. Verify user is still active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, schoolId: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      return next(AppError.unauthorized('User account is inactive or not found'));
    }

    // 5. Attach authenticated user to request context
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    next();
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired. Please refresh token.', 401, 'TOKEN_EXPIRED'));
    }
    return next(AppError.unauthorized('Invalid authentication token'));
  }
};
