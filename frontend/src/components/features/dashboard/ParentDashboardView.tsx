/**
 * @file ParentDashboardView.tsx
 * @description Tailored Dashboard for Parents: Child's attendance, test results, fee dues, PTM schedules.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, CreditCard } from 'lucide-react';

interface ParentDashboardViewProps {
  user: any;
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Parent Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
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
            className="px-5 py-3 rounded-2xl bg-surface text-accent-blue font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Q1 Fees (UPI)</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Parent Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Rahul’s Attendance</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">88.4%</span>
            <p className="text-xs text-accent-green font-medium mt-1">Present Today (Ontime)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Q1 Fee Dues</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-rose-600">₹14,500</span>
            <p className="text-xs text-muted mt-1">Due before 30 April 2026</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Latest Test Result</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">91.2%</span>
            <p className="text-xs text-accent-blue font-medium mt-1">Periodic Test 1 (Rank 4th)</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Next PTM Meeting</span>
          <div className="mt-3">
            <span className="text-xl font-bold text-primary">28 Apr, 10:30 AM</span>
            <p className="text-xs text-muted mt-1">Room 201 with Amit Sir</p>
          </div>
        </div>
      </div>
    </div>
  );
};
