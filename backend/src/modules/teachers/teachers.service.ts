/**
 * @file teachers.service.ts
 * @description Teacher service handling teacher registration, user account provisioning, classes/subjects taught, and schedule.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { hashPassword } from '../../utils/password.js';
import { CreateTeacherInput, UpdateTeacherInput } from './teachers.schema.js';
import { PaginationParams } from '../../utils/pagination.js';
import { Prisma, UserRole } from '@prisma/client';

export class TeachersService {
  /**
   * Create teacher profile and linked user login
   */
  static async createTeacher(schoolId: string, input: CreateTeacherInput, actorUserId: string) {
    const existingEmployee = await prisma.teacher.findUnique({
      where: { schoolId_employeeId: { schoolId, employeeId: input.employeeId } },
    });
    if (existingEmployee) {
      throw AppError.conflict(`Employee ID "${input.employeeId}" already exists`);
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existingEmail) {
      throw AppError.conflict(`Email "${input.email}" is already registered`);
    }

    const passwordHash = await hashPassword(input.password);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          schoolId,
          email: input.email.toLowerCase(),
          passwordHash,
          name: input.name,
          role: UserRole.TEACHER,
          phone: input.phone,
          avatarUrl: input.avatarUrl || null,
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          schoolId,
          userId: user.id,
          employeeId: input.employeeId,
          designation: input.designation,
          qualification: input.qualification,
          gender: input.gender,
          phone: input.phone,
          address: input.address,
          joiningDate: input.joiningDate ? new Date(input.joiningDate) : new Date(),
        },
        include: {
          user: { select: { id: true, name: true, email: true, status: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'TEACHER_CREATED',
          entity: 'Teacher',
          entityId: teacher.id,
          details: { name: input.name, employeeId: input.employeeId },
        },
      });

      return teacher;
    });
  }

  /**
   * List teachers with assigned subjects and classes
   */
  static async listTeachers(
    schoolId: string,
    params: PaginationParams,
    filters: { search?: string }
  ) {
    const where: Prisma.TeacherWhereInput = { schoolId };

    if (filters.search) {
      where.OR = [
        { employeeId: { contains: filters.search, mode: 'insensitive' } },
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [total, teachers] = await Promise.all([
      prisma.teacher.count({ where }),
      prisma.teacher.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, status: true, avatarUrl: true } },
          classSubjects: {
            include: {
              class: { select: { id: true, name: true } },
              subject: { select: { id: true, name: true, code: true } },
            },
          },
        },
      }),
    ]);

    const formatted = teachers.map((t) => ({
      id: t.id,
      employeeId: t.employeeId,
      name: t.user.name,
      email: t.user.email,
      phone: t.phone,
      gender: t.gender,
      designation: t.designation || 'Teacher',
      qualification: t.qualification,
      status: t.user.status,
      assignedSubjects: t.classSubjects.map((cs) => ({
        class: cs.class.name,
        subject: cs.subject.name,
      })),
      createdAt: t.createdAt,
    }));

    return { total, teachers: formatted };
  }

  /**
   * Get teacher detail with full schedule and assigned subjects
   */
  static async getTeacherById(schoolId: string, teacherId: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
      include: {
        user: { select: { id: true, name: true, email: true, status: true, avatarUrl: true, lastLoginAt: true } },
        classSubjects: {
          include: {
            class: true,
            subject: true,
          },
        },
        timetables: {
          include: {
            class: true,
            section: true,
            subject: true,
          },
        },
        assignments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            class: true,
            section: true,
            subject: true,
            _count: { select: { submissions: true } },
          },
        },
      },
    });

    if (!teacher) {
      throw AppError.notFound('Teacher not found');
    }

    return teacher;
  }

  /**
   * Update teacher details
   */
  static async updateTeacher(
    schoolId: string,
    teacherId: string,
    input: UpdateTeacherInput,
    actorUserId: string
  ) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, schoolId },
    });
    if (!teacher) {
      throw AppError.notFound('Teacher not found');
    }

    return prisma.$transaction(async (tx) => {
      if (input.name) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: { name: input.name, phone: input.phone },
        });
      }

      const updated = await tx.teacher.update({
        where: { id: teacherId },
        data: {
          designation: input.designation,
          qualification: input.qualification,
          gender: input.gender,
          phone: input.phone,
          address: input.address,
        },
        include: { user: { select: { id: true, name: true, email: true } } },
      });

      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'TEACHER_UPDATED',
          entity: 'Teacher',
          entityId: teacherId,
        },
      });

      return updated;
    });
  }
}
