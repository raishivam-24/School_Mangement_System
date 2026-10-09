/**
 * @file finance.types.ts
 * @description Domain types for School Finance, Fee Structures, Invoices, and Payment Collections.
 */

export interface FeeSummary {
  totalInvoices: number;
  totalBilled: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  breakdown?: {
    paidInvoices: number;
    partialInvoices: number;
    pendingInvoices: number;
  };
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  invoiceNo?: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  class: string;
  section?: string;
  feeType: string;
  totalAmount: number;
  total?: number;
  paidAmount: number;
  paid?: number;
  balanceAmount: number;
  balance?: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
  createdAt?: string;
}

export interface StudentFeeInstallment {
  id: string;
  installmentName: string;
  quarter: string;
  invoiceNo: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  receiptNo?: string;
  paidOn?: string;
  paymentMode?: string;
  transactionRef?: string;
  breakdown: { item: string; amount: number }[];
}

export interface CollectPaymentInput {
  feeInvoiceId: string;
  amount: number;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'ONLINE_UPI' | 'CARD' | 'DEMAND_DRAFT';
  transactionRef?: string;
  remarks?: string;
}

export interface CreateFeeStructureInput {
  academicYearId: string;
  classId: string;
  name: string;
  frequency?: 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  dueDate?: string;
  items: Array<{ name: string; amount: number }>;
}

export interface GenerateInvoicesInput {
  academicYearId: string;
  feeStructureId: string;
  classId: string;
  sectionId?: string;
  dueDate: string;
}
