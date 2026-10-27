import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  CreditCard,
  CalendarCheck,
  BookOpen,
  ClipboardList,
  Bell,
  RefreshCw,
  AlertCircle,
  UserRound,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Wallet,
} from 'lucide-react';

import { api } from '../../../lib/api';

interface ParentDashboardViewProps {
  user: { name?: string };
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo?: string;
  status?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  balanceAmount: number | string;
  dueDate: string;
  status: string;
}

interface DashboardData {
  student: Child;
  enrollment?: {
    class?: { name: string };
    section?: { name: string };
    classTeacher?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  } | null;
  attendance: {
    todayStatus: string | null;
    todayReason?: string | null;
    presentDays: number;
    totalDays: number;
    percentage: number;
    meets75PercentThreshold: boolean;
  };
  fees: {
    outstandingDues: number;
    unpaidInvoiceCount: number;
    invoices: Invoice[];
  };
  upcomingExams: Array<{
    id: string;
    examDate: string;
    subject: { name: string };
    exam: { name: string; term?: string };
    startTime?: string;
  }>;
  latestResults: Array<{
    id: string;
    marksObtained: number;
    maxMarks: number;
    percentage: number | null;
    grade?: string | null;
    examSubject: {
      subject: { name: string };
      exam: { name: string };
    };
  }>;
  circulars: Array<{
    id: string;
    title: string;
    content: string;
    priority: string;
    createdAt: string;
  }>;
  assignments: Array<{
    id: string;
    title: string;
    dueDate: string;
    subject: string;
    submissionStatus: string;
    submittedAt: string | null;
  }>;
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await api.get(path);
  const payload = response.data;
  return (payload?.data ?? payload) as T;
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(value: number | string | undefined): string {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function getStatusClass(status?: string | null): string {
  const normalized = (status ?? '').toUpperCase();

  if (
    ['PRESENT', 'SUBMITTED', 'PAID', 'COMPLETED', 'PASS'].includes(
      normalized,
    )
  ) {
    return 'bg-green-100 text-green-700';
  }

  if (
    ['ABSENT', 'OVERDUE', 'FAILED', 'NOT_SUBMITTED'].includes(normalized)
  ) {
    return 'bg-red-100 text-red-700';
  }

  return 'bg-amber-100 text-amber-700';
}

const StatCard: React.FC<{
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}> = ({ title, value, description, icon: Icon }) => (
  <div className="rounded-2xl border border-border bg-surface p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-secondary">{title}</p>
        <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
        <p className="mt-1 text-xs text-secondary">{description}</p>
      </div>

      <div className="rounded-xl bg-primary/10 p-3">
        <Icon size={22} className="text-primary" />
      </div>
    </div>
  </div>
);

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  user,
}) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [childrenError, setChildrenError] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadChildren() {
      setLoadingChildren(true);
      setChildrenError('');

      try {
        const result = await apiGet<Child[]>('/parent/children');

        if (cancelled) return;

        const linkedChildren = Array.isArray(result) ? result : [];

        setChildren(linkedChildren);
        setSelectedChildId((current) =>
          linkedChildren.some((child) => child.id === current)
            ? current
            : linkedChildren[0]?.id ?? '',
        );
      } catch (error) {
        if (cancelled) return;

        setChildrenError(
          error instanceof Error
            ? error.message
            : 'Unable to load your linked children.',
        );

        setChildren([]);
        setSelectedChildId('');
      } finally {
        if (!cancelled) setLoadingChildren(false);
      }
    }

    void loadChildren();

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      if (!selectedChildId) {
        setDashboard(null);
        setDashboardError('');
        setLoadingDashboard(false);
        return;
      }

      setLoadingDashboard(true);
      setDashboardError('');
      setDashboard(null);

      try {
        const result = await apiGet<DashboardData>(
          `/parent/dashboard?studentId=${encodeURIComponent(selectedChildId)}`,
        );

        if (!cancelled) setDashboard(result);
      } catch (error) {
        if (cancelled) return;

        setDashboardError(
          error instanceof Error
            ? error.message
            : 'Unable to load the academic dashboard.',
        );
      } finally {
        if (!cancelled) setLoadingDashboard(false);
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [selectedChildId, retryKey]);

  if (loadingChildren) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-secondary">
        <RefreshCw className="animate-spin" size={20} />
        Loading your children...
      </div>
    );
  }

  if (childrenError) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-500" size={32} />
        <h2 className="text-lg font-semibold text-primary">
          Could not load your children
        </h2>
        <p className="mt-2 text-sm text-secondary">{childrenError}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <GraduationCap className="mx-auto mb-3 text-secondary" size={36} />
        <h2 className="text-lg font-semibold text-primary">
          No linked children found
        </h2>
        <p className="mt-2 text-sm text-secondary">
          Contact your school administrator to link your parent account to a
          student.
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-primary"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  const attendancePercentage = Math.max(
    0,
    Math.min(100, Number(dashboard?.attendance.percentage ?? 0)),
  );

  const resultAverage =
    dashboard?.latestResults.length
      ? dashboard.latestResults.reduce((total, result) => {
          const percentage =
            result.percentage ??
            (result.maxMarks > 0
              ? (result.marksObtained / result.maxMarks) * 100
              : 0);

          return total + Number(percentage);
        }, 0) / dashboard.latestResults.length
      : null;

  const teacher = dashboard?.enrollment?.classTeacher;

  const visibleInvoices = dashboard?.fees.invoices.slice(0, 3) ?? [];

  const firstVisibleUnpaidInvoice = visibleInvoices.find(
    (invoice) => Number(invoice.balanceAmount) > 0,
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-secondary">
            Welcome back, {user.name || 'Parent'}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-primary">
            Parent Dashboard
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Monitor your child&apos;s attendance, fees, and academic progress.
          </p>
        </div>

        <button
          type="button"
          onClick={retry}
          disabled={loadingDashboard || loadingChildren}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-primary disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loadingDashboard ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {children.length > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor="parent-child"
            className="text-sm font-medium text-primary"
          >
            Select child
          </label>

          <select
            id="parent-child"
            value={selectedChildId}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="min-w-48 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-primary"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingDashboard && (
        <div className="flex min-h-48 items-center justify-center gap-3 rounded-2xl border border-border bg-surface text-secondary">
          <RefreshCw className="animate-spin" size={20} />
          Loading academic information...
        </div>
      )}

      {!loadingDashboard && dashboardError && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 text-red-500" size={22} />
            <div>
              <h2 className="font-semibold text-primary">
                Could not load the dashboard
              </h2>
              <p className="mt-1 text-sm text-secondary">{dashboardError}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-4 inline-flex items-center gap-2 font-semibold text-primary underline"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {!loadingDashboard && dashboard && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-4">
                  <GraduationCap size={30} className="text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary">
                    {dashboard.student.firstName} {dashboard.student.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-secondary">
                    Admission No: {dashboard.student.admissionNo || 'Not available'}
                  </p>
                  <p className="mt-1 text-sm text-secondary">
                    Class {dashboard.enrollment?.class?.name || 'N/A'}
                    {dashboard.enrollment?.section?.name
                      ? ` • Section ${dashboard.enrollment.section.name}`
                      : ''}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 px-4 py-3">
                <p className="text-xs text-secondary">Today&apos;s attendance</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClass(
                    dashboard.attendance.todayStatus,
                  )}`}
                >
                  {dashboard.attendance.todayStatus || 'Not recorded'}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Overall Attendance"
              value={`${attendancePercentage.toFixed(1)}%`}
              description={
                attendancePercentage >= 75
                  ? 'Meets the 75% attendance threshold'
                  : 'Below the recommended 75% threshold'
              }
              icon={CalendarCheck}
            />

            <StatCard
              title="Outstanding Fees"
              value={formatCurrency(dashboard.fees.outstandingDues)}
              description={`${dashboard.fees.unpaidInvoiceCount} unpaid invoice(s)`}
              icon={CreditCard}
            />

            <StatCard
              title="Academic Average"
              value={
                resultAverage === null ? 'N/A' : `${resultAverage.toFixed(1)}%`
              }
              description={`${dashboard.latestResults.length} recent result(s)`}
              icon={Award}
            />

            <StatCard
              title="Upcoming Exams"
              value={String(dashboard.upcomingExams.length)}
              description="Scheduled examinations"
              icon={ClipboardList}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <CalendarCheck className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Attendance</h2>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Overall attendance</span>
                  <strong className="text-primary">
                    {attendancePercentage.toFixed(1)}%
                  </strong>
                </div>

                <div className="mt-2 h-3 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${
                      attendancePercentage >= 75
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-secondary">
                  {dashboard.attendance.presentDays} present days out of{' '}
                  {dashboard.attendance.totalDays} recorded days.
                </p>

                {dashboard.attendance.todayReason && (
                  <p className="mt-2 text-sm text-secondary">
                    Note: {dashboard.attendance.todayReason}
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <Wallet className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Fee Summary</h2>
              </div>

              <p className="mt-4 text-2xl font-bold text-primary">
                {formatCurrency(dashboard.fees.outstandingDues)}
              </p>
              <p className="mt-1 text-sm text-secondary">
                Outstanding balance across unpaid invoices
              </p>

              {visibleInvoices.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No unpaid invoices to display.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {visibleInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex flex-col justify-between gap-2 rounded-xl border border-border p-3 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold text-primary">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="mt-1 text-xs text-secondary">
                          Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-semibold text-primary">
                          {formatCurrency(invoice.balanceAmount)}
                        </p>
                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${getStatusClass(
                            invoice.status,
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (firstVisibleUnpaidInvoice) {
                    setSelectedInvoice(firstVisibleUnpaidInvoice);
                    setPaymentModalOpen(true);
                  }
                }}
                disabled={!firstVisibleUnpaidInvoice}
                className="mt-4 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Wallet size={16} className="mr-2 inline" />
                View Payment Details
              </button>

              <p className="mt-4 text-xs text-secondary">
                View the Fee Ledger for invoice details and available payment
                receipts. Online payment is not initiated from this dashboard.
              </p>
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Upcoming Exams</h2>
              </div>

              {dashboard.upcomingExams.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No upcoming exams scheduled.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {dashboard.upcomingExams.slice(0, 5).map((exam) => (
                    <div
                      key={exam.id}
                      className="rounded-xl border border-border p-3"
                    >
                      <p className="font-semibold text-primary">
                        {exam.exam.name}
                      </p>
                      <p className="mt-1 text-sm text-secondary">
                        {exam.subject.name}
                        {exam.exam.term ? ` • ${exam.exam.term}` : ''}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-secondary">
                        <Clock size={14} />
                        {formatDate(exam.examDate)}
                        {exam.startTime ? ` • ${exam.startTime}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <Award className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Latest Results</h2>
              </div>

              {dashboard.latestResults.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No examination results available yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {dashboard.latestResults.slice(0, 5).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <div>
                        <p className="font-semibold text-primary">
                          {result.examSubject.subject.name}
                        </p>
                        <p className="mt-1 text-xs text-secondary">
                          {result.examSubject.exam.name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          {result.marksObtained} / {result.maxMarks}
                        </p>
                        <p className="mt-1 text-xs text-secondary">
                          {(
                            result.percentage ??
                            (result.maxMarks > 0
                              ? (result.marksObtained / result.maxMarks) * 100
                              : 0)
                          ).toFixed(1)}
                          %
                          {result.grade ? ` • Grade ${result.grade}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Recent Homework</h2>
              </div>

              {dashboard.assignments.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No recent homework available.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {dashboard.assignments.slice(0, 3).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-xl border border-border p-3"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                        <div>
                          <p className="font-semibold text-primary">
                            {assignment.title}
                          </p>
                          <p className="mt-1 text-sm text-secondary">
                            {assignment.subject}
                          </p>
                          <p className="mt-1 text-xs text-secondary">
                            Due: {formatDate(assignment.dueDate)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-2 py-1 text-xs ${getStatusClass(
                            assignment.submissionStatus,
                          )}`}
                        >
                          {assignment.submissionStatus.replaceAll('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <UserRound className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Class Teacher</h2>
              </div>

              {teacher ? (
                <div className="mt-4 rounded-xl border border-border p-4">
                  <p className="font-semibold text-primary">
                    {teacher.name || 'Teacher name unavailable'}
                  </p>
                  {teacher.email && (
                    <p className="mt-2 text-sm text-secondary">
                      Email: {teacher.email}
                    </p>
                  )}
                  {teacher.phone && (
                    <p className="mt-1 text-sm text-secondary">
                      Phone: {teacher.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-secondary">
                  Class teacher contact details are not available.
                </p>
              )}
            </section>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <Bell className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">Recent Circulars</h2>
              </div>

              {dashboard.circulars.length === 0 ? (
                <p className="mt-4 text-sm text-secondary">
                  No recent circulars.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {dashboard.circulars.slice(0, 3).map((circular) => (
                    <div
                      key={circular.id}
                      className="rounded-xl border border-border p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-primary">
                          {circular.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-xs ${getStatusClass(
                            circular.priority,
                          )}`}
                        >
                          {circular.priority}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-secondary">
                        {circular.content}
                      </p>
                      <p className="mt-2 text-xs text-secondary">
                        {formatDate(circular.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-primary" size={22} />
                <h2 className="text-lg font-bold text-primary">
                  Academic Summary
                </h2>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm text-secondary">
                    Attendance threshold
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      attendancePercentage >= 75
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {attendancePercentage >= 75 ? 'Met' : 'Below 75%'}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm text-secondary">Academic average</span>
                  <span className="font-semibold text-primary">
                    {resultAverage === null
                      ? 'N/A'
                      : `${resultAverage.toFixed(1)}%`}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm text-secondary">Unpaid invoices</span>
                  <span className="font-semibold text-primary">
                    {dashboard.fees.unpaidInvoiceCount}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {paymentModalOpen && selectedInvoice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPaymentModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="payment-modal-title"
                className="text-lg font-bold text-primary"
              >
                Payment Details
              </h2>

              <button
                type="button"
                aria-label="Close payment details"
                onClick={() => setPaymentModalOpen(false)}
                className="rounded-lg p-2 text-secondary hover:bg-border"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-secondary">Invoice number</p>
                <p className="mt-1 font-semibold text-primary">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondary">Outstanding amount</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {formatCurrency(selectedInvoice.balanceAmount)}
                </p>
              </div>

              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                Online payments are not configured yet. No payment has been
                initiated. Please contact your school office for payment
                instructions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="mt-5 w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboardView;