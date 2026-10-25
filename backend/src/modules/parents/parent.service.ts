import { AttendanceStatus, Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';

export class ParentService {
  /**
   * Returns students linked to the authenticated parent
   * within the current school.
   */
  static async getChildren(schoolId: string, userId: string) {
    const parent = await prisma.parent.findFirst({
      where: {
        userId,
        schoolId,
      },
      select: {
        id: true,
        students: {
          where: { schoolId },
          select: {
            id: true,
            admissionNo: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            status: true,
          },
          orderBy: { firstName: 'asc' },
        },
      },
    });

    if (!parent) {
      throw AppError.notFound('Parent profile not found');
    }

    return parent.students;
  }

  /**
   * Verifies that the student belongs to this parent and school.
   */
  private static async getAuthorizedStudent(
    schoolId: string,
    userId: string,
    studentId: string,
  ) {
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        schoolId,
        parent: {
          is: {
            userId,
            schoolId,
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!student) {
      throw AppError.forbidden(
        'You do not have access to this student',
      );
    }

    return student;
  }

  /**
   * Returns attendance history and monthly breakdown.
   */
  static async getAttendance(
    schoolId: string,
    userId: string,
    studentId: string,
  ) {
    await this.getAuthorizedStudent(schoolId, userId, studentId);

    const records = await prisma.attendanceRecord.findMany({
      where: {
        studentId,
        attendance: {
          is: { schoolId },
        },
      },
      select: {
        id: true,
        status: true,
        reason: true,
        attendance: {
          select: {
            date: true,
            remarks: true,
          },
        },
      },
      orderBy: {
        attendance: { date: 'desc' },
      },
      take: 100,
    });

    const isCountedStatus = (status: AttendanceStatus) =>
      status === AttendanceStatus.PRESENT ||
      status === AttendanceStatus.ABSENT ||
      status === AttendanceStatus.LATE ||
      status === AttendanceStatus.HALF_DAY;

    const presentDays = records.filter(
      (record) => record.status === AttendanceStatus.PRESENT,
    ).length;

    const countedDays = records.filter(
      (record) => isCountedStatus(record.status),
    ).length;

    const monthlyBreakdown = new Map<
      string,
      { total: number; present: number; absent: number; late: number }
    >();

    for (const record of records) {
      const month = record.attendance.date.toISOString().slice(0, 7);

      const entry = monthlyBreakdown.get(month) ?? {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
      };

      if (isCountedStatus(record.status)) {
        entry.total++;
      }

      if (record.status === AttendanceStatus.PRESENT) {
        entry.present++;
      }

      if (record.status === AttendanceStatus.ABSENT) {
        entry.absent++;
      }

      if (record.status === AttendanceStatus.LATE) {
        entry.late++;
      }

      monthlyBreakdown.set(month, entry);
    }

    return {
      studentId,
      summary: {
        recordsReturned: records.length,
        presentDays,
        attendancePercentage:
          countedDays === 0
            ? 0
            : Math.round((presentDays / countedDays) * 1000) / 10,
      },
      monthlyBreakdown: Array.from(
        monthlyBreakdown,
        ([month, values]) => ({
          month,
          ...values,
        }),
      ),
      records: records.map((record) => ({
        id: record.id,
        date: record.attendance.date,
        status: record.status,
        reason: record.reason,
        remarks: record.attendance.remarks,
      })),
    };
  }

  /**
   * Returns invoices and payment receipts for a linked child.
   */
  static async getFees(
    schoolId: string,
    userId: string,
    studentId: string,
  ) {
    await this.getAuthorizedStudent(schoolId, userId, studentId);

    const invoices = await prisma.feeInvoice.findMany({
      where: {
        schoolId,
        studentId,
      },
      include: {
        feeStructure: {
          select: {
            name: true,
            items: {
              select: {
                name: true,
                amount: true,
              },
            },
          },
        },
        payments: {
          where: { schoolId },
          select: {
            id: true,
            receiptNumber: true,
            amount: true,
            paymentMethod: true,
            transactionRef: true,
            paidAt: true,
          },
          orderBy: { paidAt: 'desc' },
        },
      },
      orderBy: { dueDate: 'desc' },
      take: 100,
    });

    const outstandingDues = invoices.reduce(
      (total, invoice) =>
        total + Math.max(0, Number(invoice.balanceAmount)),
      0,
    );

    return {
      studentId,
      outstandingDues,
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        feeType: invoice.feeStructure?.name ?? 'General Fee',
        totalAmount: Number(invoice.totalAmount),
        discountAmount: Number(invoice.discountAmount),
        paidAmount: Number(invoice.paidAmount),
        balanceAmount: Number(invoice.balanceAmount),
        dueDate: invoice.dueDate,
        status: invoice.status,
        items: (invoice.feeStructure?.items ?? []).map((item) => ({
          name: item.name,
          amount: Number(item.amount),
        })),
        receipts: invoice.payments.map((payment) => ({
          id: payment.id,
          receiptNumber: payment.receiptNumber,
          amount: Number(payment.amount),
          paymentMethod: payment.paymentMethod,
          transactionRef: payment.transactionRef,
          paidAt: payment.paidAt,
        })),
      })),
    };
  }

  /**
   * Builds the dashboard for a student linked to this parent.
   */
  static async getDashboard(
    schoolId: string,
    userId: string,
    studentId: string,
  ) {
    const student = await this.getAuthorizedStudent(
      schoolId,
      userId,
      studentId,
    );

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    // Find the student's current class and section.
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        schoolId,
        studentId,
        status: 'ACTIVE',
      },
      orderBy: {
        enrollmentDate: 'desc',
      },
      select: {
        classId: true,
        sectionId: true,
        class: { select: { name: true } },
        section: { select: { name: true } },
      },
    });

    // Today's attendance.
    const todayRecord = await prisma.attendanceRecord.findFirst({
      where: {
        studentId,
        attendance: {
          is: {
            schoolId,
            date: {
              gte: startOfToday,
              lt: startOfTomorrow,
            },
          },
        },
      },
      select: {
        status: true,
        reason: true,
      },
    });

    // Count all eligible attendance records.
    const attendanceFilter: Prisma.AttendanceRecordWhereInput = {
      studentId,
      attendance: {
        is: { schoolId },
      },
      status: {
        in: [
          AttendanceStatus.PRESENT,
          AttendanceStatus.ABSENT,
          AttendanceStatus.LATE,
          AttendanceStatus.HALF_DAY,
        ],
      },
    };

    const [totalAttendance, presentAttendance] = await Promise.all([
      prisma.attendanceRecord.count({
        where: attendanceFilter,
      }),
      prisma.attendanceRecord.count({
        where: {
          ...attendanceFilter,
          status: AttendanceStatus.PRESENT,
        },
      }),
    ]);

    // Outstanding fee invoices.
    const invoices = await prisma.feeInvoice.findMany({
      where: {
        schoolId,
        studentId,
        balanceAmount: { gt: 0 },
      },
      select: {
        id: true,
        invoiceNumber: true,
        balanceAmount: true,
        dueDate: true,
        status: true,
      },
      orderBy: { dueDate: 'asc' },
      take: 100,
    });

    const outstandingDues = invoices.reduce(
      (total, invoice) => total + Number(invoice.balanceAmount),
      0,
    );

    // Upcoming exams for the student's current class.
    const upcomingExams = enrollment
      ? await prisma.examSubject.findMany({
          where: {
            classId: enrollment.classId,
            examDate: { gte: startOfToday },
            exam: {
              is: {
                schoolId,
                status: 'UPCOMING',
              },
            },
          },
          select: {
            id: true,
            examDate: true,
            startTime: true,
            endTime: true,
            roomNumber: true,
            subject: { select: { name: true } },
            exam: {
              select: {
                name: true,
                term: true,
              },
            },
          },
          orderBy: { examDate: 'asc' },
          take: 5,
        })
      : [];

    // Latest results for this student, scoped to the school.
    const latestResults = await prisma.examResult.findMany({
      where: {
        studentId,
        examSubject: {
          is: {
            ...(enrollment ? { classId: enrollment.classId } : {}),
            exam: { is: { schoolId } },
          },
        },
      },
      select: {
        id: true,
        marksObtained: true,
        grade: true,
        remarks: true,
        examSubject: {
          select: {
            maxMarks: true,
            subject: { select: { name: true } },
            exam: {
              select: {
                name: true,
                term: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    // Recent published circulars for the school and child's class.
    const circulars = await prisma.announcement.findMany({
      where: {
        schoolId,
        isPublished: true,
        OR: [
          { targetClassId: null },
          ...(enrollment ? [{ targetClassId: enrollment.classId }] : []),
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        priority: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Recent homework and submission status.
    const assignments = enrollment
      ? await prisma.assignment.findMany({
          where: {
            schoolId,
            classId: enrollment.classId,
            sectionId: enrollment.sectionId,
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            title: true,
            dueDate: true,
            subject: { select: { name: true } },
            submissions: {
              where: { studentId },
              select: {
                status: true,
                submittedAt: true,
              },
              take: 1,
            },
          },
          orderBy: { dueDate: 'asc' },
          take: 3,
        })
      : [];

    const resultPercentage = latestResults.map((result) => {
      const maximum = Number(result.examSubject.maxMarks);
      const obtained = Number(result.marksObtained);

      return {
        ...result,
        marksObtained: obtained,
        maxMarks: maximum,
        percentage:
          maximum > 0
            ? Math.round((obtained / maximum) * 1000) / 10
            : null,
      };
    });

    return {
      student,
      enrollment,
      attendance: {
        todayStatus: todayRecord?.status ?? null,
        todayReason: todayRecord?.reason ?? null,
        presentDays: presentAttendance,
        totalDays: totalAttendance,
        percentage:
          totalAttendance > 0
            ? Math.round(
                (presentAttendance / totalAttendance) * 1000,
              ) / 10
            : 0,
        meets75PercentThreshold:
          totalAttendance > 0 &&
          (presentAttendance / totalAttendance) * 100 >= 75,
      },
      fees: {
        outstandingDues,
        unpaidInvoiceCount: invoices.length,
        invoices,
      },
      upcomingExams,
      latestResults: resultPercentage,
      circulars,
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        subject: assignment.subject.name,
        submissionStatus:
          assignment.submissions[0]?.status ?? 'NOT_SUBMITTED',
        submittedAt: assignment.submissions[0]?.submittedAt ?? null,
      })),
    };
  }
}