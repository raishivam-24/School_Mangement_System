/**
 * @file students.service.ts
 * @description Student domain service handling student admission, multi-year enrollments, rich profile aggregations, and updates.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { hashPassword } from '../../utils/password.js';
import { CreateStudentInput, UpdateStudentInput } from './students.schema.js';
import { PaginationParams } from '../../utils/pagination.js';
import { Prisma, UserRole, UserStatus } from '@prisma/client';

export class StudentsService {
  /**
   * Admit a new student: creates student record, initial enrollment, and optional login account.
   */
  static async createStudent(schoolId: string, input: CreateStudentInput, actorUserId: string) {
    // 1. Check duplicate admission number within the school
    const existing = await prisma.student.findUnique({
      where: { schoolId_admissionNo: { schoolId, admissionNo: input.admissionNo } },
    });
    if (existing) {
      throw AppError.conflict(`Admission number "${input.admissionNo}" already exists in this school`);
    }

    // 2. Validate Class & Section exist in this tenant
    const section = await prisma.section.findFirst({
      where: { id: input.sectionId, classId: input.classId, schoolId },
    });
    if (!section) {
      throw AppError.badRequest('Selected class and section do not match or do not exist');
    }

    return prisma.$transaction(async (tx) => {
      let createdUserId: string | null = null;

      // Create login account if requested
      if (input.createLoginAccount && input.email && input.password) {
        const existingEmail = await tx.user.findUnique({
          where: { email: input.email.toLowerCase() },
        });
        if (existingEmail) {
          throw AppError.conflict(`Email "${input.email}" is already in use`);
        }

        const pwdHash = await hashPassword(input.password);
        const loginUser = await tx.user.create({
          data: {
            schoolId,
            name: `${input.firstName} ${input.lastName}`,
            email: input.email.toLowerCase(),
            passwordHash: pwdHash,
            role: UserRole.STUDENT,
            avatarUrl: input.avatarUrl || null,
          },
        });
        createdUserId = loginUser.id;
      }

      // Create Student profile
      const student = await tx.student.create({
        data: {
          schoolId,
          userId: createdUserId,
          parentId: input.parentId || null,
          admissionNo: input.admissionNo,
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: new Date(input.dateOfBirth),
          gender: input.gender,
          bloodGroup: input.bloodGroup,
          emergencyContact: input.emergencyContact,
          address: input.address,
        },
      });

      // Create initial Enrollment
      await tx.enrollment.create({
        data: {
          schoolId,
          studentId: student.id,
          academicYearId: input.academicYearId,
          classId: input.classId,
          sectionId: input.sectionId,
          rollNumber: input.rollNumber || null,
          status: 'ACTIVE',
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'STUDENT_ADMITTED',
          entity: 'Student',
          entityId: student.id,
          details: {
            admissionNo: student.admissionNo,
            name: `${student.firstName} ${student.lastName}`,
          },
        },
      });

      return student;
    });
  }

  /**
   * List students with filtering by class, section, academic year, status, and search string
   */
  static async listStudents(
    schoolId: string,
    params: PaginationParams,
    filters: {
      search?: string;
      classId?: string;
      sectionId?: string;
      academicYearId?: string;
      status?: UserStatus;
    }
  ) {
    const where: Prisma.StudentWhereInput = { schoolId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { admissionNo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filter by enrollment class/section/year if provided
    if (filters.classId || filters.sectionId || filters.academicYearId) {
      where.enrollments = {
        some: {
          ...(filters.classId && { classId: filters.classId }),
          ...(filters.sectionId && { sectionId: filters.sectionId }),
          ...(filters.academicYearId && { academicYearId: filters.academicYearId }),
          status: 'ACTIVE',
        },
      };
    }

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          enrollments: {
            where: { status: 'ACTIVE' },
            take: 1,
            include: {
              class: { select: { id: true, name: true } },
              section: { select: { id: true, name: true } },
              academicYear: { select: { id: true, name: true } },
            },
          },
          parent: {
            select: { id: true, phone: true, user: { select: { name: true, email: true } } },
          },
          user: {
            select: { id: true, avatarUrl: true, email: true },
          },
        },
      }),
    ]);

    const formatted = students.map((s) => {
      const activeEnrollment = s.enrollments[0];
      return {
        id: s.id,
        admissionNo: s.admissionNo,
        firstName: s.firstName,
        lastName: s.lastName,
        fullName: `${s.firstName} ${s.lastName}`,
        avatarUrl: s.user?.avatarUrl || null,
        gender: s.gender,
        dateOfBirth: s.dateOfBirth,
        status: s.status,
        class: activeEnrollment?.class?.name || 'Unassigned',
        classId: activeEnrollment?.class?.id || null,
        section: activeEnrollment?.section?.name || 'Unassigned',
        sectionId: activeEnrollment?.section?.id || null,
        rollNumber: activeEnrollment?.rollNumber || null,
        academicYear: activeEnrollment?.academicYear?.name || null,
        parentName: s.parent?.user?.name || null,
        parentPhone: s.parent?.phone || null,
        createdAt: s.createdAt,
      };
    });

    return { total, students: formatted };
  }

  /**
   * Get rich detail of a single student (profile, stats, attendance %, fee balances, history)
   * Directly matches Frontend Wireframe Section 11!
   */
  static async getStudentById(schoolId: string, studentId: string) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId },
      include: {
        parent: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        enrollments: {
          orderBy: { createdAt: 'desc' },
          include: {
            academicYear: true,
            class: true,
            section: true,
          },
        },
        attendanceRecords: {
          take: 30,
          orderBy: { createdAt: 'desc' },
          include: {
            attendance: { select: { date: true } },
          },
        },
        feeInvoices: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            payments: true,
          },
        },
        examResults: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            examSubject: {
              include: {
                exam: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw AppError.notFound('Student not found');
    }

    // Calculate Attendance Statistics
    const totalAttendanceCount = await prisma.attendanceRecord.count({
      where: { studentId: student.id },
    });
    const presentAttendanceCount = await prisma.attendanceRecord.count({
      where: { studentId: student.id, status: 'PRESENT' },
    });
    const attendancePercentage =
      totalAttendanceCount > 0
        ? Math.round((presentAttendanceCount / totalAttendanceCount) * 100 * 10) / 10
        : 100;

    // Calculate Fee Balance Summary
    let totalFeeAmount = 0;
    let totalPaidAmount = 0;
    let totalBalanceAmount = 0;

    student.feeInvoices.forEach((inv) => {
      totalFeeAmount += Number(inv.totalAmount);
      totalPaidAmount += Number(inv.paidAmount);
      totalBalanceAmount += Number(inv.balanceAmount);
    });

    return {
      student: {
        id: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        fullName: `${student.firstName} ${student.lastName}`,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        bloodGroup: student.bloodGroup,
        emergencyContact: student.emergencyContact,
        address: student.address,
        status: student.status,
        parent: student.parent,
        activeEnrollment: student.enrollments.find((e) => e.status === 'ACTIVE') || null,
        enrollmentHistory: student.enrollments,
        recentAttendance: student.attendanceRecords,
        recentInvoices: student.feeInvoices,
        recentResults: student.examResults,
      },
      stats: {
        attendancePercentage,
        totalAttendanceDays: totalAttendanceCount,
        presentDays: presentAttendanceCount,
        totalFees: totalFeeAmount,
        paidFees: totalPaidAmount,
        pendingFees: totalBalanceAmount,
      },
    };
  }

  /**
   * Update student profile information
   */
  static async updateStudent(
    schoolId: string,
    studentId: string,
    input: UpdateStudentInput,
    actorUserId: string
  ) {
    const existing = await prisma.student.findFirst({
      where: { id: studentId, schoolId },
    });
    if (!existing) {
      throw AppError.notFound('Student not found');
    }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...input,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        schoolId,
        userId: actorUserId,
        action: 'STUDENT_UPDATED',
        entity: 'Student',
        entityId: studentId,
        details: input as Prisma.JsonObject,
      },
    });

    return updated;
  }
}
