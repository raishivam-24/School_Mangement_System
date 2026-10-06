/**
 * @file schools.service.ts
 * @description Business logic for managing school tenants, onboarding, subscriptions, and platform usage metrics.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { hashPassword } from '../../utils/password.js';
import { CreateSchoolInput, UpdateSchoolInput } from './schools.schema.js';
import { PaginationParams } from '../../utils/pagination.js';
import { Prisma, SchoolStatus, UserRole } from '@prisma/client';

export class SchoolsService {
  /**
   * Create a new School tenant along with initial School Admin user, default Academic Year, and Subscription.
   * Atomic operation using a database transaction.
   */
  static async createSchool(input: CreateSchoolInput, superAdminUserId: string) {
    const existingCode = await prisma.school.findUnique({
      where: { code: input.code.toUpperCase() },
    });
    if (existingCode) {
      throw AppError.conflict(`School code "${input.code}" is already in use`);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.adminEmail.toLowerCase() },
    });
    if (existingUser) {
      throw AppError.conflict(`Admin email "${input.adminEmail}" is already registered`);
    }

    const adminPasswordHash = await hashPassword(input.adminPassword);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the School Tenant
      const school = await tx.school.create({
        data: {
          name: input.name,
          code: input.code.toUpperCase(),
          email: input.email.toLowerCase(),
          phone: input.phone,
          address: input.address,
          website: input.website || null,
          logoUrl: input.logoUrl || null,
          status: SchoolStatus.ACTIVE,
          maxStudents: input.maxStudents,
        },
      });

      // 2. Create the initial School Admin User
      const adminUser = await tx.user.create({
        data: {
          schoolId: school.id,
          name: input.adminName,
          email: input.adminEmail.toLowerCase(),
          passwordHash: adminPasswordHash,
          role: UserRole.SCHOOL_ADMIN,
        },
      });

      // 3. Create initial Academic Year (e.g. Current Year)
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      await tx.academicYear.create({
        data: {
          schoolId: school.id,
          name: `${currentYear}-${nextYear}`,
          startDate: new Date(`${currentYear}-04-01`),
          endDate: new Date(`${nextYear}-03-31`),
          isCurrent: true,
        },
      });

      // 4. Create initial Subscription record
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 days trial/initial cycle

      await tx.schoolSubscription.create({
        data: {
          schoolId: school.id,
          plan: input.plan,
          status: 'ACTIVE',
          amount: input.plan === 'PRO' ? 99 : input.plan === 'ENTERPRISE' ? 299 : 29,
          startDate: new Date(),
          endDate,
          nextBillingDate: endDate,
        },
      });

      // 5. Create Audit Log
      await tx.auditLog.create({
        data: {
          schoolId: school.id,
          userId: superAdminUserId,
          action: 'SCHOOL_CREATED',
          entity: 'School',
          entityId: school.id,
          details: { name: school.name, code: school.code, plan: input.plan },
        },
      });

      return { school, adminUser };
    });

    return result;
  }

  /**
   * List schools with search, status filters, and counts (students, teachers)
   */
  static async listSchools(
    params: PaginationParams,
    filters: { search?: string; status?: SchoolStatus }
  ) {
    const where: Prisma.SchoolWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [total, schools] = await Promise.all([
      prisma.school.count({ where }),
      prisma.school.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              students: true,
              teachers: true,
              classes: true,
            },
          },
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      }),
    ]);

    const formatted = schools.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      email: s.email,
      phone: s.phone,
      status: s.status,
      maxStudents: s.maxStudents,
      studentCount: s._count.students,
      teacherCount: s._count.teachers,
      classCount: s._count.classes,
      currentPlan: s.subscriptions[0]?.plan || 'BASIC',
      subscriptionStatus: s.subscriptions[0]?.status || 'ACTIVE',
      createdAt: s.createdAt,
    }));

    return { total, schools: formatted };
  }

  /**
   * Get rich detail of a single school for Super Admin inspection
   */
  static async getSchoolById(schoolId: string) {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            classes: true,
            sections: true,
            users: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        platformInvoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        academicYears: {
          orderBy: { createdAt: 'desc' },
        },
        users: {
          where: { role: UserRole.SCHOOL_ADMIN },
          select: { id: true, name: true, email: true, status: true, lastLoginAt: true },
        },
      },
    });

    if (!school) {
      throw AppError.notFound('School not found');
    }

    return school;
  }

  /**
   * Update school tenant metadata or status
   */
  static async updateSchool(
    schoolId: string,
    input: UpdateSchoolInput,
    superAdminUserId: string
  ) {
    const existing = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!existing) {
      throw AppError.notFound('School not found');
    }

    const updated = await prisma.school.update({
      where: { id: schoolId },
      data: input,
    });

    await prisma.auditLog.create({
      data: {
        schoolId,
        userId: superAdminUserId,
        action: 'SCHOOL_UPDATED',
        entity: 'School',
        entityId: schoolId,
        details: input as Prisma.JsonObject,
      },
    });

    return updated;
  }

  /**
   * Public lightweight list of active schools for the frontend login dropdown / search bar
   */
  static async listPublicSchools(search?: string) {
    const where: Prisma.SchoolWhereInput = {
      status: { in: [SchoolStatus.ACTIVE, SchoolStatus.TRIAL] },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    return prisma.school.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        logoUrl: true,
        address: true,
      },
      orderBy: { name: 'asc' },
      take: 50,
    });
  }
}

