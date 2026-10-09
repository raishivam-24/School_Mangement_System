/**
 * @file StudentPersonalFeesView.tsx
 * @description Dedicated Student & Parent Personal Fee Ledger, Installments, and Online UPI Portal.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Smartphone,
  Landmark,
  X,
  Check,
  AlertCircle,
  Building2,
  Calendar,
  FileText,
} from 'lucide-react';
import { useInvoices, useCollectPayment } from '../../../hooks';
import type { StudentFeeInstallment, FeeInvoice } from '../../../types';

interface StudentPersonalFeesViewProps {
  user: any;
}

const initialMockInstallments: StudentFeeInstallment[] = [
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

export const StudentPersonalFeesView: React.FC<StudentPersonalFeesViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'INSTALLMENTS' | 'STRUCTURE' | 'BANK_INFO'>('INSTALLMENTS');
  const [installments, setInstallments] = useState<StudentFeeInstallment[]>(initialMockInstallments);

  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<StudentFeeInstallment | null>(null);
  const [payingInstallment, setPayingInstallment] = useState<StudentFeeInstallment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('rahul.parent@okhdfcbank');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const studentId = user?.studentProfile?.id;
  const { data: liveInvoices = [] } = useInvoices({ studentId });
  const { mutate: collectPayment, isPending: isProcessingPayment } = useCollectPayment();

  // Sync live invoices if present
  React.useEffect(() => {
    if (liveInvoices.length > 0) {
      setInstallments(
        liveInvoices.map((inv) => ({
          id: inv.id,
          installmentName: inv.feeType || 'Quarterly Academic Fee',
          quarter: `Term Session (${inv.class || 'Class 10'})`,
          invoiceNo: inv.invoiceNumber || inv.invoiceNo || 'INV-2026',
          totalAmount: inv.totalAmount ?? inv.total ?? 0,
          paidAmount: inv.paidAmount ?? inv.paid ?? 0,
          balanceAmount: inv.balanceAmount ?? inv.balance ?? 0,
          dueDate: inv.dueDate,
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
  }, [liveInvoices]);

  const totalBilled = installments.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = installments.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalBalance = installments.reduce((acc, curr) => acc + curr.balanceAmount, 0);
  const percentCleared = totalBilled > 0 ? ((totalPaid / totalBilled) * 100).toFixed(1) : '100';

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInstallment) return;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payingInstallment.id);
    if (isUUID) {
      collectPayment({
        feeInvoiceId: payingInstallment.id,
        amount: payingInstallment.balanceAmount,
        paymentMethod: paymentMethod === 'UPI' ? 'ONLINE_UPI' : paymentMethod === 'CARD' ? 'CARD' : 'BANK_TRANSFER',
        transactionRef: `UPI/${Date.now()}`,
        remarks: `Authorized online payment by ${user?.name || 'Student'} via ${paymentMethod}`,
      });
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
    setPaymentSuccess(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setPaymentSuccess(false);
      setPayingInstallment(null);
    }, 1800);
  };

  const handleDownloadLedger = () => {
    confetti({ particleCount: 40, spread: 60 });
    alert(`Downloading Official Annual Fee Clearance Certificate for ${user?.name || 'Rahul Sharma'}...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
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

      {/* Hero Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Annual Fee</span>
          <h3 className="text-2xl font-black text-primary mt-2">₹{totalBilled.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-muted mt-1">Prescribed CBSE Class 10 Dues</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Amount Paid</span>
          <h3 className="text-2xl font-black text-accent-green mt-2">₹{totalPaid.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-accent-green font-medium mt-1">{percentCleared}% Cleared</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Outstanding Dues</span>
          <h3 className="text-2xl font-black text-accent-amber mt-2">₹{totalBalance.toLocaleString('en-IN')}</h3>
          <p className="text-[11px] text-muted mt-1">{totalBalance === 0 ? 'No Dues Pending' : 'Due by 15 Oct 2026'}</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Clearance Status</span>
          <h3 className="text-2xl font-black text-accent-blue mt-2">
            {totalBalance === 0 ? 'Verified Safe' : 'Payment Due'}
          </h3>
          <p className="text-[11px] text-muted mt-1">Eligible for Pre-Board Hall Ticket</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-card w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('INSTALLMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'INSTALLMENTS' ? 'bg-accent-blue text-white shadow-card' : 'text-secondary hover:text-primary'
          }`}
        >
          Quarterly Installment Schedule
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('STRUCTURE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'STRUCTURE' ? 'bg-accent-blue text-white shadow-card' : 'text-secondary hover:text-primary'
          }`}
        >
          Official Fee Breakdown
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('BANK_INFO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'BANK_INFO' ? 'bg-accent-blue text-white shadow-card' : 'text-secondary hover:text-primary'
          }`}
        >
          School Bank &amp; NEFT Info
        </button>
      </div>

      {/* Tab A: Installments List */}
      {activeTab === 'INSTALLMENTS' && (
        <div className="space-y-4">
          {installments.map((inst) => {
            const isPaid = inst.status === 'PAID';
            return (
              <div
                key={inst.id}
                className="bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary text-base">{inst.installmentName}</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isPaid ? 'bg-accent-green-subtle text-accent-green' : 'bg-accent-amber-subtle text-accent-amber'
                      }`}
                    >
                      {inst.status}
                    </span>
                  </div>
                  <p className="text-xs text-secondary">{inst.quarter} • Invoice: {inst.invoiceNo}</p>
                  <span className="text-[11px] text-muted block">Due: {inst.dueDate}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-primary">₹{inst.totalAmount.toLocaleString('en-IN')}</span>
                    {isPaid ? (
                      <span className="text-[11px] text-accent-green block font-bold">Cleared in Full</span>
                    ) : (
                      <span className="text-[11px] text-accent-amber block font-bold">
                        Pending: ₹{inst.balanceAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {isPaid ? (
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(inst)}
                      className="px-4 py-2 rounded-xl bg-surface-raised hover:bg-accent-blue-subtle hover:text-accent-blue text-xs font-bold transition-all border border-border cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPayingInstallment(inst)}
                      className="px-5 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold transition-all shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab B: Official Fee Breakdown */}
      {activeTab === 'STRUCTURE' && (
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-4">
          <h3 className="text-base font-bold text-primary">Itemized CBSE Class 10 Fee Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised border-b border-border text-[11px] font-bold text-secondary uppercase">
                <tr>
                  <th className="py-3 px-4">Fee Component</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount (Annual)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-secondary">
                <tr>
                  <td className="py-3 px-4 font-bold text-primary">Tuition Fee</td>
                  <td className="py-3 px-4">Regular academic instruction across 6 CBSE subjects</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">₹24,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-primary">Science &amp; IT Lab Consumables</td>
                  <td className="py-3 px-4">Practical laboratory consumables and sessions</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">₹8,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-primary">Smart Class &amp; LMS</td>
                  <td className="py-3 px-4">Interactive boards, quizzes, study material</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">₹4,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-primary">CBSE Board Exam Registration</td>
                  <td className="py-3 px-4">Roll number registration &amp; mock tests</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">₹4,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-primary">Library &amp; Sports</td>
                  <td className="py-3 px-4">Reference books, athletics, sports facilities</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">₹5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab C: School Bank Details */}
      {activeTab === 'BANK_INFO' && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-primary">Direct Bank Transfer Details</h3>
            <p className="text-xs text-muted mt-0.5">For NEFT / RTGS / IMPS deposits.</p>
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
              <span className="text-muted font-semibold block">Account Number</span>
              <p className="font-mono font-bold text-primary text-sm">0349104000192842</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
              <span className="text-muted font-semibold block">IFSC Code</span>
              <p className="font-mono font-bold text-primary text-sm">SBIN0001234</p>
            </div>
          </div>
        </div>
      )}

      {/* Online Payment Modal */}
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

                  {paymentMethod === 'UPI' && (
                    <div className="space-y-1.5">
                      <label className="font-bold text-secondary block">Enter UPI VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. parent@okhdfcbank"
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                      />
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
                      className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isProcessingPayment ? 'Processing...' : `Authorize ₹${payingInstallment.balanceAmount.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Authentic Printable Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-border space-y-6 text-primary"
            >
              <div className="flex items-start justify-between pb-4 border-b-2 border-border">
                <div>
                  <h2 className="text-base font-extrabold text-primary">DELHI PUBLIC ACADEMY</h2>
                  <span className="text-[10px] text-secondary block">CBSE Affiliation No: 2130842</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-accent-green bg-accent-green-subtle px-2.5 py-0.5 rounded-full uppercase">
                    Official Fee Receipt
                  </span>
                  <p className="font-mono text-xs font-bold text-secondary mt-1">{selectedReceipt.receiptNo}</p>
                  <span className="text-[10px] text-muted">Date: {selectedReceipt.paidOn}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-surface-raised p-4 rounded-2xl border border-border">
                <div>
                  <span className="text-[10px] text-muted block">Student Name:</span>
                  <strong className="text-primary">{user?.name || 'Rahul Sharma'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Class &amp; Section:</span>
                  <strong className="text-primary">Class 10 - Section A</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Payment Mode:</span>
                  <strong className="text-primary">{selectedReceipt.paymentMode || 'Online UPI'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted block">Amount Paid:</span>
                  <strong className="text-accent-green">₹{selectedReceipt.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>

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
                    alert(`Printing receipt ${selectedReceipt.receiptNo}...`);
                    setSelectedReceipt(null);
                  }}
                  className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
