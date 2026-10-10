/**
 * @file finance.service.ts
 * @description School Finance domain service handling Fee Structures, Invoices, Payment Collections, and Receipts.
 * Uses strict transactions to guarantee financial ledger integrity.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import {
  CreateFeeStructureInput,
  GenerateInvoicesInput,
  CollectPaymentInput,
  CreateFeeOrderInput,
  VerifyFeePaymentInput,
} from './finance.schema.js';
import { PaginationParams } from '../../utils/pagination.js';
import { InvoiceStatus, PaymentMethod, Prisma } from '@prisma/client';
import { razorpayInstance, verifyRazorpaySignature } from '../../config/razorpay.js';
import { env } from '../../config/env.js';

export class FinanceService {
  /**
   * Create a new fee structure with itemized breakdown
   */
  static async createFeeStructure(schoolId: string, input: CreateFeeStructureInput) {
    const totalAmount = input.items.reduce((acc, item) => acc + item.amount, 0);

    return prisma.feeStructure.create({
      data: {
        schoolId,
        academicYearId: input.academicYearId,
        classId: input.classId,
        name: input.name,
        frequency: input.frequency,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        totalAmount,
        items: {
          create: input.items.map((it) => ({
            name: it.name,
            amount: it.amount,
          })),
        },
      },
      include: {
        items: true,
        class: { select: { name: true } },
        academicYear: { select: { name: true } },
      },
    });
  }

  /**
   * List fee structures for the school
   */
  static async listFeeStructures(schoolId: string, academicYearId?: string) {
    return prisma.feeStructure.findMany({
      where: {
        schoolId,
        ...(academicYearId && { academicYearId }),
      },
      include: {
        items: true,
        class: { select: { id: true, name: true } },
        academicYear: { select: { id: true, name: true } },
        _count: { select: { invoices: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Bulk generate fee invoices for all active students in a class/section
   */
  static async generateInvoices(
    schoolId: string,
    input: GenerateInvoicesInput,
    actorUserId: string
  ) {
    const feeStructure = await prisma.feeStructure.findFirst({
      where: { id: input.feeStructureId, schoolId },
    });
    if (!feeStructure) {
      throw AppError.notFound('Fee structure not found');
    }

    // Find active enrolled students
    const enrollments = await prisma.enrollment.findMany({
      where: {
        schoolId,
        academicYearId: input.academicYearId,
        classId: input.classId,
        ...(input.sectionId && { sectionId: input.sectionId }),
        status: 'ACTIVE',
      },
      select: { studentId: true },
    });

    if (enrollments.length === 0) {
      throw AppError.badRequest('No active students found matching the selected class/section');
    }

    const dueDate = new Date(input.dueDate);
    const invoiceCount = await prisma.feeInvoice.count({ where: { schoolId } });

    return prisma.$transaction(async (tx) => {
      let createdCount = 0;
      let sequence = invoiceCount + 1;

      for (const en of enrollments) {
        // Check if invoice for this fee structure already exists for this student
        const existing = await tx.feeInvoice.findFirst({
          where: {
            schoolId,
            studentId: en.studentId,
            feeStructureId: input.feeStructureId,
            academicYearId: input.academicYearId,
          },
        });

        if (!existing) {
          const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sequence++).padStart(5, '0')}`;
          await tx.feeInvoice.create({
            data: {
              schoolId,
              studentId: en.studentId,
              feeStructureId: input.feeStructureId,
              academicYearId: input.academicYearId,
              invoiceNumber,
              totalAmount: feeStructure.totalAmount,
              discountAmount: 0,
              paidAmount: 0,
              balanceAmount: feeStructure.totalAmount,
              dueDate,
              status: InvoiceStatus.PENDING,
            },
          });
          createdCount++;
        }
      }

      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'FEE_INVOICES_GENERATED',
          entity: 'FeeInvoice',
          details: {
            feeStructureId: input.feeStructureId,
            generatedCount: createdCount,
          },
        },
      });

      return { generatedCount: createdCount, totalTargeted: enrollments.length };
    });
  }

  /**
   * List invoices with filters and search
   */
  static async listInvoices(
    schoolId: string,
    params: PaginationParams,
    filters: {
      studentId?: string;
      status?: InvoiceStatus;
      search?: string;
      academicYearId?: string;
    }
  ) {
    const where: Prisma.FeeInvoiceWhereInput = { schoolId };

    if (filters.studentId) where.studentId = filters.studentId;
    if (filters.status) where.status = filters.status;
    if (filters.academicYearId) where.academicYearId = filters.academicYearId;

    if (filters.search) {
      where.OR = [
        { invoiceNumber: { contains: filters.search, mode: 'insensitive' } },
        { student: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { student: { lastName: { contains: filters.search, mode: 'insensitive' } } },
        { student: { admissionNo: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const [total, invoices] = await Promise.all([
      prisma.feeInvoice.count({ where }),
      prisma.feeInvoice.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: {
              id: true,
              admissionNo: true,
              firstName: true,
              lastName: true,
              enrollments: {
                where: { status: 'ACTIVE' },
                take: 1,
                include: { class: true, section: true },
              },
            },
          },
          feeStructure: { select: { id: true, name: true } },
          academicYear: { select: { id: true, name: true } },
        },
      }),
    ]);

    const formatted = invoices.map((inv) => {
      const en = inv.student.enrollments[0];
      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        studentId: inv.student.id,
        studentName: `${inv.student.firstName} ${inv.student.lastName}`,
        admissionNo: inv.student.admissionNo,
        class: en?.class?.name || '-',
        section: en?.section?.name || '-',
        feeType: inv.feeStructure?.name || 'General Fee',
        totalAmount: Number(inv.totalAmount),
        paidAmount: Number(inv.paidAmount),
        balanceAmount: Number(inv.balanceAmount),
        dueDate: inv.dueDate,
        status: inv.status,
        createdAt: inv.createdAt,
      };
    });

    return { total, invoices: formatted };
  }

  /**
   * Collect payment against an invoice and update invoice balance atomically
   */
  static async collectPayment(
    schoolId: string,
    input: CollectPaymentInput,
    actorUserId: string
  ) {
    const invoice = await prisma.feeInvoice.findFirst({
      where: { id: input.feeInvoiceId, schoolId },
    });
    if (!invoice) {
      throw AppError.notFound('Fee invoice not found');
    }

    const currentBalance = Number(invoice.balanceAmount);
    if (input.amount > currentBalance) {
      throw AppError.badRequest(
        `Payment amount (₹${input.amount}) exceeds outstanding invoice balance (₹${currentBalance})`
      );
    }

    const paymentCount = await prisma.feePayment.count({ where: { schoolId } });
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(paymentCount + 1).padStart(5, '0')}`;

    return prisma.$transaction(async (tx) => {
      // 1. Record the Payment
      const payment = await tx.feePayment.create({
        data: {
          schoolId,
          feeInvoiceId: invoice.id,
          studentId: invoice.studentId,
          receiptNumber,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          transactionRef: input.transactionRef || null,
          remarks: input.remarks || null,
          paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
        },
      });

      // 2. Recalculate Invoice Balances
      const newPaidAmount = Number(invoice.paidAmount) + input.amount;
      const newBalanceAmount = Number(invoice.totalAmount) - Number(invoice.discountAmount) - newPaidAmount;
      const newStatus =
        newBalanceAmount <= 0 ? InvoiceStatus.PAID : InvoiceStatus.PARTIAL;

      const updatedInvoice = await tx.feeInvoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: newPaidAmount,
          balanceAmount: newBalanceAmount,
          status: newStatus,
        },
      });

      // 3. Audit Log
      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'FEE_PAYMENT_COLLECTED',
          entity: 'FeePayment',
          entityId: payment.id,
          details: {
            receiptNumber,
            amount: input.amount,
            invoiceId: invoice.id,
            newStatus,
          },
        },
      });

      return { payment, invoice: updatedInvoice };
    });
  }

  /**
   * Get aggregated school fee collection statistics for dashboards and reports
   */
  static async getFeeSummary(schoolId: string, academicYearId?: string) {
    const where: Prisma.FeeInvoiceWhereInput = {
      schoolId,
      ...(academicYearId && { academicYearId }),
    };

    const invoices = await prisma.feeInvoice.findMany({
      where,
      select: {
        totalAmount: true,
        paidAmount: true,
        balanceAmount: true,
        status: true,
      },
    });

    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let paidCount = 0;
    let partialCount = 0;
    let pendingCount = 0;

    invoices.forEach((inv) => {
      totalBilled += Number(inv.totalAmount);
      totalCollected += Number(inv.paidAmount);
      totalPending += Number(inv.balanceAmount);

      if (inv.status === 'PAID') paidCount++;
      else if (inv.status === 'PARTIAL') partialCount++;
      else pendingCount++;
    });

    return {
      totalInvoices: invoices.length,
      totalBilled,
      totalCollected,
      totalPending,
      collectionRate:
        totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100 * 10) / 10 : 0,
      breakdown: {
        paidInvoices: paidCount,
        partialInvoices: partialCount,
        pendingInvoices: pendingCount,
      },
    };
  }

  /**
   * Create Razorpay order for an invoice
   */
  static async createFeeOrder(schoolId: string, input: CreateFeeOrderInput) {
    if (!razorpayInstance || !env.RAZORPAY_KEY_ID) {
      throw AppError.badRequest('Razorpay gateway is not configured on the server');
    }

    const invoice = await prisma.feeInvoice.findFirst({
      where: { id: input.feeInvoiceId, schoolId },
    });
    if (!invoice) {
      throw AppError.notFound('Fee invoice not found');
    }

    const currentBalance = Number(invoice.balanceAmount);
    if (input.amount > currentBalance) {
      throw AppError.badRequest(
        `Payment amount (₹${input.amount}) exceeds outstanding balance (₹${currentBalance})`
      );
    }

    const amountInPaise = Math.round(input.amount * 100);
    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `inv_${invoice.id.slice(0, 8)}`,
      notes: {
        schoolId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID,
      feeInvoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
    };
  }

  /**
   * Verify Razorpay payment and collect fee payment
   */
  static async verifyAndCollectOnlinePayment(
    schoolId: string,
    input: VerifyFeePaymentInput,
    actorUserId: string
  ) {
    const isValid = verifyRazorpaySignature(
      input.razorpayOrderId,
      input.razorpayPaymentId,
      input.razorpaySignature
    );
    if (!isValid) {
      throw AppError.badRequest('Invalid Razorpay payment signature');
    }

    return FinanceService.collectPayment(
      schoolId,
      {
        feeInvoiceId: input.feeInvoiceId,
        amount: input.amount,
        paymentMethod: PaymentMethod.ONLINE,
        transactionRef: input.razorpayPaymentId,
        remarks: `Paid online via Razorpay (Order: ${input.razorpayOrderId})`,
      },
      actorUserId
    );
  }
}
