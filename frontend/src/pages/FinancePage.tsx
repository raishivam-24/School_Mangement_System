/**
 * @file FinancePage.tsx
 * @description Role-Aware School Finance & Fee Portal.
 * - Students & Parents strictly see their personal fee ledger, installment schedule,
 *   downloadable payment receipts, itemized CBSE fee structure, and online UPI payment portal.
 * - Administrators & Accountants see school-wide revenue metrics, collection rates,
 *   bulk invoice tools, and the master student ledger.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import {
  DollarSign,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  X,
  Check,
  ShieldCheck,
  AlertCircle,
  Building2,
  QrCode,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Printer,
  Calendar,
  User,
  ArrowRight,
  HelpCircle,
  Smartphone,
  Landmark,
} from 'lucide-react';
import { useAuth, type AuthUser } from '../context/AuthContext';

// =========================================================================
// DATA MODELS FOR STUDENT PERSONAL FEES
// =========================================================================
interface StudentFeeInstallment {
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

// Initial mock fee installments for logged-in student (Rahul Sharma, Class 10-A)
const initialStudentInstallments: StudentFeeInstallment[] = [
  {
    id: 'inst_1',
    installmentName: 'Quarter 1 Academic & Activity Fee',
    quarter: 'Term 1 (Apr – Jun 2026)',
    invoiceNo: 'INV-2026-0001-Q1',
    totalAmount: 20000,
    paidAmount: 20000,
    balanceAmount: 0,
    dueDate: '10 Apr 2026',
    status: 'PAID',
    receiptNo: 'REC-2026-0412',
    paidOn: '10 Apr 2026',
    paymentMode: 'UPI (GPay / HDFC Bank)',
    transactionRef: 'UPI/410294829104',
    breakdown: [
      { item: 'Tuition Fee (Q1)', amount: 12000 },
      { item: 'Science & Computer Lab Maintenance', amount: 4000 },
      { item: 'Smart Class & Digital LMS Portal', amount: 2000 },
      { item: 'Library & Sports Facility', amount: 2000 },
    ],
  },
  {
    id: 'inst_2',
    installmentName: 'Quarter 2 Academic & Lab Fee',
    quarter: 'Term 1 (Jul – Sep 2026)',
    invoiceNo: 'INV-2026-0001-Q2',
    totalAmount: 20000,
    paidAmount: 20000,
    balanceAmount: 0,
    dueDate: '10 Jul 2026',
    status: 'PAID',
    receiptNo: 'REC-2026-0891',
    paidOn: '08 Jul 2026',
    paymentMode: 'NetBanking (SBI NetBanking)',
    transactionRef: 'NEFT/SBIN84920481',
    breakdown: [
      { item: 'Tuition Fee (Q2)', amount: 12000 },
      { item: 'Science & Computer Lab Maintenance', amount: 4000 },
      { item: 'Smart Class & Digital LMS Portal', amount: 2000 },
      { item: 'Library & Sports Facility', amount: 2000 },
    ],
  },
  {
    id: 'inst_3',
    installmentName: 'Quarter 3 Academic & Board Registration Fee',
    quarter: 'Term 2 (Oct – Dec 2026)',
    invoiceNo: 'INV-2026-0001-Q3',
    totalAmount: 5000,
    paidAmount: 0,
    balanceAmount: 5000,
    dueDate: '15 Oct 2026',
    status: 'PENDING',
    breakdown: [
      { item: 'CBSE Class 10 Board Exam Registration', amount: 3000 },
      { item: 'Pre-Board Mock Exam Printing & Logistics', amount: 2000 },
    ],
  },
];

// =========================================================================
// 1. STUDENT PERSONAL FEES & RECEIPTS VIEW
// =========================================================================
const StudentPersonalFeesView: React.FC<{ user: AuthUser | null }> = ({ user }) => {
  const [installments, setInstallments] = useState<StudentFeeInstallment[]>(initialStudentInstallments);
  const [activeTab, setActiveTab] = useState<'INSTALLMENTS' | 'STRUCTURE' | 'BANK_INFO'>('INSTALLMENTS');

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<StudentFeeInstallment | null>(null);
  const [payingInstallment, setPayingInstallment] = useState<StudentFeeInstallment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('rahul.parent@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Load live student fee invoices from backend
  const fetchStudentInvoices = async () => {
    try {
      const studentId = user?.studentProfile?.id;
      const res = await api.get(studentId ? `/finance/invoices?studentId=${studentId}` : '/finance/invoices');
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      if (list.length > 0) {
        setInstallments(
          list.map((inv: any) => ({
            id: inv.id,
            installmentName: inv.feeType || 'Quarterly Academic Fee',
            quarter: `Term Session (${inv.class || 'Class 10'})`,
            invoiceNo: inv.invoiceNumber || inv.invoiceNo,
            totalAmount: inv.totalAmount ?? inv.total ?? 0,
            paidAmount: inv.paidAmount ?? inv.paid ?? 0,
            balanceAmount: inv.balanceAmount ?? inv.balance ?? 0,
            dueDate: inv.dueDate
              ? new Date(inv.dueDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '15 Oct 2026',
            status: inv.status === 'PAID' ? 'PAID' : inv.status === 'PARTIAL' ? 'PARTIAL' : 'PENDING',
            receiptNo: `REC-${(inv.invoiceNumber || '2026').replace('INV-', '')}`,
            paidOn: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            paymentMode: 'Online UPI Portal',
            breakdown: [
              { item: inv.feeType || 'Tuition & Academic Consumables', amount: inv.totalAmount ?? inv.total ?? 0 },
            ],
          }))
        );
      }
    } catch (err) {
      console.warn('Could not load live student invoices, using local record:', err);
    }
  };

  useEffect(() => {
    fetchStudentInvoices();
  }, [user]);

  // Derived financial statistics
  const totalBilled = installments.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = installments.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalBalance = installments.reduce((acc, curr) => acc + curr.balanceAmount, 0);
  const percentCleared = ((totalPaid / totalBilled) * 100).toFixed(1);

  // Handle simulated / live online payment
  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInstallment) return;

    setIsProcessingPayment(true);

    try {
      // If invoice has a valid UUID, persist to live backend
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payingInstallment.id);
      if (isUUID) {
        await api.post('/finance/payments/collect', {
          feeInvoiceId: payingInstallment.id,
          amount: payingInstallment.balanceAmount,
          paymentMethod: paymentMethod === 'UPI' ? 'ONLINE_UPI' : paymentMethod === 'CARD' ? 'CARD' : 'BANK_TRANSFER',
          transactionRef: `UPI/${Date.now()}`,
          remarks: `Authorized online payment by ${user?.name || 'Student'} via ${paymentMethod}`,
        });
      }
    } catch (err) {
      console.warn('Backend payment recording warning:', err);
    }

    const generatedReceiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated = installments.map((inst) =>
      inst.id === payingInstallment.id
        ? {
            ...inst,
            status: 'PAID' as const,
            paidAmount: inst.totalAmount,
            balanceAmount: 0,
            paidOn: 'Today, Just now',
            receiptNo: generatedReceiptNo,
            paymentMode:
              paymentMethod === 'UPI'
                ? `UPI (${upiId || 'GPay'})`
                : paymentMethod === 'CARD'
                ? 'Debit Card (RuPay Platinum)'
                : 'NetBanking (State Bank of India)',
            transactionRef: `TXN/${Math.floor(100000000 + Math.random() * 900000000)}`,
          }
        : inst
    );

    setInstallments(updated);
    setIsProcessingPayment(false);
    setPaymentSuccess(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setPaymentSuccess(false);
      setPayingInstallment(null);
      fetchStudentInvoices();
    }, 1800);
  };

  const handleDownloadLedger = () => {
    confetti({ particleCount: 40, spread: 60 });
    alert(
      `Downloading Official Annual Fee Clearance Certificate & Ledger for ${
        user?.name || 'Rahul Sharma'
      } (Academic Year 2026-27)...`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & STUDENT CREDENTIAL BAR                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-primary">My School Fee &amp; Receipts</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              Academic Session 2026 – 2027
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">
            Official fee payment ledger, quarterly installments, and verified tax receipts for{' '}
            <strong className="text-secondary">{user?.name || 'Rahul Sharma'}</strong> (Class 10-A).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadLedger}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-border text-secondary hover:text-accent-blue hover:border-accent-blue text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-muted" />
            <span>Download Fee Ledger (PDF)</span>
          </button>

          {totalBalance > 0 && (
            <button
              type="button"
              onClick={() => {
                const pending = installments.find((i) => i.balanceAmount > 0);
                if (pending) setPayingInstallment(pending);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-accent-blue text-white text-xs font-bold transition-all shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Outstanding Dues (₹{totalBalance.toLocaleString('en-IN')})</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Identification Banner */}
      <div className="bg-surface-raised/80 rounded-3xl p-4 sm:p-5 border border-border/70 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-accent-blue text-white font-extrabold flex items-center justify-center text-sm shadow-card">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div>
            <h3 className="font-bold text-primary text-sm">{user?.name || 'Rahul Sharma'}</h3>
            <span className="text-secondary">
              Admission No: <strong className="text-secondary font-mono">DPA/2024/0912</strong> • Roll No: <strong>18</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-secondary flex-wrap">
          <div>
            <span className="text-[10px] text-muted block font-semibold uppercase">Class &amp; Section</span>
            <strong className="text-primary">Class 10 - Section A</strong>
          </div>
          <div className="border-l border-border pl-4">
            <span className="text-[10px] text-muted block font-semibold uppercase">Curriculum</span>
            <strong className="text-primary">CBSE Affiliated</strong>
          </div>
          <div className="border-l border-border pl-4">
            <span className="text-[10px] text-muted block font-semibold uppercase">Board Clearance</span>
            <span className="inline-flex items-center gap-1 font-bold text-accent-green">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-green" />
              <span>Admit Card Cleared</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE PERSONAL FINANCIAL SUMMARY CARDS                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Annual Fee */}
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Approved Annual Fee</span>
              <div className="w-9 h-9 rounded-xl bg-surface-raised text-secondary flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-primary mt-2">
              ₹{totalBilled.toLocaleString('en-IN')}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-muted mt-3 inline-block">
            Class 10 Tuition, Labs &amp; CBSE Exam Charges
          </span>
        </div>

        {/* Total Paid So Far */}
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Total Fees Paid to Date</span>
              <div className="w-9 h-9 rounded-xl bg-accent-green-subtle text-accent-green flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-accent-green mt-2">
              ₹{totalPaid.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] font-bold text-accent-green bg-accent-green-subtle px-2.5 py-0.5 rounded-full">
              {percentCleared}% Cleared
            </span>
            <span className="text-[11px] text-muted">2 Verified Receipts</span>
          </div>
        </div>

        {/* Outstanding Pending Balance */}
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">Current Balance Due</span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  totalBalance > 0
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p
              className={`text-3xl font-black mt-2 ${
                totalBalance > 0 ? 'text-amber-600' : 'text-emerald-700'
              }`}
            >
              ₹{totalBalance.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {totalBalance > 0 ? (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Due by 15 Oct 2026
              </span>
            ) : (
              <span className="text-[11px] font-bold text-accent-green bg-accent-green-subtle px-2.5 py-0.5 rounded-full">
                All Dues Cleared!
              </span>
            )}
            <span className="text-[11px] text-muted">No Late Penalty</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TABS: INSTALLMENTS, FEE STRUCTURE & BANK INFO                          */}
      {/* ========================================================================= */}
      <div className="bg-surface rounded-2xl p-1.5 border border-border shadow-card flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('INSTALLMENTS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'INSTALLMENTS'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Installment Invoices &amp; Receipts ({installments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('STRUCTURE')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'STRUCTURE'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Official Fee Breakdown &amp; Structure</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BANK_INFO')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BANK_INFO'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>School Bank Account &amp; RTGS / NEFT Details</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB CONTENTS                                                           */}
      {/* ========================================================================= */}

      {/* TAB A: INSTALLMENTS & INVOICES */}
      {activeTab === 'INSTALLMENTS' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-primary text-sm sm:text-base">
                  My Term Installments &amp; Fee Receipts
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Click &ldquo;View Receipt&rdquo; to review and print authorized payment slips.
                </p>
              </div>

              <span className="text-xs font-semibold text-muted">
                Quarterly Installment Schedule (Apr 2026 – Mar 2027)
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {installments.map((inst) => {
                const isPaid = inst.status === 'PAID';

                return (
                  <div
                    key={inst.id}
                    className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-surface-raised/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-secondary bg-surface-raised px-2.5 py-0.5 rounded-full">
                          {inst.invoiceNo}
                        </span>
                        <span className="text-xs text-muted">• {inst.quarter}</span>
                        {isPaid ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green flex items-center gap-1">
                            <Check className="w-3 h-3" /> PAID
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" /> DUE SOON
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-primary">{inst.installmentName}</h4>

                      {/* Payment info snippet */}
                      <div className="text-xs text-secondary flex items-center gap-3 flex-wrap">
                        {isPaid ? (
                          <>
                            <span>
                              Paid on: <strong className="text-secondary">{inst.paidOn}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Mode: <strong>{inst.paymentMode}</strong>
                            </span>
                            <span>•</span>
                            <span className="font-mono text-secondary">{inst.transactionRef}</span>
                          </>
                        ) : (
                          <span className="text-amber-800 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Payment Deadline: {inst.dueDate} (No late fee if paid before due date)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:self-center">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-muted block">Installment Amount:</span>
                        <span className="text-xl font-extrabold text-primary block">
                          ₹{inst.totalAmount.toLocaleString('en-IN')}
                        </span>
                        {isPaid ? (
                          <span className="text-[11px] font-bold text-accent-green">
                            Receipt: {inst.receiptNo}
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-600">
                            Balance Due: ₹{inst.balanceAmount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isPaid ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(inst)}
                              className="px-3.5 py-2 rounded-xl bg-surface border border-border text-secondary hover:text-accent-blue hover:border-accent-blue text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5 text-muted" />
                              <span>View Receipt</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                confetti({ particleCount: 30, spread: 50 });
                                alert(`Downloading Official PDF Receipt for ${inst.invoiceNo}...`);
                              }}
                              className="px-3 py-2 rounded-xl bg-surface-raised hover:bg-slate-200 text-secondary text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                              title="Download PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-secondary" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPayingInstallment(inst)}
                            className="px-5 py-2.5 rounded-2xl bg-accent-blue text-white text-xs font-bold shadow-glow-sky hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay ₹{inst.balanceAmount.toLocaleString('en-IN')} Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB B: OFFICIAL CBSE FEE BREAKDOWN */}
      {activeTab === 'STRUCTURE' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6 max-w-4xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-primary">Class 10 Approved Annual Fee Schedule</h3>
                <p className="text-xs text-secondary mt-0.5">
                  Prescribed and approved by Delhi Public Academy Management Committee as per State School Education Act.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-raised text-secondary">
                Class 10 (2026-27)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-raised border-b border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Fee Component</th>
                    <th className="py-3 px-4">Description / Purpose</th>
                    <th className="py-3 px-4 text-right">Annual Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-secondary">
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">Tuition Fee (Annual)</td>
                    <td className="py-3 px-4 text-secondary">Regular academic instruction across 6 CBSE subjects</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹24,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">Science &amp; IT Lab Consumables</td>
                    <td className="py-3 px-4 text-secondary">Physics, Chemistry, Biology and Computer lab practical sessions</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹8,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">Smart Class &amp; Digital LMS</td>
                    <td className="py-3 px-4 text-secondary">Interactive digital boards, online quizzes, study materials</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹4,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">CBSE Board Exam &amp; Registration</td>
                    <td className="py-3 px-4 text-secondary">Official CBSE Class 10 roll number registration &amp; pre-board testing</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹4,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">Library, Sports &amp; Co-curricular</td>
                    <td className="py-3 px-4 text-secondary">Access to reference section, sports equipment, intra-school events</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹3,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-primary">School Development Fund</td>
                    <td className="py-3 px-4 text-secondary">Campus infrastructure, sanitization &amp; power backup upkeep</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">₹2,000</td>
                  </tr>
                  <tr className="bg-surface-raised/70 font-bold text-primary">
                    <td className="py-4 px-4 text-sm" colSpan={2}>Total Prescribed Annual Fee</td>
                    <td className="py-4 px-4 text-right text-base text-accent-blue font-black">₹45,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 space-y-1">
              <span className="font-bold block">Tax Benefit Under Section 80C:</span>
              <p className="text-[11px] text-sky-800 leading-relaxed">
                Tuition fee component (₹24,000) qualifies for income tax deduction under Section 80C of the Indian Income
                Tax Act for parents upon submitting official payment receipts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB C: SCHOOL BANK ACCOUNT INFO FOR NEFT / RTGS */}
      {activeTab === 'BANK_INFO' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-bold text-primary">Direct Bank Transfer &amp; Accounts Office Details</h3>
              <p className="text-xs text-muted mt-0.5">
                For parents wishing to transfer fees via NEFT / RTGS / IMPS or deposit demand drafts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-semibold block">Beneficiary Name</span>
                <p className="font-bold text-primary">Delhi Public Academy Fee Account</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-semibold block">Bank &amp; Branch</span>
                <p className="font-bold text-primary">State Bank of India (Main Institutional Branch)</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-semibold block">Bank Account Number</span>
                <p className="font-mono font-bold text-primary text-sm">0349104000192842</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-semibold block">IFSC Code</span>
                <p className="font-mono font-bold text-primary text-sm">SBIN0001234</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border sm:col-span-2 space-y-1">
                <span className="text-muted font-semibold block">Official School UPI VPA</span>
                <p className="font-mono font-extrabold text-accent-blue text-sm">dpa.fees@sbi</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Mandatory Instructions for Bank Transfers:</span>
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Please mention student Admission Number (<strong>DPA/2024/0912</strong>) and Student Name (
                <strong>{user?.name || 'Rahul Sharma'}</strong>) in the payment remarks/narration. Send the bank UTR
                reference slip to <strong className="text-primary">accounts@dpa.edu</strong> for instant receipt issuance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ONLINE FEE PAYMENT MODAL                                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {payingInstallment && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Online Fee Payment Portal
                    </span>
                    <h3 className="text-base font-bold text-primary">{payingInstallment.installmentName}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPayingInstallment(null)}
                  className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {paymentSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-accent-green-subtle text-accent-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-primary">Fee Payment Successful!</h4>
                  <p className="text-xs text-secondary">
                    Official receipt generated and mailed to <strong>{user?.email || 'parent.rahul@gmail.com'}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePayFee} className="space-y-4 text-xs">
                  {/* Bill Summary */}
                  <div className="p-4 rounded-2xl bg-surface-raised border border-border/70 space-y-2">
                    <div className="flex justify-between text-secondary">
                      <span>Student:</span>
                      <strong className="text-primary">{user?.name || 'Rahul Sharma'} (Class 10-A)</strong>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Invoice Number:</span>
                      <strong className="text-primary font-mono">{payingInstallment.invoiceNo}</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border text-primary text-sm font-bold">
                      <span>Total Payable:</span>
                      <span className="text-lg font-black text-accent-blue">
                        ₹{payingInstallment.balanceAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-secondary block">Select Payment Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'UPI'
                            ? 'border-brand-sky bg-sky-50 text-accent-blue font-bold'
                            : 'border-border hover:bg-surface-raised text-secondary'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mx-auto mb-1 text-accent-blue" />
                        <span className="text-[11px] block">UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CARD')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'CARD'
                            ? 'border-brand-sky bg-sky-50 text-accent-blue font-bold'
                            : 'border-border hover:bg-surface-raised text-secondary'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mx-auto mb-1 text-accent-blue" />
                        <span className="text-[11px] block">Debit / Credit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('NETBANKING')}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'NETBANKING'
                            ? 'border-brand-sky bg-sky-50 text-accent-blue font-bold'
                            : 'border-border hover:bg-surface-raised text-secondary'
                        }`}
                      >
                        <Landmark className="w-4 h-4 mx-auto mb-1 text-accent-blue" />
                        <span className="text-[11px] block">NetBanking</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Input based on Mode */}
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-secondary block">Enter UPI Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. parent@okhdfcbank or 9876543210@paytm"
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                      />
                      <span className="text-[10px] text-muted block">
                        Supported: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
                      </span>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Card Number (4532 •••• •••• 8912)"
                        defaultValue="4532 9182 7364 8912"
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          defaultValue="08/29"
                          className="p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          defaultValue="782"
                          className="p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NETBANKING' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-secondary block">Select Banking Institution</label>
                      <select className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-secondary">
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Punjab National Bank</option>
                        <option>Axis Bank</option>
                      </select>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setPayingInstallment(null)}
                      className="px-5 py-2.5 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      {isProcessingPayment ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize Payment of ₹{payingInstallment.balanceAmount.toLocaleString('en-IN')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. AUTHENTIC RECEIPT VIEW / DOWNLOAD MODAL                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-border space-y-6 text-primary"
            >
              {/* Receipt Header */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-accent-blue text-white font-extrabold flex items-center justify-center text-sm">
                      DPA
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold tracking-tight text-primary">
                        DELHI PUBLIC ACADEMY
                      </h2>
                      <span className="text-[10px] text-secondary block">
                        CBSE Affiliation No: 2130842 • School Code: 08421
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-accent-green bg-accent-green-subtle px-2.5 py-0.5 rounded-full uppercase">
                    Official Fee Receipt
                  </span>
                  <p className="font-mono text-xs font-bold text-secondary mt-1">{selectedReceipt.receiptNo}</p>
                  <span className="text-[10px] text-muted">Date: {selectedReceipt.paidOn}</span>
                </div>
              </div>

              {/* Student Metadata Table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-surface-raised p-4 rounded-2xl border border-border">
                <div>
                  <span className="text-[10px] text-muted block font-semibold">Student Name:</span>
                  <strong className="text-primary text-sm">{user?.name || 'Rahul Sharma'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block font-semibold">Admission / Scholar No:</span>
                  <strong className="text-primary font-mono">DPA/2024/0912</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block font-semibold">Class &amp; Section:</span>
                  <strong className="text-primary">Class 10 - Section A (Roll: 18)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block font-semibold">Payment Method &amp; Ref:</span>
                  <span className="text-secondary text-[11px] font-mono block truncate">
                    {selectedReceipt.paymentMode} ({selectedReceipt.transactionRef})
                  </span>
                </div>
              </div>

              {/* Itemized Receipt Table */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-raised text-[10px] font-bold text-secondary uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Fee Head Particulars</th>
                      <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {selectedReceipt.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-4 text-secondary">{item.item}</td>
                        <td className="py-2 px-4 text-right font-mono text-primary">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-surface-raised font-bold">
                      <td className="py-3 px-4 text-primary">Total Received with Thanks</td>
                      <td className="py-3 px-4 text-right text-accent-green font-black text-sm">
                        ₹{selectedReceipt.paidAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stamp & Verification */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <div className="flex items-center gap-2 text-secondary text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-accent-green" />
                  <span>Computer-generated verified tax receipt (No physical signature required)</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-muted block">Delhi Public Academy</span>
                  <strong className="text-xs text-secondary">Accounts Department</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-5 py-2.5 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confetti({ particleCount: 30, spread: 50 });
                    alert(`Printing / Downloading PDF copy of receipt ${selectedReceipt.receiptNo}...`);
                    setSelectedReceipt(null);
                  }}
                  className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// 2. SCHOOL ADMINISTRATOR / ACCOUNTANT FINANCE VIEW
// =========================================================================
const SchoolAdminFinanceView: React.FC<{ user: AuthUser | null }> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [summary, setSummary] = useState<{
    totalBilled: number;
    totalCollected: number;
    totalPending: number;
    collectionRate: number;
    totalInvoices: number;
  }>({
    totalBilled: 1840000,
    totalCollected: 1420000,
    totalPending: 420000,
    collectionRate: 77.2,
    totalInvoices: 4,
  });
  const [loading, setLoading] = useState(false);

  // Fee Collection Modal State
  const [collectingInvoice, setCollectingInvoice] = useState<any | null>(null);
  const [collectAmount, setCollectAmount] = useState<string>('');
  const [collectMethod, setCollectMethod] = useState<'CASH' | 'ONLINE_UPI' | 'BANK_TRANSFER'>('CASH');
  const [collectRemarks, setCollectRemarks] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);

  // Fee Structure Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classList, setClassList] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [structureName, setStructureName] = useState('');
  const [structureAmount, setStructureAmount] = useState('25000');
  const [structureClassId, setStructureClassId] = useState('');
  const [structureYearId, setStructureYearId] = useState('');
  const [structureDueDate, setStructureDueDate] = useState('2026-11-15');
  const [isCreatingStructure, setIsCreatingStructure] = useState(false);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [sumRes, invRes] = await Promise.all([
        api.get('/finance/summary').catch(() => null),
        api.get('/finance/invoices?limit=50').catch(() => null),
      ]);

      if (sumRes?.data?.data) {
        setSummary(sumRes.data.data);
      }

      if (invRes?.data?.data) {
        const raw = Array.isArray(invRes.data.data) ? invRes.data.data : [];
        if (raw.length > 0) {
          setInvoices(
            raw.map((inv: any) => ({
              id: inv.id,
              invoiceNo: inv.invoiceNumber || inv.invoiceNo,
              studentName: inv.studentName,
              class: inv.class ? (inv.section ? `${inv.class}-${inv.section}` : inv.class) : 'Class 10-A',
              feeType: inv.feeType || 'Tuition Fee',
              total: inv.totalAmount ?? inv.total ?? 0,
              paid: inv.paidAmount ?? inv.paid ?? 0,
              balance: inv.balanceAmount ?? inv.balance ?? 0,
              dueDate: inv.dueDate
                ? new Date(inv.dueDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '15 Oct 2026',
              status: inv.status,
            }))
          );
        }
      }
    } catch (err) {
      console.warn('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();

    // Fetch classes and academic years for structure builder
    const fetchMetadata = async () => {
      try {
        const [clsRes, yrRes] = await Promise.all([
          api.get('/academics/classes').catch(() => null),
          api.get('/academics/years').catch(() => null),
        ]);
        if (clsRes?.data?.data) {
          const classes = Array.isArray(clsRes.data.data) ? clsRes.data.data : [];
          setClassList(classes);
          if (classes.length > 0) setStructureClassId(classes[0].id);
        }
        if (yrRes?.data?.data) {
          const years = Array.isArray(yrRes.data.data) ? yrRes.data.data : [];
          setAcademicYears(years);
          const current = years.find((y: any) => y.isCurrent) || years[0];
          if (current) setStructureYearId(current.id);
        }
      } catch (err) {
        console.warn('Metadata fetch error:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Open Collect Modal
  const handleOpenCollect = (inv: any) => {
    setCollectingInvoice(inv);
    setCollectAmount(String(inv.balance));
    setCollectRemarks('');
    setCollectMethod('CASH');
  };

  // Submit Fee Collection
  const handleSubmitCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectingInvoice) return;
    setIsCollecting(true);

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(collectingInvoice.id);
      if (isUUID) {
        await api.post('/finance/payments/collect', {
          feeInvoiceId: collectingInvoice.id,
          amount: Number(collectAmount),
          paymentMethod: collectMethod,
          remarks: collectRemarks || 'Direct Counter Fee Collection',
        });
      }
      confetti({ particleCount: 50, spread: 60 });
      setCollectingInvoice(null);
      await fetchFinanceData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to record fee payment.');
    } finally {
      setIsCollecting(false);
    }
  };

  // Submit Create Fee Structure & Generate Invoices
  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!structureName.trim() || !structureClassId || !structureYearId) {
      alert('Please select class, academic year, and structure name.');
      return;
    }
    setIsCreatingStructure(true);

    try {
      const structRes = await api.post('/finance/structures', {
        academicYearId: structureYearId,
        classId: structureClassId,
        name: structureName.trim(),
        frequency: 'ONE_TIME',
        dueDate: structureDueDate,
        items: [{ name: structureName.trim(), amount: Number(structureAmount) }],
      });

      const newStructId = structRes.data?.data?.id;
      if (newStructId) {
        await api.post('/finance/invoices/generate', {
          academicYearId: structureYearId,
          feeStructureId: newStructId,
          classId: structureClassId,
          dueDate: structureDueDate,
        });
      }

      confetti({ particleCount: 60, spread: 70 });
      setShowCreateModal(false);
      setStructureName('');
      await fetchFinanceData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create fee structure.');
    } finally {
      setIsCreatingStructure(false);
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary">Fee &amp; Finance Management</h2>
          <p className="text-xs text-muted font-medium">
            Manage tuition structures, bulk invoice creation, and payment receipts across all classes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-xs shadow-glow-sky hover:bg-sky-600 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Fee Structure
          </button>
        </div>
      </div>

      {/* 3 Summary Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
          <span className="text-xs font-semibold text-muted block mb-1">Total Billed Fees</span>
          <p className="text-3xl font-extrabold text-primary">₹{summary.totalBilled.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-accent-blue mt-2 inline-block">
            Across {summary.totalInvoices} Invoices
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
          <span className="text-xs font-semibold text-muted block mb-1">Total Collected</span>
          <p className="text-3xl font-extrabold text-accent-green">₹{summary.totalCollected.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-accent-green bg-accent-green-subtle px-2 py-0.5 rounded-full mt-2 inline-block">
            {summary.collectionRate}% Collection Rate
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
          <span className="text-xs font-semibold text-muted block mb-1">Outstanding Pending</span>
          <p className="text-3xl font-extrabold text-accent-amber">₹{summary.totalPending.toLocaleString('en-IN')}</p>
          <span className="text-[11px] font-bold text-muted mt-2 inline-block">
            Due by end of term
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-primary text-base">Student Fee Invoices</h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface-raised border border-border rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised/70 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Class</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Paid</th>
                <th className="py-4 px-6">Balance Due</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-secondary">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    No fee invoices found. Click "Create Fee Structure" to generate class invoices.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-raised/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-secondary">{inv.invoiceNo}</td>
                    <td className="py-4 px-6 font-bold text-primary">{inv.studentName}</td>
                    <td className="py-4 px-6">{inv.class}</td>
                    <td className="py-4 px-6 font-bold text-primary">₹{inv.total.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-accent-green font-bold">₹{inv.paid.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-accent-amber font-bold">₹{inv.balance.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6">
                      {inv.status === 'PAID' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                          PAID
                        </span>
                      )}
                      {inv.status === 'PARTIAL' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-amber-subtle text-accent-amber">
                          PARTIAL
                        </span>
                      )}
                      {inv.status !== 'PAID' && inv.status !== 'PARTIAL' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-rose-subtle text-accent-rose">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {inv.balance > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleOpenCollect(inv)}
                          className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-accent-blue-subtle hover:text-accent-blue font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Collect Fee
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-accent-green px-3 py-1.5">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      <AnimatePresence>
        {collectingInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-primary">Record Fee Collection</h3>
                  <p className="text-xs text-muted">{collectingInvoice.studentName} ({collectingInvoice.class})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCollectingInvoice(null)}
                  className="p-1.5 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitCollect} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-surface-raised border border-border flex justify-between items-center">
                  <span className="text-secondary font-medium">Outstanding Balance:</span>
                  <span className="text-sm font-black text-accent-amber">₹{collectingInvoice.balance.toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-secondary block">Amount to Collect (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={collectingInvoice.balance}
                    value={collectAmount}
                    onChange={(e) => setCollectAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-secondary block">Payment Mode</label>
                  <select
                    value={collectMethod}
                    onChange={(e: any) => setCollectMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none"
                  >
                    <option value="CASH">Cash Counter</option>
                    <option value="ONLINE_UPI">UPI / QR Code</option>
                    <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-secondary block">Remarks / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Received at Accounts Desk"
                    value={collectRemarks}
                    onChange={(e) => setCollectRemarks(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setCollectingInvoice(null)}
                    className="px-4 py-2 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCollecting}
                    className="px-5 py-2 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer flex items-center gap-1.5"
                  >
                    {isCollecting ? 'Saving...' : 'Confirm Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Fee Structure Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-base font-bold text-primary">Create Class Fee Structure</h3>
                  <p className="text-xs text-muted">Generate invoices for all enrolled students in the class.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStructure} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-secondary block">Fee Structure Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Tuition & Lab Fee 2026"
                    value={structureName}
                    onChange={(e) => setStructureName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Target Class</label>
                    <select
                      value={structureClassId}
                      onChange={(e) => setStructureClassId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none"
                    >
                      {classList.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Academic Year</label>
                    <select
                      value={structureYearId}
                      onChange={(e) => setStructureYearId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none"
                    >
                      {academicYears.map((y) => (
                        <option key={y.id} value={y.id}>{y.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Total Fee (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={structureAmount}
                      onChange={(e) => setStructureAmount(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Due Date</label>
                    <input
                      type="date"
                      required
                      value={structureDueDate}
                      onChange={(e) => setStructureDueDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingStructure}
                    className="px-5 py-2 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer flex items-center gap-1.5"
                  >
                    {isCreatingStructure ? 'Generating Invoices...' : 'Save & Generate Invoices'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// 👑 3. MAIN ROUTER COMPONENT: ROLE-AWARE ISOLATION
// =========================================================================
export const FinancePage: React.FC = () => {
  const { user } = useAuth();

  // If user is a Student or Parent, strictly render their personal fee & receipt view
  if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
    return <StudentPersonalFeesView user={user} />;
  }

  // School Admins, Accountants, and Super Admins see the master ledger & revenue analytics
  return <SchoolAdminFinanceView user={user} />;
};
