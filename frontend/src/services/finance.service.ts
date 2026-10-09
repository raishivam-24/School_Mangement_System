/**
 * @file finance.service.ts
 * @description API service for School Finance, Fee Structures, Invoices, and Payment Collections.
 */

import { api } from '../lib/api';
import type {
  FeeSummary,
  FeeInvoice,
  CollectPaymentInput,
  CreateFeeStructureInput,
  GenerateInvoicesInput,
} from '../types';

export const financeService = {
  /** Get aggregated school fee metrics */
  getSummary: async (academicYearId?: string): Promise<FeeSummary> => {
    const res = await api.get('/finance/summary', { params: { academicYearId } });
    return res.data?.data || {
      totalInvoices: 0,
      totalBilled: 0,
      totalCollected: 0,
      totalPending: 0,
      collectionRate: 0,
    };
  },

  /** List fee invoices with filters */
  getInvoices: async (params?: { studentId?: string; status?: string; search?: string; limit?: number }): Promise<FeeInvoice[]> => {
    const res = await api.get('/finance/invoices', { params: { limit: 50, ...params } });
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];
    return raw.map((inv: any) => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber || inv.invoiceNo,
      invoiceNo: inv.invoiceNumber || inv.invoiceNo,
      studentId: inv.studentId,
      studentName: inv.studentName,
      admissionNo: inv.admissionNo,
      class: inv.class ? (inv.section ? `${inv.class}-${inv.section}` : inv.class) : 'Class 10-A',
      section: inv.section,
      feeType: inv.feeType || 'Tuition Fee',
      totalAmount: inv.totalAmount ?? inv.total ?? 0,
      total: inv.totalAmount ?? inv.total ?? 0,
      paidAmount: inv.paidAmount ?? inv.paid ?? 0,
      paid: inv.paidAmount ?? inv.paid ?? 0,
      balanceAmount: inv.balanceAmount ?? inv.balance ?? 0,
      balance: inv.balanceAmount ?? inv.balance ?? 0,
      dueDate: inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '15 Oct 2026',
      status: inv.status,
      createdAt: inv.createdAt,
    }));
  },

  /** Record fee collection against an invoice */
  collectPayment: async (data: CollectPaymentInput): Promise<any> => {
    const res = await api.post('/finance/payments/collect', data);
    return res.data.data;
  },

  /** Create a new fee structure */
  createFeeStructure: async (data: CreateFeeStructureInput): Promise<any> => {
    const res = await api.post('/finance/structures', data);
    return res.data.data;
  },

  /** Bulk generate invoices for a class */
  generateInvoices: async (data: GenerateInvoicesInput): Promise<any> => {
    const res = await api.post('/finance/invoices/generate', data);
    return res.data.data;
  },
};
