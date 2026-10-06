/**
 * @file FinancePage.tsx
 * @description School Finance & Student Fee Invoice Management with collection ledger.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Invoices
  const [invoices] = useState([
    {
      id: 'inv_1',
      invoiceNo: 'INV-2026-0001',
      studentName: 'Rahul Sharma',
      class: 'Class 10-A',
      feeType: 'Annual Tuition & Lab Fee',
      total: 25000,
      paid: 20000,
      balance: 5000,
      dueDate: '15 Oct 2026',
      status: 'PARTIAL',
    },
    {
      id: 'inv_2',
      invoiceNo: 'INV-2026-0002',
      studentName: 'Aman Kumar',
      class: 'Class 10-B',
      feeType: 'Annual Tuition & Lab Fee',
      total: 25000,
      paid: 25000,
      balance: 0,
      dueDate: '15 Oct 2026',
      status: 'PAID',
    },
    {
      id: 'inv_3',
      invoiceNo: 'INV-2026-0003',
      studentName: 'Riya Patel',
      class: 'Class 9-A',
      feeType: 'Term 1 Tuition Fee',
      total: 18000,
      paid: 6000,
      balance: 12000,
      dueDate: '20 Oct 2026',
      status: 'PARTIAL',
    },
    {
      id: 'inv_4',
      invoiceNo: 'INV-2026-0004',
      studentName: 'Priya Verma',
      class: 'Class 10-A',
      feeType: 'Annual Tuition & Lab Fee',
      total: 25000,
      paid: 0,
      balance: 25000,
      dueDate: '15 Oct 2026',
      status: 'UNPAID',
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Fee & Finance Management</h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage tuition structures, bulk invoice creation, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-xs shadow-glow-sky hover:bg-sky-600 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Fee Structure
          </button>
        </div>
      </div>

      {/* 3 Summary Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Billed Fees</span>
          <p className="text-3xl font-extrabold text-slate-800">₹18,40,000</p>
          <span className="text-[11px] font-bold text-brand-sky-dark mt-2 inline-block">
            Across 148 Active Students
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Collected</span>
          <p className="text-3xl font-extrabold text-brand-mint-dark">₹14,20,000</p>
          <span className="text-[11px] font-bold text-brand-mint-dark bg-brand-mint-light px-2 py-0.5 rounded-full mt-2 inline-block">
            77.2% Collection Rate
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            Outstanding Pending
          </span>
          <p className="text-3xl font-extrabold text-brand-yellow-dark">₹4,20,000</p>
          <span className="text-[11px] font-bold text-slate-400 mt-2 inline-block">
            Due by end of term
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-surface rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">Student Fee Invoices</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice or student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-600">{inv.invoiceNo}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{inv.studentName}</td>
                  <td className="py-4 px-6">{inv.class}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ₹{inv.total.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-brand-mint-dark font-bold">
                    ₹{inv.paid.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-brand-yellow-dark font-bold">
                    ₹{inv.balance.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {inv.status === 'PAID' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-mint-light text-brand-mint-dark">
                        PAID
                      </span>
                    )}
                    {inv.status === 'PARTIAL' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-yellow-light text-brand-yellow-dark">
                        PARTIAL
                      </span>
                    )}
                    {inv.status === 'UNPAID' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-rose-light text-brand-rose-dark">
                        UNPAID
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-sky-light hover:text-brand-sky-dark font-bold text-[11px] transition-all">
                      Collect Fee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
