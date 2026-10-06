/**
 * @file reports.service.ts
 * @description Structured reporting service for attendance rates, fee collections, and student performance.
 * Matches Frontend Wireframe Section 18 & Architecture Section 26.
 */

import { prisma } from '../../db/prisma.js';

export class ReportsService {
  /**
   * Attendance summary report across students in a class/section over date range
   */
  static async getAttendanceReport(
    schoolId: string,
    filters: { classId: string; sectionId?: string; startDate: string; endDate: string }
  ) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);

    const students = await prisma.student.findMany({
      where: {
        schoolId,
        enrollments: {
          some: {
            classId: filters.classId,
            ...(filters.sectionId && { sectionId: filters.sectionId }),
            status: 'ACTIVE',
          },
        },
      },
      include: {
        attendanceRecords: {
          where: {
            attendance: {
              date: { gte: start, lte: end },
            },
          },
        },
      },
    });

    let overallDays = 0;
    let overallPresent = 0;

    const studentList = students.map((s) => {
      const totalDays = s.attendanceRecords.length;
      const presentDays = s.attendanceRecords.filter((r) => r.status === 'PRESENT').length;
      const absentDays = s.attendanceRecords.filter((r) => r.status === 'ABSENT').length;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100 * 10) / 10 : 100;

      overallDays += totalDays;
      overallPresent += presentDays;

      return {
        id: s.id,
        admissionNo: s.admissionNo,
        name: `${s.firstName} ${s.lastName}`,
        totalDays,
        presentDays,
        absentDays,
        percentage,
      };
    });

    const averageAttendance =
      overallDays > 0 ? Math.round((overallPresent / overallDays) * 100 * 10) / 10 : 100;

    return {
      dateRange: { startDate: filters.startDate, endDate: filters.endDate },
      classId: filters.classId,
      overallAttendanceRate: averageAttendance,
      studentsCount: students.length,
      students: studentList,
    };
  }

  /**
   * Fee collection and outstanding balance report
   */
  static async getFeeReport(schoolId: string, academicYearId?: string) {
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        schoolId,
        ...(academicYearId && { academicYearId }),
      },
      include: {
        class: { select: { name: true } },
        invoices: {
          select: {
            totalAmount: true,
            paidAmount: true,
            balanceAmount: true,
            status: true,
          },
        },
      },
    });

    const summaryByFeeStructure = feeStructures.map((fs) => {
      let billed = 0;
      let collected = 0;
      let pending = 0;

      fs.invoices.forEach((inv) => {
        billed += Number(inv.totalAmount);
        collected += Number(inv.paidAmount);
        pending += Number(inv.balanceAmount);
      });

      return {
        id: fs.id,
        name: fs.name,
        class: fs.class.name,
        invoicesCount: fs.invoices.length,
        totalBilled: billed,
        totalCollected: collected,
        totalPending: pending,
        collectionPercentage: billed > 0 ? Math.round((collected / billed) * 100 * 10) / 10 : 0,
      };
    });

    return {
      feeStructures: summaryByFeeStructure,
    };
  }
}
