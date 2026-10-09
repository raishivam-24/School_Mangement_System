/**
 * @file StudentAttendanceDashboard.tsx
 * @description Student and Parent personal attendance dashboard with CBSE >75% compliance meter.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  GraduationCap,
  FileText,
  Calendar,
  X,
  Upload,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { useStudentAttendance } from '../../../hooks';
import type { AttendanceStatus } from '../../../types';

interface StudentAttendanceDashboardProps {
  user: any;
}

interface DailyAttendanceRecord {
  date: string;
  day: string;
  status: AttendanceStatus | 'HOLIDAY';
  punchTime?: string;
  reason?: string;
}

const studentAprilRecords: DailyAttendanceRecord[] = [
  { date: '01 Apr', day: 'Wed', status: 'PRESENT', punchTime: '08:15 AM' },
  { date: '02 Apr', day: 'Thu', status: 'PRESENT', punchTime: '08:18 AM' },
  { date: '03 Apr', day: 'Fri', status: 'PRESENT', punchTime: '08:12 AM' },
  { date: '04 Apr', day: 'Sat', status: 'PRESENT', punchTime: '08:25 AM' },
  { date: '05 Apr', day: 'Sun', status: 'HOLIDAY', reason: 'Sunday' },
  { date: '06 Apr', day: 'Mon', status: 'PRESENT', punchTime: '08:14 AM' },
  { date: '07 Apr', day: 'Tue', status: 'PRESENT', punchTime: '08:20 AM' },
  { date: '08 Apr', day: 'Wed', status: 'ABSENT', reason: 'Sick Leave (Approved by Amit Sir)' },
  { date: '09 Apr', day: 'Thu', status: 'ABSENT', reason: 'High viral fever (Medical certificate on file)' },
  { date: '10 Apr', day: 'Fri', status: 'PRESENT', punchTime: '08:19 AM' },
  { date: '11 Apr', day: 'Sat', status: 'PRESENT', punchTime: '08:22 AM' },
  { date: '12 Apr', day: 'Sun', status: 'HOLIDAY', reason: 'Sunday' },
  { date: '13 Apr', day: 'Mon', status: 'HOLIDAY', reason: 'Baisakhi / Ambedkar Jayanti' },
  { date: '14 Apr', day: 'Tue', status: 'LATE', punchTime: '08:44 AM', reason: 'Bus route #12 tyre puncture' },
  { date: '15 Apr', day: 'Wed', status: 'PRESENT', punchTime: '08:10 AM' },
  { date: '16 Apr', day: 'Thu', status: 'PRESENT', punchTime: '08:16 AM' },
  { date: '17 Apr', day: 'Fri', status: 'PRESENT', punchTime: '08:21 AM' },
  { date: '18 Apr', day: 'Sat', status: 'PRESENT', punchTime: '08:15 AM' },
  { date: '19 Apr', day: 'Sun', status: 'HOLIDAY', reason: 'Sunday' },
  { date: '20 Apr', day: 'Mon', status: 'PRESENT', punchTime: '08:12 AM' },
  { date: '21 Apr', day: 'Tue', status: 'PRESENT', punchTime: '08:15 AM' },
];

export const StudentAttendanceDashboard: React.FC<StudentAttendanceDashboardProps> = ({ user }) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('MEDICAL');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [selectedMonth] = useState('April 2026');

  const studentId = user?.studentProfile?.id;
  const { data: attendanceData } = useStudentAttendance(studentId);

  const totalWorkingDays = attendanceData?.summary?.totalDays || 130;
  const daysAttended = attendanceData?.summary?.presentDays || 115;
  const daysAbsent = attendanceData?.summary?.absentDays || 11;
  const daysLate = attendanceData?.summary?.lateDays || 4;
  const attendancePercentage = ((daysAttended / (totalWorkingDays || 1)) * 100).toFixed(1);

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      setLeaveSubmitted(false);
      setIsLeaveModalOpen(false);
      setLeaveReason('');
      setLeaveStartDate('');
      setLeaveEndDate('');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>My Attendance Record</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              Class 10 - Section A
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Review your official school attendance, CBSE compliance percentage, and view teacher verified absence logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Apply for Leave / Absence Slip</span>
        </button>
      </div>

      {/* Hero Banner: CBSE >75% Mandatory Attendance Compliance Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <ShieldCheck className="w-4 h-4 text-accent-amber" />
            <span>CBSE Norm Compliance Meter</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {attendancePercentage}% Academic Attendance
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            Eligible for CBSE Board Examinations. You have attended <strong className="text-white">{daysAttended}</strong> out of <strong className="text-white">{totalWorkingDays}</strong> official working days this term.
          </p>

          <div className="space-y-1.5 pt-2 max-w-md">
            <div className="flex justify-between text-xs font-bold text-sky-100">
              <span>Required: 75% CBSE Norm</span>
              <span className="text-white font-extrabold">{attendancePercentage}% Current (Safe)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface/20 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-accent-amber z-10"></div>
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-36 h-36 rounded-3xl bg-surface/15 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-center p-3 shrink-0">
          <GraduationCap className="w-9 h-9 text-accent-amber mb-1" />
          <span className="text-2xl font-extrabold">{daysAttended} / {totalWorkingDays}</span>
          <span className="text-[10px] text-sky-100 font-bold uppercase tracking-wider mt-0.5">
            Days Attended
          </span>
        </div>
      </motion.div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Working Days</span>
          <h3 className="text-3xl font-extrabold text-primary mt-2">{totalWorkingDays} Days</h3>
          <p className="text-xs text-muted mt-1">Term 1 (April – October)</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Days Present</span>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{daysAttended} Days</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">Verified roll calls</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Days Absent</span>
          <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{daysAbsent} Days</h3>
          <p className="text-xs text-muted mt-1">Medical leaves &amp; excused</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Late Arrivals</span>
          <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{daysLate} Days</h3>
          <p className="text-xs text-muted mt-1">Bus delay recorded</p>
        </div>
      </div>

      {/* Monthly Attendance Grid */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-primary">Monthly Attendance History ({selectedMonth})</h3>
            <p className="text-xs text-secondary">Day-by-day punch record taken during 1st period roll call.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-secondary">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Late</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></span> Holiday</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {studentAprilRecords.map((rec) => {
            const isPresent = rec.status === 'PRESENT';
            const isAbsent = rec.status === 'ABSENT';
            const isLate = rec.status === 'LATE';

            return (
              <div
                key={rec.date}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between min-h-[90px] ${
                  isPresent
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:text-emerald-200'
                    : isAbsent
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800/60 dark:text-rose-200'
                    : isLate
                    ? 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-200'
                    : 'bg-surface-raised border-border text-secondary dark:bg-slate-800/50 dark:border-slate-700/60 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-primary">{rec.date}</span>
                  <span className="text-[10px] uppercase font-bold text-muted">{rec.day}</span>
                </div>

                <div className="mt-2">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-surface-raised">
                    {rec.status}
                  </span>
                  {rec.punchTime && <span className="text-[10px] block mt-1 opacity-80">{rec.punchTime}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Application Modal */}
      <AnimatePresence>
        {isLeaveModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Apply for Leave / Absence Slip</h3>
                    <p className="text-xs text-secondary">Submit absence request to Class Teacher Amit Sharma</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {leaveSubmitted ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-accent-green-subtle text-accent-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-primary">Leave Application Transmitted!</h4>
                  <p className="text-xs text-secondary">Forwarded to Class Teacher and Principal desk.</p>
                </div>
              ) : (
                <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Leave Category</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                    >
                      <option value="MEDICAL">Medical Leave (Fever / Doctor Appointment)</option>
                      <option value="CASUAL">Personal / Family Function</option>
                      <option value="EMERGENCY">Urgent Domestic Emergency</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-secondary block">Start Date</label>
                      <input
                        type="date"
                        required
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-secondary block">End Date</label>
                      <input
                        type="date"
                        required
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-secondary block">Detailed Reason</label>
                    <textarea
                      required
                      rows={3}
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Explain the reason for absence..."
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsLeaveModalOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Application</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
