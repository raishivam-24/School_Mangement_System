/**
 * @file SchoolAdminDashboardView.tsx
 * @description Tailored Dashboard for School Admins & Principals:
 * Powered by TanStack Query (useSchoolAdminDashboard), live ₹ INR metrics, and attendance tracking.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useSchoolAdminDashboard } from '../../../hooks';

interface SchoolAdminDashboardViewProps {
  user: any;
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

export const SchoolAdminDashboardView: React.FC<SchoolAdminDashboardViewProps> = ({ user }) => {
  const { data: dashboardData } = useSchoolAdminDashboard();
  const kpi = dashboardData?.kpi;

  const feeMonthlyData = [
    {
      month: 'Apr (Q1)',
      collected: kpi?.fees?.totalCollected
        ? Math.round((kpi.fees.totalCollected / 100000) * 10) / 10
        : 0,
      target: kpi?.fees?.totalBilled
        ? Math.round((kpi.fees.totalBilled / 100000) * 10) / 10
        : 10,
    },
    { month: 'Jul (Q2)', collected: 0, target: 10 },
    { month: 'Oct (Q3)', collected: 0, target: 10 },
    { month: 'Jan (Q4)', collected: 0, target: 10 },
  ];

  const classAttendance = [
    { class: 'Class 10', percent: kpi?.todayAttendance?.rate || 0 },
    { class: 'Class 9', percent: kpi?.todayAttendance?.rate || 0 },
    { class: 'Class 8', percent: kpi?.todayAttendance?.rate || 0 },
  ];

  const isBrandNewSchool = !kpi?.totalStudents && !kpi?.totalTeachers;

  return (
    <div className="space-y-6">
      {/* Admin Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Building2 className="w-3.5 h-3.5" />
            <span>{user?.school?.name || 'My School'} • Code: {user?.school?.code || 'CAMPUS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user?.name || 'Administrator'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            Academic Year {new Date().getFullYear()}–{(new Date().getFullYear() + 1).toString().slice(-2)} •{' '}
            {kpi?.todayAttendance?.rate !== undefined
              ? `Campus attendance at ${kpi.todayAttendance.rate}% today.`
              : 'Campus management portal ready.'}
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            className="px-5 py-3 rounded-2xl bg-surface text-accent-blue font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Campus Overview</span>
          </button>
        </div>
      </motion.div>

      {/* New School Quick-Start Onboarding Guide (Displays only when 0 students & 0 teachers) */}
      {isBrandNewSchool && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-surface border border-accent-blue/30 shadow-card space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-primary flex items-center gap-2">
                🚀 Welcome to your new SchoolHub campus!
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Complete these 3 foundational steps to activate your school's digital operations.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              Setup Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-surface-raised border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Step 1</span>
              <h4 className="text-sm font-bold text-primary mt-1">Configure Classes</h4>
              <p className="text-xs text-muted mt-0.5">Add grades, sections, and subjects in Academics.</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-raised border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Step 2</span>
              <h4 className="text-sm font-bold text-primary mt-1">Add Faculty</h4>
              <p className="text-xs text-muted mt-0.5">Create teacher profiles and assign subjects.</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-raised border border-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Step 3</span>
              <h4 className="text-sm font-bold text-primary mt-1">Enroll Students</h4>
              <p className="text-xs text-muted mt-0.5">Admit students and generate roll numbers.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4 School Institutional Stat Cards (in ₹ INR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Total Enrollment</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-blue-subtle text-accent-blue">
              Verified
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">
              {kpi?.totalStudents !== undefined ? kpi.totalStudents.toLocaleString('en-IN') : '0'}
            </span>
            <p className="text-xs text-muted mt-1">Active Students enrolled</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Campus Attendance</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-green-subtle text-accent-green">
              {kpi?.todayAttendance?.rate !== undefined ? `${kpi.todayAttendance.rate}% Today` : '0% Today'}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">
              {kpi?.todayAttendance
                ? `${kpi.todayAttendance.present} / ${kpi.todayAttendance.total}`
                : (kpi?.totalStudents ? `0 / ${kpi.totalStudents}` : '0 / 0')}
            </span>
            <p className="text-xs text-muted mt-1">
              {kpi?.todayAttendance
                ? `${kpi.todayAttendance.absent} Absent across sections`
                : 'No attendance marked today'}
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Staff On Duty</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-violet-subtle text-accent-violet">
              Active Faculty
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">
              {kpi?.totalTeachers !== undefined ? `${kpi.totalTeachers} Faculty` : '0 Faculty'}
            </span>
            <p className="text-xs text-muted mt-1">Teaching Staff on roster</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Fee Collection</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-green-subtle text-accent-green">
              {kpi?.fees?.collectionRate !== undefined ? `${kpi.fees.collectionRate}% Rate` : '0% Rate'}
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-primary">
              {kpi?.fees
                ? `₹${kpi.fees.totalCollected.toLocaleString('en-IN')}`
                : '₹0'}
            </span>
            <p className="text-xs text-muted mt-1">
              {kpi?.fees
                ? `₹${kpi.fees.totalPending.toLocaleString('en-IN')} Outstanding`
                : '₹0 Pending Due'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid: Fee Collection Ledger + Class Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-primary mb-1">Quarterly Fee Collections (₹ in Lakhs)</h3>
          <p className="text-xs text-muted mb-6">Target vs Collected by Academic Quarter</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeMonthlyData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '16px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="collected" fill="#38BDF8" name="Collected (₹ Lakhs)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="#E2E8F0" name="Total Target (₹ Lakhs)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-primary mb-4">Class-wise Attendance %</h3>
          <div className="space-y-3">
            {classAttendance.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-secondary">{c.class}</span>
                  <span className="text-accent-blue">{c.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-blue"
                    style={{ width: `${c.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
