
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  UserRound,
} from 'lucide-react';
import { api } from '../../../lib/api';

interface ParentAttendanceViewProps {
  user: {
    name?: string;
  };
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  admissionNo?: string;
  status?: string;
}

interface AttendanceSummary {
  recordsReturned: number;
  presentDays: number;
  attendancePercentage: number;
}

interface MonthlyBreakdown {
  month: string;
  total: number;
  present: number;
  absent: number;
  late: number;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  reason: string | null;
  remarks: string | null;
}

interface AttendanceData {
  studentId: string;
  summary: AttendanceSummary;
  monthlyBreakdown: MonthlyBreakdown[];
  records: AttendanceRecord[];
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const formatMonth = (value: string) => {
  const [year, month] = value.split('-').map(Number);

  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
};

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PRESENT':
      return {
        label: 'Present',
        className: 'bg-emerald-50 text-emerald-700',
        icon: CheckCircle2,
      };
    case 'ABSENT':
      return {
        label: 'Absent',
        className: 'bg-red-50 text-red-700',
        icon: XCircle,
      };
    case 'LATE':
      return {
        label: 'Late',
        className: 'bg-amber-50 text-amber-700',
        icon: Clock,
      };
    case 'HALF_DAY':
      return {
        label: 'Half day',
        className: 'bg-orange-50 text-orange-700',
        icon: Clock,
      };
    default:
      return {
        label: status.replaceAll('_', ' '),
        className: 'bg-gray-100 text-gray-700',
        icon: CalendarCheck,
      };
  }
};

export const ParentAttendanceView: React.FC<
  ParentAttendanceViewProps
> = ({ user }) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [attendance, setAttendance] = useState<AttendanceData | null>(
    null,
  );
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const loadChildren = useCallback(async () => {
    setLoadingChildren(true);
    setError('');

    try {
      const response = await api.get('/parent/children');
      const result = response.data?.data ?? response.data;
      const childList = Array.isArray(result) ? result : [];

      setChildren(childList);

      setSelectedChildId((current: string) =>
        childList.some((child: Child) => child.id === current)
          ? current
          : childList[0]?.id ?? '',
      );
    } catch (err) {
      setChildren([]);
      setSelectedChildId('');
      setError(
        'Could not load your linked children. Please try again.',
      );
    } finally {
      setLoadingChildren(false);
    }
  }, []);

  useEffect(() => {
    void loadChildren();
  }, [loadChildren, retryKey]);

  useEffect(() => {
    if (!selectedChildId) {
      setAttendance(null);
      return;
    }

    const controller = new AbortController();

    const loadAttendance = async () => {
      setLoadingAttendance(true);
      setError('');
      setAttendance(null);

      try {
        const response = await api.get(
          `/parent/children/${selectedChildId}/attendance`,
          { signal: controller.signal },
        );

        const result = response.data?.data ?? response.data;
        setAttendance(result as AttendanceData);
      } catch (err) {
        if (controller.signal.aborted) return;

        setAttendance(null);
        setError(
          'Could not load attendance history. Please try again.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAttendance(false);
        }
      }
    };

    void loadAttendance();

    return () => controller.abort();
  }, [selectedChildId, retryKey]);

  const selectedChild = children.find(
    (child) => child.id === selectedChildId,
  );

  if (loadingChildren) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">
          Loading your children's information...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome{user.name ? `, ${user.name}` : ''}. Review your
            child's attendance history.
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
            Contact the school administration to link your child's
            student account.
          </p>
        </div>
      )}

      {children.length > 0 && (
        <>
          {children.length > 1 && (
            <div className="max-w-sm">
              <label
                htmlFor="parent-attendance-child"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Select child
              </label>
              <select
                id="parent-attendance-child"
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

          {loadingAttendance ? (
            <div className="flex min-h-48 items-center justify-center">
              <RefreshCw className="animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">
                Loading attendance history...
              </span>
            </div>
          ) : attendance ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-sm text-gray-500">
                    Attendance percentage
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {attendance.summary.attendancePercentage.toFixed(1)}%
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${
                        attendance.summary.attendancePercentage >= 75
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            attendance.summary.attendancePercentage,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      attendance.summary.attendancePercentage >= 75
                        ? 'text-emerald-700'
                        : 'text-red-700'
                    }`}
                  >
                    {attendance.summary.attendancePercentage >= 75
                      ? 'Meeting the 75% attendance requirement'
                      : 'Below the recommended 75% attendance requirement'}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-gray-200 bg-white p-5"
                >
                  <p className="text-sm text-gray-500">
                    Days marked present
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {attendance.summary.presentDays}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {attendance.summary.recordsReturned} attendance records
                    returned by the server
                  </p>
                </motion.div>
              </div>

              <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Monthly breakdown
                </h2>

                {attendance.monthlyBreakdown.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No monthly attendance records are available yet.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {attendance.monthlyBreakdown.map((month) => (
                      <div key={month.month}>
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-gray-800">
                            {formatMonth(month.month)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {month.present}/{month.total} counted days
                          </span>
                        </div>

                        <div className="flex h-3 overflow-hidden rounded-full bg-gray-100">
                          {month.total > 0 && (
                            <>
                              <div
                                className="bg-emerald-500"
                                style={{
                                  width: `${(month.present / month.total) * 100}%`,
                                }}
                                title={`${month.present} present`}
                              />
                              <div
                                className="bg-red-400"
                                style={{
                                  width: `${(month.absent / month.total) * 100}%`,
                                }}
                                title={`${month.absent} absent`}
                              />
                              <div
                                className="bg-amber-400"
                                style={{
                                  width: `${(month.late / month.total) * 100}%`,
                                }}
                                title={`${month.late} late`}
                              />
                            </>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                          Present: {month.present} · Absent: {month.absent}
                          {' · '}Late: {month.late}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent attendance records
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing up to 100 records returned by the server.
                  </p>
                </div>

                {attendance.records.length === 0 ? (
                  <p className="p-5 text-sm text-gray-500">
                    No attendance records are available yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-5 py-3 font-medium">Date</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Reason</th>
                          <th className="px-5 py-3 font-medium">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {attendance.records.map((record) => {
                          const style = getStatusStyle(record.status);
                          const StatusIcon = style.icon;

                          return (
                            <tr key={record.id}>
                              <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                                {formatDate(record.date)}
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}
                                >
                                  <StatusIcon size={14} />
                                  {style.label}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-gray-600">
                                {record.reason || '—'}
                              </td>
                              <td className="px-5 py-4 text-gray-600">
                                {record.remarks || '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : (
            !error && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Attendance details are not available.
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ParentAttendanceView;
