/**
 * @file StudentDashboardView.tsx
 * @description Tailored Dashboard for Students: CBSE roll metrics, timetable, performance bar chart, and tasks.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  Circle,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface StudentDashboardViewProps {
  user: any;
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ user }) => {
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
    { period: 1, time: '08:30 - 09:15', subject: 'Mathematics', teacher: 'Amit Sharma Sir', room: 'Room 201', current: false },
    { period: 2, time: '09:15 - 10:00', subject: 'Physics Lab', teacher: 'Dr. Priya Patel', room: 'Science Lab 1', current: true },
    { period: 3, time: '10:15 - 11:00', subject: 'English', teacher: 'Sunita Rao Ma’am', room: 'Room 201', current: false },
    { period: 4, time: '11:00 - 11:45', subject: 'Chemistry', teacher: 'Dr. Priya Patel', room: 'Science Lab 2', current: false },
    { period: 5, time: '12:30 - 01:15', subject: 'Computer Sci', teacher: 'Rajesh Nair Sir', room: 'Comp Lab 3', current: false },
    { period: 6, time: '01:15 - 02:00', subject: 'Physical Edu', teacher: 'Vikram Seth Sir', room: 'Playground', current: false },
  ];

  return (
    <div className="space-y-6">
      {/* Student Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            <span>Class 10-A • Roll No: 24 • Tagore House (Red)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user?.name || 'Student'}! 📚
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            You have 6 classes scheduled today. Next lecture is <strong className="text-white">Physics Lab with Dr. Priya Patel</strong> at 09:15 AM.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="bg-surface/15 px-3 py-1 rounded-full border border-white/20">
              CBSE Candidate: #20261024
            </span>
            <span className="bg-surface/15 px-3 py-1 rounded-full border border-white/20">
              Class Teacher: Amit Sharma Sir
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/my-subjects')}
            className="px-5 py-3 rounded-2xl bg-surface text-accent-blue font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-accent-blue" />
            <span>My Subjects &amp; Homework</span>
          </button>
          <div className="w-24 h-24 rounded-2xl bg-surface/15 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-center p-2">
            <GraduationCap className="w-7 h-7 text-accent-amber mb-0.5" />
            <span className="text-lg font-bold">A1</span>
            <span className="text-[10px] text-sky-100 font-medium">Rank #4</span>
          </div>
        </div>
      </motion.div>

      {/* 4 Student Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">My Attendance</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-green-subtle text-accent-green">
              Safe &gt;75%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">88.4%</span>
            <p className="text-xs text-secondary mt-1">115 / 130 Days Attended (CBSE Compliant)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Homework Due</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-amber-subtle text-accent-amber">
              2 Due Tomorrow
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">3 Pending</span>
            <p className="text-xs text-secondary mt-1">Maths, Physics &amp; English</p>
          </div>
        </div>

        <div
          onClick={() => navigate('/exams')}
          className="bg-surface rounded-3xl p-5 border border-border shadow-card flex flex-col justify-between cursor-pointer hover:border-accent-violet transition-all group hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Upcoming Exam</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-violet-subtle text-accent-violet flex items-center gap-1 group-hover:scale-105 transition-transform">
              In 8 Days <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-primary leading-tight group-hover:text-accent-violet transition-colors">Maths Mock Test</span>
            <p className="text-xs text-secondary mt-1">Syllabus: Ch 1 to 5 (Term 1) &bull; View Schedule &rarr;</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Academic Average</span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-accent-blue-subtle text-accent-blue">
              Top 5%
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">91.2%</span>
            <p className="text-xs text-secondary mt-1">Term 1 Periodic Assessments</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Today's Schedule + Subject Marks + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-primary">Today’s Period Schedule</h3>
                <p className="text-xs text-muted font-medium">Monday • Class 10-A Timetable</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-accent-blue bg-accent-blue-subtle px-3 py-1 rounded-full">
                  Period 2 Ongoing
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/timetable')}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold text-accent-blue hover:underline cursor-pointer"
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
                      ? 'bg-accent-blue-subtle border-brand-sky text-accent-blue shadow-sm'
                      : 'bg-surface-raised border-border text-secondary hover:bg-surface-raised/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Period {p.period} • {p.time}
                    </span>
                    {p.current && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-accent-blue text-white">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-primary">{p.subject}</h4>
                  <div className="flex items-center justify-between text-xs text-secondary mt-2">
                    <span>{p.teacher}</span>
                    <span className="font-medium text-muted">{p.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Performance Multi-Bar */}
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-primary">Subject-wise Marks (% Score)</h3>
                <p className="text-xs text-muted font-medium">Recent Periodic Assessment (PA-1)</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/my-subjects')}
                className="text-xs font-bold text-accent-blue hover:underline flex items-center gap-1 cursor-pointer"
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
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-primary">Homework &amp; Tasks</h3>
                <p className="text-xs text-muted">Deadlines &amp; submissions</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/my-subjects')}
                className="px-3 py-1.5 rounded-xl bg-accent-blue-subtle text-accent-blue hover:bg-sky-200 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                      ? 'bg-surface-raised border-border opacity-60'
                      : t.isUrgent
                      ? 'bg-amber-50/50 border-amber-200 shadow-sm'
                      : 'bg-surface border-border hover:border-accent-blue shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id)}
                      className="mt-0.5 text-accent-blue cursor-pointer"
                    >
                      {t.done ? (
                        <CheckCircle2 className="w-5 h-5 text-accent-green" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted hover:text-accent-blue transition-colors" />
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
                      <p className={`text-xs font-semibold mt-1 ${t.done ? 'line-through text-muted' : 'text-primary'}`}>
                        {t.title}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/60">
                        <span className="text-[10px] text-secondary font-medium">Due: {t.due}</span>
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
                            className="text-[11px] font-bold text-accent-blue hover:underline flex items-center gap-0.5 cursor-pointer"
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
          <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
            <h3 className="text-base font-bold text-primary mb-3">Teacher’s Diary Remarks</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-accent-violet-subtle/40 border border-brand-lilac/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-accent-violet">Amit Sharma (Class Teacher)</span>
                  <span className="text-[10px] text-muted">Apr 21</span>
                </div>
                <p className="text-secondary leading-relaxed">
                  Excellent participation in Mathematics seminar today! Keep maintaining this enthusiasm.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent-blue-subtle/40 border border-brand-sky/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-accent-blue">Dr. Priya Patel (Physics)</span>
                  <span className="text-[10px] text-muted">Apr 18</span>
                </div>
                <p className="text-secondary leading-relaxed">
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
