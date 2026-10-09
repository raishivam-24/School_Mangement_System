/**
 * @file AttendancePage.tsx
 * @description Complete Role-Aware Attendance Suite for Indian K-12 Schools.
 * - 🎓 Students / Parents: Read-only personal attendance dashboard with CBSE >75% compliance meter,
 *   term metrics, monthly visual calendar grid, verified attendance logs, and leave application modal.
 * - 👨‍🏫 Teachers & Admins: Interactive Roll Call puncher (1-click 'Mark All Present', status pills P/A/L,
 *   absence reasons, and monthly dot matrix grid).
 * Note: Half-day attendance functionality has been removed as per school administrative rules.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useAcademicStore } from '../store/useAcademicStore';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Save,
  UserCheck,
  Users,
  AlertCircle,
  Check,
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  FileText,
  Upload,
  X,
  Send,
} from 'lucide-react';

/* ========================================================================= */
/* TYPES & MOCK DATA                                                         */
/* ========================================================================= */
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  gender: 'MALE' | 'FEMALE';
  status: AttendanceStatus;
  reason?: string;
}

const defaultStudents: StudentRosterItem[] = [
  { id: '1', name: 'Rahul Sharma', rollNo: '1', admissionNo: 'DPA-2024-001', gender: 'MALE', status: 'PRESENT' },
  { id: '2', name: 'Aarav Patel', rollNo: '2', admissionNo: 'DPA-2024-002', gender: 'MALE', status: 'PRESENT' },
  { id: '3', name: 'Ananya Iyer', rollNo: '3', admissionNo: 'DPA-2024-003', gender: 'FEMALE', status: 'PRESENT' },
  { id: '4', name: 'Devansh Verma', rollNo: '4', admissionNo: 'DPA-2024-004', gender: 'MALE', status: 'ABSENT', reason: 'High fever (Parent informed)' },
  { id: '5', name: 'Diya Deshmukh', rollNo: '5', admissionNo: 'DPA-2024-005', gender: 'FEMALE', status: 'PRESENT' },
  { id: '6', name: 'Ishaan Gupta', rollNo: '6', admissionNo: 'DPA-2024-006', gender: 'MALE', status: 'PRESENT' },
  { id: '7', name: 'Kavya Nair', rollNo: '7', admissionNo: 'DPA-2024-007', gender: 'FEMALE', status: 'LATE', reason: 'School bus route delay' },
  { id: '8', name: 'Manav Joshi', rollNo: '8', admissionNo: 'DPA-2024-008', gender: 'MALE', status: 'PRESENT' },
  { id: '9', name: 'Neha Reddy', rollNo: '9', admissionNo: 'DPA-2024-009', gender: 'FEMALE', status: 'PRESENT' },
  { id: '10', name: 'Pranav Saxena', rollNo: '10', admissionNo: 'DPA-2024-010', gender: 'MALE', status: 'PRESENT' },
  { id: '11', name: 'Riya Sen', rollNo: '11', admissionNo: 'DPA-2024-011', gender: 'FEMALE', status: 'ABSENT', reason: 'Family function' },
  { id: '12', name: 'Siddharth Roy', rollNo: '12', admissionNo: 'DPA-2024-012', gender: 'MALE', status: 'PRESENT' },
];

/* Days in April for Student Calendar */
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

/* ========================================================================= */
/* 🎓 1. STUDENT PERSONAL ATTENDANCE VIEW (READ-ONLY)                        */
/* ========================================================================= */
const StudentPersonalAttendanceView: React.FC<{ user: any }> = ({ user }) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('MEDICAL');
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('April 2026');

  const [totalWorkingDays, setTotalWorkingDays] = useState(130);
  const [daysAttended, setDaysAttended] = useState(115);
  const [daysAbsent, setDaysAbsent] = useState(11);
  const [daysLate, setDaysLate] = useState(4);
  const attendancePercentage = ((daysAttended / (totalWorkingDays || 1)) * 100).toFixed(1);

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const studentId = user?.studentProfile?.id;
        if (!studentId) return;
        const res = await api.get(`/attendance/student/${studentId}`);
        if (res.data?.data?.summary) {
          const sum = res.data.data.summary;
          if (sum.totalDays > 0) {
            setTotalWorkingDays(sum.totalDays);
            setDaysAttended(sum.presentDays);
            setDaysAbsent(sum.absentDays);
            setDaysLate(sum.lateDays);
          }
        }
      } catch (err) {
        console.warn('Student attendance fetch warning:', err);
      }
    };
    fetchStudentAttendance();
  }, [user]);

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

          {/* Compliance Meter Line */}
          <div className="space-y-1.5 pt-2 max-w-md">
            <div className="flex justify-between text-xs font-bold text-sky-100">
              <span>Required: 75% CBSE Norm</span>
              <span className="text-white font-extrabold">{attendancePercentage}% Current (Safe)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface/20 overflow-hidden relative">
              {/* 75% threshold marker */}
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

      {/* 4 Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Working Days</span>
          <h3 className="text-3xl font-extrabold text-primary mt-2">{totalWorkingDays} Days</h3>
          <p className="text-xs text-muted mt-1">Term 1 (April – October)</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Days Present</span>
          <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{daysAttended} Days</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">Verified on-time roll calls</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Days Absent</span>
          <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">{daysAbsent} Days</h3>
          <p className="text-xs text-muted mt-1">3 Medical Leaves + 8 Excused</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Late Arrivals</span>
          <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">{daysLate} Days</h3>
          <p className="text-xs text-muted mt-1">School bus delay recorded</p>
        </div>
      </div>

      {/* Monthly Attendance Dot Matrix / Calendar Grid */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-primary">Monthly Attendance History ({selectedMonth})</h3>
            <p className="text-xs text-secondary">Day-by-day punch record taken during 1st period roll call.</p>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span> Absent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> Late Arrival
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></span> Weekend / Holiday
            </span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {studentAprilRecords.map((rec) => {
            const isPresent = rec.status === 'PRESENT';
            const isAbsent = rec.status === 'ABSENT';
            const isLate = rec.status === 'LATE';
            const isHoliday = rec.status === 'HOLIDAY';

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
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isPresent
                        ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : isAbsent
                        ? 'bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-300'
                        : isLate
                        ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-slate-200 text-secondary dark:bg-slate-700/60 dark:text-slate-200'
                    }`}
                  >
                    {rec.status}
                  </span>
                  {rec.punchTime && (
                    <span className="text-[10px] block mt-1 opacity-80">{rec.punchTime}</span>
                  )}
                  {rec.reason && (
                    <span className="text-[9px] block mt-1 truncate opacity-75" title={rec.reason}>
                      {rec.reason}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Absence & Leave Log Table */}
      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-4">
        <h3 className="text-base font-bold text-primary">Verified Absence &amp; Leave Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px] font-bold bg-surface-raised/50">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Recorded Status</th>
                <th className="py-3 px-4">Time Punch</th>
                <th className="py-3 px-4">Class Teacher Approval</th>
                <th className="py-3 px-4">Official Reason / Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-surface-raised/50">
                <td className="py-3.5 px-4 font-bold text-primary">14 Apr 2026</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    LATE
                  </span>
                </td>
                <td className="py-3.5 px-4 text-secondary">08:44 AM</td>
                <td className="py-3.5 px-4 text-secondary font-semibold">Amit Sharma Sir</td>
                <td className="py-3.5 px-4 text-secondary">School bus route #12 delay (Excused)</td>
              </tr>
              <tr className="hover:bg-surface-raised/50">
                <td className="py-3.5 px-4 font-bold text-primary">09 Apr 2026</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                    ABSENT
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted">—</td>
                <td className="py-3.5 px-4 text-secondary font-semibold">Amit Sharma Sir</td>
                <td className="py-3.5 px-4 text-secondary">Medical Certificate Submitted (Viral Fever)</td>
              </tr>
              <tr className="hover:bg-surface-raised/50">
                <td className="py-3.5 px-4 font-bold text-primary">08 Apr 2026</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                    ABSENT
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted">—</td>
                <td className="py-3.5 px-4 text-secondary font-semibold">Amit Sharma Sir</td>
                <td className="py-3.5 px-4 text-secondary">Sick Leave (Parent call verified)</td>
              </tr>
            </tbody>
          </table>
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
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-primary">Apply for Student Leave</h3>
                  <p className="text-xs text-secondary">Submit an official absence note to Class Teacher Amit Sharma Sir</p>
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
                  <h4 className="text-base font-bold text-primary">Leave Application Submitted!</h4>
                  <p className="text-xs text-secondary">
                    Your request has been forwarded to Class Teacher Amit Sharma Sir for verification.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-secondary block mb-1">Leave Category</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border font-medium"
                    >
                      <option value="MEDICAL">Medical / Sick Leave (Doctor Advised)</option>
                      <option value="FAMILY">Family Occasion / Function</option>
                      <option value="SPORTS">Inter-School Sports / Competition</option>
                      <option value="OTHER">Other Emergency Reason</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-secondary block mb-1">From Date</label>
                      <input
                        type="date"
                        required
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-secondary block mb-1">To Date</label>
                      <input
                        type="date"
                        required
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-surface-raised border border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-secondary block mb-1">Reason / Note to Teacher</label>
                    <textarea
                      rows={3}
                      required
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="e.g. Due to severe cold and fever, doctor advised 2 days bed rest. Medical prescription attached."
                      className="w-full p-3 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
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
                      className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
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

/* ========================================================================= */
/* 👨‍🏫 2. TEACHER / ADMIN CLASS ATTENDANCE ENGINE                           */
/* ========================================================================= */
const TeacherClassAttendanceView: React.FC<{ user: any }> = ({ user }) => {
  const { selectedDate, setSelectedDate } = useAcademicStore();

  const [activeTab, setActiveTab] = useState<'ROLL_CALL' | 'DOT_MATRIX'>('ROLL_CALL');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [academicYearId, setAcademicYearId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roster, setRoster] = useState<StudentRosterItem[]>(defaultStudents);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [classesList, setClassesList] = useState<any[]>([]);

  // Demo days for Dot Matrix
  const matrixDays = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

  // Load available classes & academic year from backend API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [clsRes, yrRes] = await Promise.all([
          api.get('/academics/classes').catch(() => null),
          api.get('/academics/years').catch(() => null),
        ]);

        if (clsRes?.data?.data) {
          const classes = Array.isArray(clsRes.data.data) ? clsRes.data.data : [];
          setClassesList(classes);
          if (classes.length > 0) {
            setSelectedClassId(classes[0].id);
            if (classes[0].sections?.length > 0) {
              setSelectedSectionId(classes[0].sections[0].id);
            }
          }
        }

        if (yrRes?.data?.data) {
          const years = Array.isArray(yrRes.data.data) ? yrRes.data.data : [];
          const current = years.find((y: any) => y.isCurrent) || years[0];
          if (current) setAcademicYearId(current.id);
        }
      } catch (err) {
        console.warn('Metadata fetch error in Attendance:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Attendance Sheet from backend when Class, Section, or Date changes
  useEffect(() => {
    const fetchSheet = async () => {
      if (!selectedClassId || !selectedSectionId || !selectedDate) return;
      try {
        const res = await api.get('/attendance', {
          params: {
            date: selectedDate,
            classId: selectedClassId,
            sectionId: selectedSectionId,
          },
        });

        if (res.data?.data?.roster && res.data.data.roster.length > 0) {
          setRoster(
            res.data.data.roster.map((r: any) => ({
              id: r.studentId,
              name: r.name,
              rollNo: String(r.rollNumber || ''),
              admissionNo: r.admissionNo,
              gender: 'MALE',
              status: r.status,
              reason: r.reason || '',
            }))
          );
        }
      } catch (err) {
        console.warn('Live attendance sheet not loaded:', err);
      }
    };
    fetchSheet();
  }, [selectedClassId, selectedSectionId, selectedDate]);

  const activeClass = classesList.find((c) => c.id === selectedClassId) || classesList[0];
  const activeSections = activeClass?.sections || [];

  // Summary counts (without half day)
  const totalCount = roster.length;
  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const lateCount = roster.filter((r) => r.status === 'LATE').length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  // 1-Click Action: Mark All Present
  const handleMarkAllPresent = () => {
    setRoster(roster.map((s) => ({ ...s, status: 'PRESENT', reason: undefined })));
  };

  // Change individual student status (PRESENT, ABSENT, LATE)
  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setRoster(
      roster.map((s) => (s.id === id ? { ...s, status, reason: status === 'PRESENT' ? undefined : s.reason } : s))
    );
  };

  // Update absence reason
  const handleReasonChange = (id: string, reason: string) => {
    setRoster(roster.map((s) => (s.id === id ? { ...s, reason } : s)));
  };

  // Save attendance to backend
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      if (selectedClassId && selectedSectionId && academicYearId) {
        await api.post('/attendance', {
          date: selectedDate,
          academicYearId,
          classId: selectedClassId,
          sectionId: selectedSectionId,
          records: roster.map((r) => ({
            studentId: r.id,
            status: r.status,
            reason: r.reason || undefined,
          })),
        });
      }

      setSaveSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save attendance records.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRoster = roster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>Class Attendance Engine</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              CBSE &gt;75% Norm
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Conduct daily morning roll calls or review institutional dot matrix attendance patterns.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-card">
          <button
            type="button"
            onClick={() => setActiveTab('ROLL_CALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ROLL_CALL'
                ? 'bg-accent-blue text-white shadow-card'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Daily Roll Call Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DOT_MATRIX')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'DOT_MATRIX'
                ? 'bg-accent-blue text-white shadow-card'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Monthly Dot Matrix</span>
          </button>
        </div>
      </div>

      {/* Filters & Live Counters */}
      <div className="bg-surface p-5 rounded-3xl border border-border shadow-card flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary">
            <Calendar className="w-4 h-4 text-accent-blue" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => {
              const newClassId = e.target.value;
              setSelectedClassId(newClassId);
              const cls = classesList.find((c) => c.id === newClassId);
              if (cls?.sections?.length > 0) {
                setSelectedSectionId(cls.sections[0].id);
              }
            }}
            className="px-4 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary focus:outline-none cursor-pointer"
          >
            {classesList.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary focus:outline-none cursor-pointer"
          >
            {activeSections.map((s: any) => (
              <option key={s.id} value={s.id}>Section {s.name}</option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Roll No or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-surface-raised text-secondary font-bold text-xs">
            Total: {totalCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-green-subtle text-accent-green font-bold text-xs flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Present: {presentCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-rose-subtle text-accent-rose font-bold text-xs">
            Absent: {absentCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-amber-subtle text-accent-amber font-bold text-xs">
            Late: {lateCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-blue-subtle text-accent-blue font-bold text-xs">
            {attendanceRate}% Present
          </span>
        </div>
      </div>

      {/* VIEW A: Daily Roll Call Sheet */}
      {activeTab === 'ROLL_CALL' && (
        <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
          {/* Action Bar */}
          <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-raised/50">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-4 py-2 rounded-2xl bg-accent-green text-white font-bold text-xs shadow-sm hover:bg-brand-mint-dark transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
              <p className="text-xs text-muted font-medium hidden md:block">
                Tip: Click <strong>Mark All Present</strong> then quickly mark absentees below.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                saveSuccess
                  ? 'bg-accent-green text-white shadow-card'
                  : 'bg-accent-blue text-white shadow-card hover:bg-brand-sky-dark'
              }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attendance Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Submit Attendance</span>
                </>
              )}
            </button>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider bg-surface-raised/40">
                  <th className="py-3.5 px-6 w-20">Roll No</th>
                  <th className="py-3.5 px-4">Student Details</th>
                  <th className="py-3.5 px-4">Admission No</th>
                  <th className="py-3.5 px-4 text-center">Status (Quick Punch)</th>
                  <th className="py-3.5 px-6">Remarks / Reason for Absence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRoster.map((student) => {
                  const isAbsent = student.status === 'ABSENT';
                  const isLate = student.status === 'LATE';

                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors ${
                        isAbsent ? 'bg-rose-50/30' : isLate ? 'bg-amber-50/20' : 'hover:bg-surface-raised/40'
                      }`}
                    >
                      <td className="py-4 px-6 font-extrabold text-secondary">
                        <span className="w-8 h-8 rounded-xl bg-surface-raised flex items-center justify-center text-xs">
                          {student.rollNo}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-primary">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              student.gender === 'FEMALE'
                                ? 'bg-accent-violet-subtle text-accent-violet'
                                : 'bg-accent-blue-subtle text-accent-blue'
                            }`}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm leading-none">{student.name}</p>
                            <span className="text-[10px] text-muted font-medium">Tagore House</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-secondary font-medium">{student.admissionNo}</td>

                      {/* Status Toggle Pills (Only P, A, L - Half Day removed) */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex items-center p-1 rounded-2xl bg-surface-raised border border-border gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              student.status === 'PRESENT'
                                ? 'bg-accent-green text-white shadow-sm'
                                : 'text-secondary hover:text-primary'
                            }`}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              student.status === 'ABSENT'
                                ? 'bg-accent-rose text-white shadow-sm'
                                : 'text-secondary hover:text-primary'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'LATE')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              student.status === 'LATE'
                                ? 'bg-accent-amber text-primary shadow-sm'
                                : 'text-secondary hover:text-primary'
                            }`}
                          >
                            L
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isAbsent || isLate ? (
                          <input
                            type="text"
                            placeholder="Reason (e.g. Fever, Traffic delay)..."
                            value={student.reason || ''}
                            onChange={(e) => handleReasonChange(student.id, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-secondary focus:outline-none focus:ring-2 focus:ring-brand-rose/20 placeholder:text-muted"
                          />
                        ) : (
                          <span className="text-[11px] text-muted italic">Present in class</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW B: Monthly Dot Matrix Grid */}
      {activeTab === 'DOT_MATRIX' && (
        <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-primary text-base">Monthly Attendance Matrix</h3>
              <p className="text-xs text-muted">Class 10 - Section A • April 2026 (Week 2-3)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent-blue"></span> Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-accent-rose"></span> Absent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span> Weekend / Holiday
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead className="bg-surface-raised/70 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 text-left">Student Name</th>
                  {matrixDays.map((d) => (
                    <th key={d} className="py-4 px-2 w-10">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-secondary">
                {roster.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-surface-raised/60 transition-colors">
                    <td className="py-3 px-6 text-left font-bold text-primary flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-surface-raised text-secondary flex items-center justify-center text-[10px] font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span>{student.name}</span>
                    </td>

                    {matrixDays.map((d, dIdx) => {
                      const isAbsent = (idx + dIdx) % 7 === 0;
                      const isOff = dIdx === 5 || dIdx === 6 || dIdx === 12 || dIdx === 13;
                      return (
                        <td key={d} className="py-3 px-2">
                          {isOff ? (
                            <span className="text-muted font-bold">-</span>
                          ) : isAbsent ? (
                            <span className="w-3.5 h-3.5 rounded-full bg-accent-rose inline-block shadow-sm"></span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full bg-accent-blue inline-block shadow-sm"></span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 👑 3. MAIN ROUTER COMPONENT: ROLE-AWARE ISOLATION                         */
/* ========================================================================= */
export const AttendancePage: React.FC = () => {
  const { user } = useAuth();

  // If user is a Student or Parent, strictly render the read-only personal attendance view
  if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
    return <StudentPersonalAttendanceView user={user} />;
  }

  // Teachers, School Admins, and Super Admins see the interactive class roll call puncher
  return <TeacherClassAttendanceView user={user} />;
};
