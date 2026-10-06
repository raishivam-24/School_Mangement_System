/**
 * @file DashboardPage.tsx
 * @description Role-Aware Operational Dashboard for SchoolHub SaaS.
 * Dynamically renders bespoke, strictly isolated views for:
 * - 🎓 Student (CBSE Roll No, 75% Attendance, Period Schedule, Homework Checklist)
 * - 👨‍🏫 Teacher (Class Teacher Roll Call, Period Agenda, Grading Queue, Syllabus %)
 * - 🏫 School Admin (Institutional Metrics, ₹ INR Fee Collections, Campus Attendance, Staff on Duty)
 * - 👨‍👩‍👧 Parent (Child Progress, Instant UPI Fee Payment, Digital Almanac Diary)
 * - 👑 Super Admin (SaaS Platform MRR in ₹, Tenant Schools, DB Health)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  DollarSign,
  FileText,
  CreditCard,
  Send,
  Upload,
  UserCheck,
  ShieldCheck,
  MapPin,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

/* ========================================================================= */
/* 🎓 1. STUDENT DASHBOARD VIEW                                              */
/* ========================================================================= */
const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

const StudentDashboardView: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Maths Ch 4: Quadratic Equations Ex 4.2',
      subject: 'Mathematics',
      subjectBadge: 'bg-sky-100 text-sky-800',
      due: 'Tomorrow, 08:30 AM',
      dueHours: 'Due in 18 Hours',
      isUrgent: true,
      done: false,
    },
    {
      id: 2,
      title: 'Physics Practical Lab: Ohm’s Law Verification',
      subject: 'Physics',
      subjectBadge: 'bg-purple-100 text-purple-800',
      due: 'Wednesday, Apr 23 (4:00 PM)',
      dueHours: 'Due in 2 Days',
      isUrgent: false,
      done: false,
    },
    {
      id: 3,
      title: 'English Critical Essay: The Ball Poem Analysis',
      subject: 'English',
      subjectBadge: 'bg-rose-100 text-rose-800',
      due: 'Friday, Apr 25 (11:59 PM)',
      dueHours: 'Due in 4 Days',
      isUrgent: false,
      done: true,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const subjectScores = [
    { subject: 'Math', score: 95, color: '#38BDF8' },
    { subject: 'Physics', score: 88, color: '#C4B5FD' },
    { subject: 'Chemistry', score: 84, color: '#FCD34D' },
    { subject: 'Biology', score: 91, color: '#34D399' },
    { subject: 'English', score: 90, color: '#FB7185' },
    { subject: 'Comp Sci', score: 96, color: '#818CF8' },
  ];

  const periodsToday = [
    { period: 1, time: '08:30 - 09:15', subject: 'Mathematics', teacher: 'Amit Sharma Sir', room: 'Room 201', current: false, color: 'bg-sky-50 border-sky-200 text-sky-900' },
    { period: 2, time: '09:15 - 10:00', subject: 'Physics Lab', teacher: 'Dr. Priya Patel', room: 'Science Lab 1', current: true, color: 'bg-purple-50 border-purple-300 text-purple-900' },
    { period: 3, time: '10:15 - 11:00', subject: 'English', teacher: 'Sunita Rao Ma’am', room: 'Room 201', current: false, color: 'bg-rose-50 border-rose-200 text-rose-900' },
    { period: 4, time: '11:00 - 11:45', subject: 'Chemistry', teacher: 'Dr. Priya Patel', room: 'Science Lab 2', current: false, color: 'bg-amber-50 border-amber-200 text-amber-900' },
    { period: 5, time: '12:30 - 01:15', subject: 'Computer Sci', teacher: 'Rajesh Nair Sir', room: 'Comp Lab 3', current: false, color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
    { period: 6, time: '01:15 - 02:00', subject: 'Physical Edu', teacher: 'Vikram Seth Sir', room: 'Playground', current: false, color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  ];

  return (
    <div className="space-y-6">
      {/* Student Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Class 10-A • Roll No: 24 • Tagore House (Red)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user.name}! 📚
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            You have 6 classes scheduled today. Next lecture is <strong className="text-white">Physics Lab with Dr. Priya Patel</strong> at 09:15 AM.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="bg-white/15 px-3 py-1 rounded-full border border-white/20">
              CBSE Candidate: #20261024
            </span>
            <span className="bg-white/15 px-3 py-1 rounded-full border border-white/20">
              Class Teacher: Amit Sharma Sir
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/my-subjects')}
            className="px-5 py-3 rounded-2xl bg-white text-brand-sky-dark font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-brand-sky" />
            <span>My Subjects &amp; Homework</span>
          </button>
          <div className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-center p-2">
            <GraduationCap className="w-7 h-7 text-brand-yellow mb-0.5" />
            <span className="text-lg font-bold">A1</span>
            <span className="text-[10px] text-sky-100 font-medium">Rank #4</span>
          </div>
        </div>
      </motion.div>

      {/* 4 Student Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Attendance */}
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Attendance</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-mint-light text-brand-mint-dark">
              Safe &gt;75%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">88.4%</span>
            <p className="text-xs text-slate-500 mt-1">115 / 130 Days Attended (CBSE Compliant)</p>
          </div>
        </div>

        {/* Card 2: Pending Homework */}
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Homework Due</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-yellow-light text-brand-yellow-dark">
              2 Due Tomorrow
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">3 Pending</span>
            <p className="text-xs text-slate-500 mt-1">Maths, Physics &amp; English</p>
          </div>
        </div>

        {/* Card 3: Next Exam */}
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Exam</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-lilac-light text-brand-lilac-dark">
              In 8 Days
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-800 leading-tight">Maths Mock Test</span>
            <p className="text-xs text-slate-500 mt-1">Syllabus: Ch 1 to 5 (Term 1)</p>
          </div>
        </div>

        {/* Card 4: Aggregate Grade */}
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Average</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-sky-light text-brand-sky-dark">
              Top 5%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">91.2%</span>
            <p className="text-xs text-slate-500 mt-1">Term 1 Periodic Assessments</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Today's Schedule + Subject Marks + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Periods + Subject Marks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">Today’s Period Schedule</h3>
                <p className="text-xs text-slate-400 font-medium">Monday • Class 10-A Timetable</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-sky-dark bg-brand-sky-light px-3 py-1 rounded-full">
                  Period 2 Ongoing
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/timetable')}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold text-brand-sky-dark hover:underline cursor-pointer"
                >
                  <span>My Timetable</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {periodsToday.map((p) => (
                <div
                  key={p.period}
                  onClick={() => navigate('/timetable')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-sm ${
                    p.current
                      ? 'bg-brand-sky-light border-brand-sky text-brand-sky-dark shadow-sm'
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Period {p.period} • {p.time}
                    </span>
                    {p.current && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-sky text-white">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{p.subject}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                    <span>{p.teacher}</span>
                    <span className="font-medium text-slate-400">{p.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance Multi-Bar */}
          <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Subject-wise Marks (% Score)</h3>
                <p className="text-xs text-slate-400 font-medium">Recent Periodic Assessment (PA-1)</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/my-subjects')}
                className="text-xs font-bold text-brand-sky-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Subjects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '16px', color: '#fff', border: 'none' }}
                  />
                  <Bar dataKey="score" radius={[12, 12, 0, 0]}>
                    {subjectScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Homework Checklist & Digital Almanac Diary */}
        <div className="space-y-6">
          {/* Homework Action Checklist */}
          <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Homework &amp; Tasks</h3>
                <p className="text-xs text-slate-400">Deadlines &amp; submissions</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/my-subjects')}
                className="px-3 py-1.5 rounded-xl bg-brand-sky-light text-brand-sky-dark hover:bg-sky-200 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>My Subjects</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    t.done
                      ? 'bg-slate-50 border-slate-100 opacity-60'
                      : t.isUrgent
                      ? 'bg-amber-50/50 border-amber-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-brand-sky shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id)}
                      className="mt-0.5 text-brand-sky cursor-pointer"
                    >
                      {t.done ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-mint-dark" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-brand-sky transition-colors" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${t.subjectBadge}`}>
                          {t.subject}
                        </span>
                        {t.isUrgent && !t.done && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-900 flex items-center gap-1 animate-pulse">
                            <Clock className="w-2.5 h-2.5 text-amber-700" />
                            <span>{t.dueHours}</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-semibold mt-1 ${t.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/60">
                        <span className="text-[10px] text-slate-500 font-medium">Due: {t.due}</span>
                        {!t.done && (
                          <button
                            type="button"
                            onClick={() => {
                              const map: Record<string, string> = {
                                'Mathematics': 'sub_math',
                                'Physics': 'sub_phy',
                                'English': 'sub_eng',
                              };
                              navigate(`/my-subjects/${map[t.subject] || 'sub_math'}`);
                            }}
                            className="text-[11px] font-bold text-brand-sky-dark hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open {t.subject} Classroom</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher's Digital Almanac / Remarks */}
          <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
            <h3 className="text-base font-bold text-slate-800 mb-3">Teacher’s Diary Remarks</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-brand-lilac-light/40 border border-brand-lilac/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-lilac-dark">Amit Sharma (Class Teacher)</span>
                  <span className="text-[10px] text-slate-400">Apr 21</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Excellent participation in Mathematics seminar today! Keep maintaining this enthusiasm.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-sky-light/40 border border-brand-sky/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-sky-dark">Dr. Priya Patel (Physics)</span>
                  <span className="text-[10px] text-slate-400">Apr 18</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Please ensure the Ohm’s law practical record notebook is signed by Wednesday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 👨‍🏫 2. TEACHER DASHBOARD VIEW                                              */
/* ========================================================================= */
const TeacherDashboardView: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const teacherLectures = [
    { period: 1, time: '08:30 - 09:15', class: 'Class 10-A', subject: 'Mathematics (Calculus)', room: 'Room 201', status: 'Completed' },
    { period: 2, time: '09:15 - 10:00', class: 'Class 11-Science', subject: 'Linear Algebra', room: 'Room 304', status: 'Next' },
    { period: 4, time: '11:00 - 11:45', class: 'Class 10-B', subject: 'Mathematics', room: 'Room 202', status: 'Upcoming' },
    { period: 5, time: '12:30 - 01:15', class: 'Class 12-Science', subject: 'Advanced Calculus', room: 'Room 401', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6">
      {/* Teacher Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Senior PGT Mathematics • Class Teacher: Class 10-A</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user.name}! 👨‍🏫
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            You have 4 teaching periods scheduled today. Period 1 roll call for Class 10-A has been marked (39/42 present).
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="px-5 py-3 rounded-2xl bg-white text-brand-sky-dark font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>Class 10-A Roll Call</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Teacher Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class 10-A Attendance</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">39 / 42</span>
            <span className="text-xs font-bold text-brand-mint-dark">Marked</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">3 Absent • Roll call done</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lectures Today</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">4 Periods</span>
            <p className="text-xs text-slate-400 mt-1">Class 10-A, 11-Sci, 10-B, 12-Sci</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Grading</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">28 Copies</span>
            <p className="text-xs text-brand-yellow-dark font-medium mt-1">Class 10-A Quadratic Quiz</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Syllabus Progress</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">68%</span>
            <p className="text-xs text-brand-mint-dark font-medium mt-1">On schedule for Term 1</p>
          </div>
        </div>
      </div>

      {/* Teacher Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-base font-bold text-slate-800 mb-4">Today’s Teaching Schedule</h3>
          <div className="space-y-3">
            {teacherLectures.map((lec, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  lec.status === 'Next'
                    ? 'bg-brand-sky-light/60 border-brand-sky'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center font-bold text-xs">
                    <span className="text-slate-400 text-[10px]">PERIOD</span>
                    <span className="text-slate-800 font-extrabold">{lec.period}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{lec.class} — {lec.subject}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{lec.time} • {lec.room}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lec.status === 'Completed'
                      ? 'bg-brand-mint-light text-brand-mint-dark'
                      : lec.status === 'Next'
                      ? 'bg-brand-sky text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {lec.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Homework Creator */}
        <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Publish Class Homework</h3>
            <p className="text-xs text-slate-400 mb-4">Post assignment to student digital almanacs</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Class</label>
                <select className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                  <option>Class 10-A (Mathematics)</option>
                  <option>Class 11-Science (Algebra)</option>
                  <option>Class 10-B (Mathematics)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Exercise 4.3 Word Problems"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Submission Deadline</label>
                <input type="date" className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-3 rounded-2xl bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            Broadcast Homework
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 🏫 3. SCHOOL ADMIN / PRINCIPAL DASHBOARD VIEW                             */
/* ========================================================================= */
const SchoolAdminDashboardView: React.FC<{ user: any }> = ({ user }) => {
  const feeMonthlyData = [
    { month: 'Apr (Q1)', collected: 142.8, target: 180 },
    { month: 'Jul (Q2)', collected: 0, target: 160 },
    { month: 'Oct (Q3)', collected: 0, target: 160 },
    { month: 'Jan (Q4)', collected: 0, target: 170 },
  ];

  const classAttendance = [
    { class: 'Class 10', percent: 94 },
    { class: 'Class 11', percent: 92 },
    { class: 'Class 12', percent: 96 },
    { class: 'Class 9', percent: 91 },
    { class: 'Class 8', percent: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Building2 className="w-3.5 h-3.5" />
            <span>Delhi Public Academy • CBSE Affiliation #1930482</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, Principal Sharma
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            Academic Year 2026–27 (Term 1) • Campus operations running smoothly with 94.2% daily attendance.
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            className="px-5 py-3 rounded-2xl bg-white text-brand-sky-dark font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Daily Admin Report</span>
          </button>
        </div>
      </motion.div>

      {/* 4 School Institutional Stat Cards (in ₹ INR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollment</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-sky-light text-brand-sky-dark">
              +120 New
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">3,250</span>
            <p className="text-xs text-slate-400 mt-1">Active Students (KG to 12th)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Attendance</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-mint-light text-brand-mint-dark">
              94.2% Today
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">3,061 / 3,250</span>
            <p className="text-xs text-slate-400 mt-1">189 Absent across all sections</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff On Duty</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-lilac-light text-brand-lilac-dark">
              95.7% Present
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">134 / 140</span>
            <p className="text-xs text-slate-400 mt-1">6 Faculty on approved leave</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Q1 Fee Collection</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-mint-light text-brand-mint-dark">
              78% Target
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-slate-800">₹1,42,80,000</span>
            <p className="text-xs text-slate-400 mt-1">₹37,20,000 Due by 30 April</p>
          </div>
        </div>
      </div>

      {/* Charts Grid: Fee Collection Ledger + Class Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-base font-bold text-slate-800 mb-1">Quarterly Fee Collections (₹ in Lakhs)</h3>
          <p className="text-xs text-slate-400 mb-6">Target vs Collected by Academic Quarter</p>
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

        <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-base font-bold text-slate-800 mb-4">Class-wise Attendance %</h3>
          <div className="space-y-3">
            {classAttendance.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">{c.class}</span>
                  <span className="text-brand-sky-dark">{c.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-sky"
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

/* ========================================================================= */
/* 👨‍👩‍👧 4. PARENT DASHBOARD VIEW                                              */
/* ========================================================================= */
const ParentDashboardView: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Parent Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Tracking: Rahul Sharma • Class 10-A (Roll No: 24)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, Parent of Rahul Sharma
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            Delhi Public Academy • Rahul is present in school today. Next Parent-Teacher Meeting (PTM) is on Saturday, April 28.
          </p>
        </div>

        <div className="relative z-10">
          <button
            type="button"
            className="px-5 py-3 rounded-2xl bg-white text-brand-sky-dark font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Q1 Fees (UPI)</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Parent Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rahul’s Attendance</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">88.4%</span>
            <p className="text-xs text-brand-mint-dark font-medium mt-1">Present Today (Ontime)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Q1 Fee Dues</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600">₹14,500</span>
            <p className="text-xs text-slate-400 mt-1">Due before 30 April 2026</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Test Result</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-800">91.2%</span>
            <p className="text-xs text-brand-sky-dark font-medium mt-1">Periodic Test 1 (Rank 4th)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-slate-100 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next PTM Meeting</span>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-800">28 Apr, 10:30 AM</span>
            <p className="text-xs text-slate-400 mt-1">Room 201 with Amit Sir</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 👑 5. MAIN ROUTER COMPONENT                                               */
/* ========================================================================= */
export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboardView user={user} />;
    case 'TEACHER':
      return <TeacherDashboardView user={user} />;
    case 'PARENT':
      return <ParentDashboardView user={user} />;
    case 'SUPER_ADMIN':
    case 'SCHOOL_ADMIN':
    default:
      return <SchoolAdminDashboardView user={user} />;
  }
};
