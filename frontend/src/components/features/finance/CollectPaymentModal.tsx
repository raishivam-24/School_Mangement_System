/**
 * @file CollectPaymentModal.tsx
 * @description Modal for Recording Manual / Counter Fee Payments.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCollectPayment } from '../../../hooks';
import type { FeeInvoice } from '../../../types';

interface CollectPaymentModalProps {
  invoice: FeeInvoice | null;
  onClose: () => void;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({ invoice, onClose }) => {
  const [amount, setAmount] = useState<string>(invoice ? String(invoice.balanceAmount ?? invoice.balance ?? 0) : '');
  const [method, setMethod] = useState<'CASH' | 'ONLINE_UPI' | 'BANK_TRANSFER'>('CASH');
  const [remarks, setRemarks] = useState('');

  const { mutate: collectPayment, isPending } = useCollectPayment();

  if (!invoice) return null;

  const balance = invoice.balanceAmount ?? invoice.balance ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    collectPayment(
      {
        feeInvoiceId: invoice.id,
        amount: Number(amount),
        paymentMethod: method,
        remarks: remarks || 'Direct Counter Fee Collection',
      },
      {
        onSuccess: () => {
          confetti({ particleCount: 50, spread: 60 });
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to record fee payment.');
        },
      }
    );
  };

  return (
    <AnimatePresence>
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
              <p className="text-xs text-muted">{invoice.studentName} ({invoice.class})</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface-raised border border-border flex justify-between items-center">
              <span className="text-secondary font-medium">Outstanding Balance:</span>
              <span className="text-sm font-black text-accent-amber">₹{balance.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-secondary block">Amount to Collect (₹)</label>
              <input
                type="number"
                required
                min={1}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-secondary block">Payment Mode</label>
              <select
                value={method}
                onChange={(e: any) => setMethod(e.target.value)}
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
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer flex items-center gap-1.5"
              >
                {isPending ? 'Saving...' : 'Confirm Payment'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
