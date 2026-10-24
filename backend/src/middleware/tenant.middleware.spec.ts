/**
 * @file tenant.middleware.spec.ts
 * @description Unit tests for Multi-Tenant Isolation Middleware.
 * Verifies that requests without authentication or tenant context are strictly rejected,
 * and that active school tenants are resolved and attached.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireTenant } from './tenant.middleware.js';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../db/prisma.js';

// Mock Prisma
vi.mock('../db/prisma.js', () => ({
  prisma: {
    school: {
      findUnique: vi.fn(),
    },
  },
}));

describe('Multi-Tenant Security Middleware (requireTenant)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject request with 401 when user is not authenticated', async () => {
    const req = {
      headers: {},
      query: {},
      user: undefined,
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireTenant(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('Authentication required');
  });

  it('should reject request with 403 when school user has no registered schoolId', async () => {
    const req = {
      headers: {},
      query: {},
      user: {
        userId: 'usr-123',
        email: 'teacher@unknown.edu',
        role: UserRole.TEACHER,
        schoolId: null,
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireTenant(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.statusCode).toBe(403);
    expect(error.message).toContain('User does not belong to any school tenant');
  });

  it('should attach schoolId and call next() when school tenant is active', async () => {
    vi.mocked(prisma.school.findUnique).mockResolvedValue({
      id: 'sch-dps-001',
      name: 'Delhi Public Academy',
      status: 'ACTIVE' as any,
    } as any);

    const req = {
      headers: {},
      query: {},
      user: {
        userId: 'usr-123',
        email: 'teacher@dps.edu',
        role: UserRole.TEACHER,
        schoolId: 'sch-dps-001',
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireTenant(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.schoolId).toBe('sch-dps-001');
  });

  it('should reject access with 403 when school tenant is SUSPENDED', async () => {
    vi.mocked(prisma.school.findUnique).mockResolvedValue({
      id: 'sch-suspended-999',
      name: 'Suspended Academy',
      status: 'SUSPENDED' as any,
    } as any);

    const req = {
      headers: {},
      query: {},
      user: {
        userId: 'usr-456',
        email: 'teacher@suspended.edu',
        role: UserRole.TEACHER,
        schoolId: 'sch-suspended-999',
      },
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await requireTenant(req, res, next);

    const error = next.mock.calls[0][0];
    expect(error).toBeDefined();
    expect(error.statusCode).toBe(403);
    expect(error.message).toContain('suspended');
  });
});
