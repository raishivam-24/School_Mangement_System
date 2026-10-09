/**
 * @file TeacherDashboardView.tsx
 * @description Tailored Dashboard for Teachers: Roll call quick link, lecture agenda, homework publisher.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, UserCheck } from 'lucide-react';

interface TeacherDashboardViewProps {
  user: any;
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ user }) => {
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
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            <span>Senior PGT Mathematics • Class Teacher: Class 10-A</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user?.name || 'Teacher'}! 👨‍🏫
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            You have 4 teaching periods scheduled today. Period 1 roll call for Class 10-A has been marked (39/42 present).
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="px-5 py-3 rounded-2xl bg-surface text-accent-blue font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>Class 10-A Roll Call</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Teacher Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Class 10-A Attendance</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary">39 / 42</span>
            <span className="text-xs font-bold text-accent-green">Marked</span>
          </div>
          <p className="text-xs text-muted mt-1">3 Absent • Roll call done</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Lectures Today</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">4 Periods</span>
            <p className="text-xs text-muted mt-1">Class 10-A, 11-Sci, 10-B, 12-Sci</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Pending Grading</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">28 Copies</span>
            <p className="text-xs text-accent-amber font-medium mt-1">Class 10-A Quadratic Quiz</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Syllabus Progress</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">68%</span>
            <p className="text-xs text-accent-green font-medium mt-1">On schedule for Term 1</p>
          </div>
        </div>
      </div>

      {/* Teacher Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-primary mb-4">Today’s Teaching Schedule</h3>
          <div className="space-y-3">
            {teacherLectures.map((lec, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  lec.status === 'Next'
                    ? 'bg-accent-blue-subtle/60 border-brand-sky'
                    : 'bg-surface-raised border-border'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex flex-col items-center justify-center font-bold text-xs">
                    <span className="text-muted text-[10px]">PERIOD</span>
                    <span className="text-primary font-extrabold">{lec.period}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">{lec.class} — {lec.subject}</h4>
                    <p className="text-xs text-muted mt-0.5">{lec.time} • {lec.room}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lec.status === 'Completed'
                      ? 'bg-accent-green-subtle text-accent-green'
                      : lec.status === 'Next'
                      ? 'bg-accent-blue text-white'
                      : 'bg-slate-200 text-secondary'
                  }`}
                >
                  {lec.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Homework Creator */}
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-primary mb-2">Publish Class Homework</h3>
            <p className="text-xs text-muted mb-4">Post assignment to student digital almanacs</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-secondary block mb-1">Target Class</label>
                <select className="w-full p-2.5 rounded-xl bg-surface-raised border border-border font-medium text-primary">
                  <option>Class 10-A (Mathematics)</option>
                  <option>Class 11-Science (Algebra)</option>
                  <option>Class 10-B (Mathematics)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-secondary block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Exercise 4.3 Word Problems"
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary"
                />
              </div>

              <div>
                <label className="font-bold text-secondary block mb-1">Submission Deadline</label>
                <input type="date" className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-3 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            Broadcast Homework
          </button>
        </div>
      </div>
    </div>
  );
};
