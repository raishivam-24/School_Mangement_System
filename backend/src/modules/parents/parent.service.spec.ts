
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttendanceStatus } from '@prisma/client';

vi.mock('../../db/prisma.js', () => ({
  prisma: {
    parent: {
      findFirst: vi.fn(),
    },
    student: {
      findFirst: vi.fn(),
    },
    attendanceRecord: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
    feeInvoice: {
      findMany: vi.fn(),
    },
    enrollment: {
      findFirst: vi.fn(),
    },
    examSubject: {
      findMany: vi.fn(),
    },
    examResult: {
      findMany: vi.fn(),
    },
    announcement: {
      findMany: vi.fn(),
    },
    assignment: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../db/prisma.js';
import { ParentService } from './parent.service.js';

const db = vi.mocked(prisma);

describe('ParentService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getChildren', () => {
    it('returns children linked to the authenticated parent', async () => {
      const children = [
        {
          id: 'student-1',
          admissionNo: 'ADM001',
          firstName: 'Rahul',
          lastName: 'Sharma',
          dateOfBirth: new Date('2012-01-01'),
          status: 'ACTIVE',
        },
      ];

      vi.mocked(db.parent.findFirst).mockResolvedValue({
        id: 'parent-1',
        students: children,
      } as never);

      const result = await ParentService.getChildren(
        'school-1',
        'user-1',
      );

      expect(result).toEqual(children);
      expect(db.parent.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId: 'user-1',
            schoolId: 'school-1',
          },
        }),
      );
    });
  });

  describe('getAttendance', () => {
    it('rejects access to a student not linked to the parent', async () => {
      vi.mocked(db.student.findFirst).mockResolvedValue(null);

      await expect(
        ParentService.getAttendance(
          'school-1',
          'parent-user-1',
          'unlinked-student',
        ),
      ).rejects.toMatchObject({
        statusCode: 403,
      });

      expect(db.attendanceRecord.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getFees', () => {
    it('returns zero outstanding dues when all invoices are paid', async () => {
      vi.mocked(db.student.findFirst).mockResolvedValue({
        id: 'student-1',
        firstName: 'Rahul',
        lastName: 'Sharma',
      } as never);

      vi.mocked(db.feeInvoice.findMany).mockResolvedValue([
        {
          id: 'invoice-1',
          invoiceNumber: 'INV001',
          totalAmount: 1000,
          discountAmount: 0,
          paidAmount: 1000,
          balanceAmount: 0,
          dueDate: new Date('2026-10-01'),
          status: 'PAID',
          feeStructure: null,
          payments: [],
        },
      ] as never);

      const result = await ParentService.getFees(
        'school-1',
        'parent-user-1',
        'student-1',
      );

      expect(result.outstandingDues).toBe(0);
      expect(result.invoices).toHaveLength(1);
      expect(result.invoices[0].balanceAmount).toBe(0);
    });
  });
});
