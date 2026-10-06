/**
 * @file error.middleware.ts
 * @description Global error handler middleware that catches AppErrors, Zod validation errors,
 * and Prisma database constraint violations, returning clean, secure JSON responses.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiError.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // 1. Handled Operational Application Errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
  }

  // 2. Zod Request Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request input data',
        details: formattedErrors,
      },
    });
  }

  // 3. Prisma Database Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (e.g. email already exists, code already taken)
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      return res.status(409).json({
        success: false,
        error: {
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: `A record with this ${target.join(', ')} already exists`,
          details: { target },
        },
      });
    }

    // Record not found during an update or delete
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: 'The requested record was not found in database',
        },
      });
    }
  }

  // 4. Unexpected / Unhandled Server Errors
  console.error('❌ Unhandled Server Error:', err);

  const isProd = env.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'An unexpected internal error occurred' : err.message,
      ...(!isProd && { stack: err.stack }),
    },
  });
};
