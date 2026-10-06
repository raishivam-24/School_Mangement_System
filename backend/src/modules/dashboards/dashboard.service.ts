/**
 * @file dashboard.service.ts
 * @description Purpose-built aggregation service powering Super Admin and School Admin dashboards.
 * Directly fulfills Frontend Wireframe Section 4 & Section 8 requirements!
 */

import { prisma } from '../../db/prisma.js';
import { SchoolStatus } from '@prisma/client';

export class DashboardService {
  /**
   * Super Admin Platform Aggregated Dashboard
   * Matches Frontend Wireframe Section 4:
   * GET /api/v1/admin/dashboard
   */
  static async getSuperAdminDashboard() {
    const [
      totalSchools,
      activeSchools,
      totalStudents,
      totalTeachers,
      recentSchools,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { status: SchoolStatus.ACTIVE } }),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.school.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { students: true, teachers: true } },
          subscriptions: { take: 1, orderBy: { createdAt: 'desc' } },
        },
      }),
      prisma.schoolSubscription.findMany({
        where: { status: 'ACTIVE' },
        select: { amount: true },
      }),
    ]);

    const totalMonthlyRevenue = activeSubscriptions.reduce(
      (sum, s) => sum + Number(s.amount),
      0
    );

    return {
      stats: {
        totalSchools,
        activeSchools,
        suspendedSchools: totalSchools - activeSchools,
        totalStudents,
        totalTeachers,
        monthlyRevenue: totalMonthlyRevenue,
      },
      recentSchools: recentSchools.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        studentCount: s._count.students,
        teacherCount: s._count.teachers,
        plan: s.subscriptions[0]?.plan || 'BASIC',
        status: s.status,
        createdAt: s.createdAt,
      })),
    };
  }

  /**
   * School Admin Tenant Aggregated Dashboard
   * Matches Frontend Wireframe Section 8:
   * GET /api/v1/dashboard
   */
  static async getSchoolAdminDashboard(schoolId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      recentAnnouncements,
      upcomingExams,
      todayAttendances,
      allInvoices,
    ] = await Promise.all([
      prisma.student.count({ where: { schoolId, status: 'ACTIVE' } }),
      prisma.teacher.count({ where: { schoolId } }),
      prisma.class.count({ where: { schoolId } }),
      prisma.announcement.findMany({
        where: { schoolId, isPublished: true },
        take: 5,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { name: true } } },
      }),
      prisma.exam.findMany({
        where: { schoolId, endDate: { gte: today } },
        take: 3,
        orderBy: { startDate: 'asc' },
        include: { _count: { select: { subjects: true } } },
      }),
      prisma.attendance.findMany({
        where: { schoolId, date: today },
        include: { records: { select: { status: true } } },
      }),
      prisma.feeInvoice.findMany({
        where: { schoolId },
        select: { totalAmount: true, paidAmount: true, balanceAmount: true },
      }),
    ]);

    // Calculate today's school-wide attendance percentage
    let totalAttendanceMarked = 0;
    let totalPresent = 0;

    todayAttendances.forEach((att) => {
      att.records.forEach((rec) => {
        totalAttendanceMarked++;
        if (rec.status === 'PRESENT') totalPresent++;
      });
    });

    const attendanceRate =
      totalAttendanceMarked > 0
        ? Math.round((totalPresent / totalAttendanceMarked) * 100 * 10) / 10
        : 100;

    // Calculate Fee Totals
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;

    allInvoices.forEach((inv) => {
      totalBilled += Number(inv.totalAmount);
      totalCollected += Number(inv.paidAmount);
      totalPending += Number(inv.balanceAmount);
    });

    return {
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        todayAttendancePercentage: attendanceRate,
      },
      fees: {
        totalBilled,
        totalCollected,
        totalPending,
        collectionPercentage:
          totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100 * 10) / 10 : 0,
      },
      upcomingExams: upcomingExams.map((e) => ({
        id: e.id,
        name: e.name,
        term: e.term,
        startDate: e.startDate,
        endDate: e.endDate,
        subjectCount: e._count.subjects,
        status: e.status,
      })),
      recentAnnouncements: recentAnnouncements.map((a) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        priority: a.priority,
        author: a.author.name,
        createdAt: a.createdAt,
      })),
    };
  }
}
