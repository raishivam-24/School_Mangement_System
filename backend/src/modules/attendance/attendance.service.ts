/**
 * @file attendance.service.ts
 * @description Attendance domain service for taking daily attendance, managing class rosters, and calculating attendance summaries.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { SubmitAttendanceInput } from './attendance.schema.js';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceService {
  /**
   * Get class attendance sheet for a given date.
   * Returns list of all enrolled students in the section with their marked status (or null if not taken yet).
   */
  static async getAttendanceSheet(
    schoolId: string,
    query: { date: string; classId: string; sectionId: string }
  ) {
    const targetDate = new Date(query.date);

    // 1. Fetch active enrollments in this section
    const enrollments = await prisma.enrollment.findMany({
      where: {
        schoolId,
        classId: query.classId,
        sectionId: query.sectionId,
        status: 'ACTIVE',
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNo: true,
            firstName: true,
            lastName: true,
            gender: true,
            status: true,
          },
        },
      },
      orderBy: { rollNumber: 'asc' },
    });

    if (enrollments.length === 0) {
      throw AppError.notFound('No active students found in this class and section');
    }

    // 2. Fetch existing attendance record for this date if already taken
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        sectionId_date: {
          sectionId: query.sectionId,
          date: targetDate,
        },
      },
      include: {
        records: true,
      },
    });

    const statusMap = new Map<string, { status: AttendanceStatus; reason?: string | null }>();
    if (existingAttendance) {
      existingAttendance.records.forEach((r) => {
        statusMap.set(r.studentId, { status: r.status, reason: r.reason });
      });
    }

    // 3. Map students with their status
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;

    const roster = enrollments.map((en) => {
      const recorded = statusMap.get(en.student.id);
      const status: AttendanceStatus = recorded?.status || AttendanceStatus.PRESENT;

      if (status === 'PRESENT') presentCount++;
      if (status === 'ABSENT') absentCount++;
      if (status === 'LATE') lateCount++;

      return {
        studentId: en.student.id,
        admissionNo: en.student.admissionNo,
        name: `${en.student.firstName} ${en.student.lastName}`,
        rollNumber: en.rollNumber,
        status,
        reason: recorded?.reason || null,
      };
    });

    return {
      attendanceId: existingAttendance?.id || null,
      date: query.date,
      isMarked: !!existingAttendance,
      summary: {
        totalStudents: roster.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        percentage:
          roster.length > 0 ? Math.round((presentCount / roster.length) * 100 * 10) / 10 : 100,
      },
      students: roster,
    };
  }

  /**
   * Submit or update batch attendance for a class section on a date.
   * Atomic operation using a database transaction.
   */
  static async submitAttendance(
    schoolId: string,
    input: SubmitAttendanceInput,
    actorUserId: string
  ) {
    const targetDate = new Date(input.date);

    return prisma.$transaction(async (tx) => {
      // 1. Upsert the Attendance Header
      const attendance = await tx.attendance.upsert({
        where: {
          sectionId_date: {
            sectionId: input.sectionId,
            date: targetDate,
          },
        },
        create: {
          schoolId,
          academicYearId: input.academicYearId,
          classId: input.classId,
          sectionId: input.sectionId,
          date: targetDate,
          takenById: actorUserId,
          remarks: input.remarks || null,
        },
        update: {
          takenById: actorUserId,
          remarks: input.remarks || null,
        },
      });

      // 2. Upsert each student record
      for (const record of input.records) {
        await tx.attendanceRecord.upsert({
          where: {
            attendanceId_studentId: {
              attendanceId: attendance.id,
              studentId: record.studentId,
            },
          },
          create: {
            attendanceId: attendance.id,
            studentId: record.studentId,
            status: record.status,
            reason: record.reason || null,
          },
          update: {
            status: record.status,
            reason: record.reason || null,
          },
        });
      }

      // 3. Create Audit Log
      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'ATTENDANCE_SUBMITTED',
          entity: 'Attendance',
          entityId: attendance.id,
          details: {
            date: input.date,
            classId: input.classId,
            sectionId: input.sectionId,
            count: input.records.length,
          },
        },
      });

      return attendance;
    });
  }

  /**
   * Get attendance records for a specific student across a date range
   */
  static async getStudentAttendance(
    schoolId: string,
    studentId: string,
    query: { startDate?: string; endDate?: string }
  ) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId },
    });
    if (!student) {
      throw AppError.notFound('Student not found');
    }

    const whereClause: { studentId: string; attendance?: { schoolId: string; date?: { gte?: Date; lte?: Date } } } = {
      studentId,
      attendance: {
        schoolId,
      },
    };

    if (query.startDate || query.endDate) {
      whereClause.attendance!.date = {
        ...(query.startDate && { gte: new Date(query.startDate) }),
        ...(query.endDate && { lte: new Date(query.endDate) }),
      };
    }

    const records = await prisma.attendanceRecord.findMany({
      where: whereClause,
      orderBy: { attendance: { date: 'desc' } },
      include: {
        attendance: {
          select: { date: true, remarks: true },
        },
      },
    });

    const totalDays = records.length;
    const presentDays = records.filter((r) => r.status === 'PRESENT').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100 * 10) / 10 : 100;

    return {
      studentId,
      summary: {
        totalDays,
        presentDays,
        absentDays: records.filter((r) => r.status === 'ABSENT').length,
        lateDays: records.filter((r) => r.status === 'LATE').length,
        percentage,
      },
      records: records.map((r) => ({
        id: r.id,
        date: r.attendance.date,
        status: r.status,
        reason: r.reason,
      })),
    };
  }
}
