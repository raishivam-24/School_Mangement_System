
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
  UserRound,
  Wallet,
} from 'lucide-react';
import { api } from '../../../lib/api';

interface ParentFeeLedgerViewProps {
  user: {
    name?: string;
  };
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo?: string;
}

interface Receipt {
  id: string;
  receiptNumber: string | null;
  amount: number;
  paymentMethod: string;
  transactionRef: string | null;
  paidAt: string;
}

interface InvoiceItem {
  name: string;
  amount: number;
}

interface ParentInvoice {
  id: string;
  invoiceNumber: string;
  feeType: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
  receipts: Receipt[];
}

interface FeeData {
  studentId: string;
  outstandingDues: number;
  invoices: ParentInvoice[];
}

const currency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

const dateLabel = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700';
    case 'PARTIAL':
      return 'bg-amber-50 text-amber-700';
    case 'OVERDUE':
      return 'bg-red-50 text-red-700';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-blue-50 text-blue-700';
  }
};

export const ParentFeeLedgerView: React.FC<
  ParentFeeLedgerViewProps
> = ({ user }) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingFees, setLoadingFees] = useState(false);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const loadChildren = useCallback(async () => {
    setLoadingChildren(true);
    setError('');

    try {
      const response = await api.get('/parent/children');
      const result = response.data?.data ?? response.data;
      const list: Child[] = Array.isArray(result) ? result : [];

      setChildren(list);
      setSelectedChildId((current) =>
        list.some((child) => child.id === current)
          ? current
          : list[0]?.id ?? '',
      );
    } catch {
      setChildren([]);
      setSelectedChildId('');
      setError('Unable to load linked children. Please try again.');
    } finally {
      setLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    void loadChildren();
  }, [loadChildren, retryKey]);

  useEffect(() => {
    if (!selectedChildId) {
      setFeeData(null);
      return;
    }

    const controller = new AbortController();

    const loadFees = async () => {
      setLoadingFees(true);
      setError('');
      setFeeData(null);

      try {
        const response = await api.get(
          `/parent/children/${selectedChildId}/fees`,
          { signal: controller.signal },
        );

        const result = response.data?.data ?? response.data;
        setFeeData(result as FeeData);
      } catch {
        if (controller.signal.aborted) return;

        setFeeData(null);
        setError('Unable to load fee details. Please try again.');
      } finally {
        if (!controller.signal.aborted) {
          setLoadingFees(false);
        }
      }
    };

    void loadFees();

    return () => controller.abort();
  }, [selectedChildId, retryKey]);

  const selectedChild = children.find(
    (child) => child.id === selectedChildId,
  );

  if (loadingChildren) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-blue-600" />
        <span className="text-gray-600">Loading fee ledger...</span>
      </div>
    );
  }

  const invoices = feeData?.invoices ?? [];
  const totalBilled = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount || 0),
    0,
  );
  const totalPaid = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.paidAmount || 0),
    0,
  );
  const outstanding =
    feeData?.outstandingDues ??
    invoices.reduce(
      (sum, invoice) =>
        sum + Math.max(0, Number(invoice.balanceAmount || 0)),
      0,
    );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Fee Ledger
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome{user.name ? `, ${user.name}` : ''}. View invoices,
            outstanding dues and payment receipts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRetryKey((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {children.length === 0 && !error && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <UserRound className="mx-auto mb-3 text-gray-400" size={36} />
          <h2 className="font-semibold text-gray-900">
            No linked children found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Contact school administration to link your child's account.
          </p>
        </div>
      )}

      {children.length > 0 && (
        <>
          {children.length > 1 && (
            <div className="max-w-sm">
              <label
                htmlFor="parent-fee-child"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select child
              </label>
              <select
                id="parent-fee-child"
                value={selectedChildId}
                onChange={(event) =>
                  setSelectedChildId(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedChild && (
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <div className="rounded-full bg-blue-50 p-3 text-blue-700">
                <UserRound size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedChild.firstName} {selectedChild.lastName}
                </h2>
                {selectedChild.admissionNo && (
                  <p className="text-sm text-gray-500">
                    Admission No: {selectedChild.admissionNo}
                  </p>
                )}
              </div>
            </div>
          )}

          {loadingFees ? (
            <div className="flex min-h-48 items-center justify-center gap-3">
              <RefreshCw className="animate-spin text-blue-600" />
              <span className="text-gray-600">Loading invoices...</span>
            </div>
          ) : feeData ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Total billed
                    </span>
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-gray-900">
                    {currency(totalBilled)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Amount paid
                    </span>
                    <CheckCircle2 className="text-emerald-600" size={20} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-gray-900">
                    {currency(totalPaid)}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-orange-200 bg-orange-50 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-800">
                      Outstanding dues
                    </span>
                    <Wallet className="text-orange-700" size={20} />
                  </div>
                  <p className="mt-3 text-2xl font-bold text-orange-900">
                    {currency(outstanding)}
                  </p>
                </motion.div>
              </div>

              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Itemized invoices
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Invoice balances and fee breakdowns from the school.
                  </p>
                </div>

                {invoices.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">
                    No invoices found for this child.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {invoice.feeType}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Invoice: {invoice.invoiceNumber}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(invoice.status)}`}
                          >
                            {invoice.status.replaceAll('_', ' ')}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div>
                            <p className="text-xs text-gray-500">
                              Total amount
                            </p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {currency(invoice.totalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Discount
                            </p>
                            <p className="mt-1 font-semibold text-gray-900">
                              {currency(invoice.discountAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Paid
                            </p>
                            <p className="mt-1 font-semibold text-emerald-700">
                              {currency(invoice.paidAmount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              Balance
                            </p>
                            <p className="mt-1 font-semibold text-orange-700">
                              {currency(invoice.balanceAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays size={16} />
                          Due date: {dateLabel(invoice.dueDate)}
                        </div>

                        {invoice.items.length > 0 && (
                          <div className="mt-4 rounded-lg bg-gray-50 p-3">
                            <h4 className="mb-2 text-sm font-medium text-gray-800">
                              Fee breakdown
                            </h4>
                            <div className="space-y-2">
                              {invoice.items.map((item, index) => (
                                <div
                                  key={`${invoice.id}-${item.name}-${index}`}
                                  className="flex justify-between gap-3 text-sm"
                                >
                                  <span className="text-gray-600">
                                    {item.name}
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {currency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {invoice.receipts.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                              <CreditCard size={16} />
                              Payment receipts
                            </h4>
                            <div className="space-y-2">
                              {invoice.receipts.map((receipt) => (
                                <div
                                  key={receipt.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 p-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {receipt.receiptNumber || 'Receipt'}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                      {receipt.paymentMethod.replaceAll('_', ' ')}
                                      {' · '}
                                      {dateLabel(receipt.paidAt)}
                                    </p>
                                    {receipt.transactionRef && (
                                      <p className="mt-1 text-xs text-gray-500">
                                        Reference: {receipt.transactionRef}
                                      </p>
                                    )}
                                  </div>
                                  <span className="font-semibold text-emerald-700">
                                    {currency(receipt.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
                <Clock size={18} className="mt-0.5 shrink-0" />
                <p>
                  This page displays the fee records and receipts returned
                  by the school. Online payment is not enabled here yet;
                  use only a payment flow explicitly provided by your
                  school.
                </p>
              </div>
            </>
          ) : (
            !error && (
              <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
                Fee details are not available.
              </p>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ParentFeeLedgerView;
