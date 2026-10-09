/**
 * @file SchoolAdminFinanceView.tsx
 * @description School Administrator & Accountant Master Finance Portal.
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinanceSummary, useInvoices } from '../../../hooks';
import { FeeSummaryCards } from './FeeSummaryCards';
import { InvoiceTable } from './InvoiceTable';
import { CollectPaymentModal } from './CollectPaymentModal';
import { CreateFeeStructureModal } from './CreateFeeStructureModal';
import type { FeeInvoice } from '../../../types';

interface SchoolAdminFinanceViewProps {
  user: any;
}

export const SchoolAdminFinanceView: React.FC<SchoolAdminFinanceViewProps> = ({ user }) => {
  const { data: summary, isLoading: isSummaryLoading } = useFinanceSummary();
  const { data: invoices = [], isLoading: isInvoicesLoading } = useInvoices();

  const [collectingInvoice, setCollectingInvoice] = useState<FeeInvoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      <FeeSummaryCards summary={summary} loading={isSummaryLoading} />

      {/* Invoices Table */}
      <InvoiceTable
        invoices={invoices}
        loading={isInvoicesLoading}
        onCollect={(invoice) => setCollectingInvoice(invoice)}
      />

      {/* Modals */}
      <CollectPaymentModal
        invoice={collectingInvoice}
        onClose={() => setCollectingInvoice(null)}
      />

      <CreateFeeStructureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
