/**
 * @file InvoiceTable.tsx
 * @description Master Student Fee Invoices Table with Live Search and Collect Actions.
 */

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { FeeInvoice } from '../../../types';

interface InvoiceTableProps {
  invoices: FeeInvoice[];
  loading?: boolean;
  onCollect: (invoice: FeeInvoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, loading, onCollect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = invoices.filter(
    (inv) =>
      inv.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.invoiceNumber || inv.invoiceNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted">
                  <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading fee ledger...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted">
                  No fee invoices found. Click "Create Fee Structure" to generate class invoices.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => {
                const total = inv.totalAmount ?? inv.total ?? 0;
                const paid = inv.paidAmount ?? inv.paid ?? 0;
                const balance = inv.balanceAmount ?? inv.balance ?? 0;
                const invNo = inv.invoiceNumber || inv.invoiceNo;

                return (
                  <tr key={inv.id} className="hover:bg-surface-raised/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-secondary">{invNo}</td>
                    <td className="py-4 px-6 font-bold text-primary">{inv.studentName}</td>
                    <td className="py-4 px-6">{inv.class}</td>
                    <td className="py-4 px-6 font-bold text-primary">₹{total.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-accent-green font-bold">₹{paid.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-6 text-accent-amber font-bold">₹{balance.toLocaleString('en-IN')}</td>
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
                      {balance > 0 ? (
                        <button
                          type="button"
                          onClick={() => onCollect(inv)}
                          className="px-3 py-1.5 rounded-xl bg-surface-raised hover:bg-accent-blue-subtle hover:text-accent-blue font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Collect Fee
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-accent-green px-3 py-1.5">Cleared</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
