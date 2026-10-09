/**
 * @file FeeSummaryCards.tsx
 * @description Revenue summary KPI metric cards for School Finance.
 */

import React from 'react';
import type { FeeSummary } from '../../../types';

interface FeeSummaryCardsProps {
  summary?: FeeSummary;
  loading?: boolean;
}

export const FeeSummaryCards: React.FC<FeeSummaryCardsProps> = ({ summary, loading }) => {
  const totalBilled = summary?.totalBilled ?? 1840000;
  const totalCollected = summary?.totalCollected ?? 1420000;
  const totalPending = summary?.totalPending ?? 420000;
  const collectionRate = summary?.collectionRate ?? 77.2;
  const totalInvoices = summary?.totalInvoices ?? 4;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
        <span className="text-xs font-semibold text-muted block mb-1">Total Billed Fees</span>
        <p className="text-3xl font-extrabold text-primary">₹{totalBilled.toLocaleString('en-IN')}</p>
        <span className="text-[11px] font-bold text-accent-blue mt-2 inline-block">
          Across {totalInvoices} Invoices
        </span>
      </div>

      <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
        <span className="text-xs font-semibold text-muted block mb-1">Total Collected</span>
        <p className="text-3xl font-extrabold text-accent-green">₹{totalCollected.toLocaleString('en-IN')}</p>
        <span className="text-[11px] font-bold text-accent-green bg-accent-green-subtle px-2 py-0.5 rounded-full mt-2 inline-block">
          {collectionRate}% Collection Rate
        </span>
      </div>

      <div className="bg-surface p-6 rounded-3xl border border-border shadow-card">
        <span className="text-xs font-semibold text-muted block mb-1">Outstanding Pending</span>
        <p className="text-3xl font-extrabold text-accent-amber">₹{totalPending.toLocaleString('en-IN')}</p>
        <span className="text-[11px] font-bold text-muted mt-2 inline-block">
          Due by end of term
        </span>
      </div>
    </div>
  );
};
