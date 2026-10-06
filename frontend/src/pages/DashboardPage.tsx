/**
 * @file DashboardPage.tsx
 * @description SchoolHub Operational Dashboard reproducing the reference UI aesthetic with
 * pastel design tokens, SVG data visualizations, mini calendar & agenda, and task lists.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  GraduationCap,
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

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Mini Calendar state
  const [selectedDay, setSelectedDay] = useState(15);

  // Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Grade Student Essays', date: 'April 24, 2026', done: false },
    { id: 2, title: 'Update Lesson Plans', date: 'April 25, 2026', done: true },
    { id: 3, title: 'Attend Department Meeting', date: 'April 26, 2026', done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // Performance Multi-Bar Chart Data (Class 10, 11, 12)
  const performanceData = [
    { day: 'Mon', class10: 92, class11: 75, class12: 88 },
    { day: 'Tue', class10: 78, class11: 85, class12: 80 },
    { day: 'Wed', class10: 82, class11: 72, class12: 90 },
    { day: 'Thu', class10: 95, class11: 82, class12: 74 },
    { day: 'Fri', class10: 70, class11: 60, class12: 68 },
  ];

  // Teaching Activity Wave Data
  const activityData = [
    { month: 'Jan', hours: 45 },
    { month: 'Feb', hours: 75 },
    { month: 'Mar', hours: 140 },
    { month: 'Apr', hours: 90 },
    { month: 'May', hours: 120 },
    { month: 'Jun', hours: 65 },
    { month: 'Jul', hours: 135 },
    { month: 'Aug', hours: 95 },
  ];

  // Attendance Donut Data (80% Present, 20% Absent)
  const attendanceData = [
    { name: 'Present', value: 80, color: '#C4B5FD' }, // Soft Lilac
    { name: 'Absent', value: 20, color: '#FCD34D' },  // Soft Pastel Yellow
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. HERO ANNOUNCEMENT BANNER */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-4 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            Your teaching classes are increasing great about 30% than last year
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-sky-100">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || 'admin@schoolhub.edu'}
            </span>
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <Phone className="w-3.5 h-3.5" />
              +1 234 567 890
            </span>
          </div>
        </div>

        {/* Decorative 3D Illustration elements */}
        <div className="hidden lg:flex items-center gap-4 relative z-10 pr-6">
          <div className="w-20 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 rotate-6 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Ambient Gradient Blob */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. TOP 4 METRIC STAT CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Classes */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft card-hover"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span>Total Classes</span>
            <span className="flex items-center gap-0.5 text-brand-mint-dark bg-brand-mint-light px-2 py-0.5 rounded-full font-bold">
              <ArrowUpRight className="w-3 h-3" /> 15%
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">147</p>
        </motion.div>

        {/* Total Students */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft card-hover"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span>Total Students</span>
            <span className="flex items-center gap-0.5 text-brand-rose-dark bg-brand-rose-light px-2 py-0.5 rounded-full font-bold">
              <ArrowDownRight className="w-3 h-3" /> 5%
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">3,250</p>
        </motion.div>

        {/* Total Hours */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft card-hover"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span>Total Hours</span>
            <span className="flex items-center gap-0.5 text-brand-yellow-dark bg-brand-yellow-light px-2 py-0.5 rounded-full font-bold">
              <ArrowUpRight className="w-3 h-3" /> 10%
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">104,687</p>
        </motion.div>

        {/* Total Income */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft card-hover"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span>Total Income</span>
            <span className="flex items-center gap-0.5 text-brand-mint-dark bg-brand-mint-light px-2 py-0.5 rounded-full font-bold">
              <ArrowUpRight className="w-3 h-3" /> 23%
            </span>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">$1,682,500</p>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE SECTION: ATTENDANCE DONUT + STUDENT PERFORMANCE + CALENDAR/AGENDA */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Attendance Donut + Performance Bar Chart */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Attendance Donut */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Student Attendance</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Donut Chart with Center Percentage */}
            <div className="relative h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={84}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 tracking-tight">80%</span>
              </div>
            </div>

            {/* Legend & Filter Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-lilac"></span>
                  Present
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-yellow"></span>
                  Absent
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-600">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>10 April 2026</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-600">
                  Grade 3 ▼
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Performance Grouped Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Student Performance</h3>
              <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-xs font-medium text-slate-500">
                Weekly ▼
              </span>
            </div>

            {/* Bar Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} barGap={3} barCategoryGap={18}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="class10" fill="#38BDF8" radius={[6, 6, 0, 0]} name="Class 10" />
                  <Bar dataKey="class11" fill="#FCD34D" radius={[6, 6, 0, 0]} name="Class 11" />
                  <Bar dataKey="class12" fill="#C4B5FD" radius={[6, 6, 0, 0]} name="Class 12" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Class Legend */}
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-50">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky"></span> Class 10
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></span> Class 11
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-lilac"></span> Class 12
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right 4 Cols: Mini Calendar Widget & Agenda */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4 bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft space-y-6"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-slate-800 text-sm">March 2030</h4>
            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-700">
            <span className="py-2 text-slate-300">28</span>
            <span className="py-2 text-slate-300">29</span>
            <span className="py-2 text-slate-300">30</span>
            <span className="py-2 text-slate-300">31</span>
            <span className="py-2">01</span>
            <span className="py-2">02</span>
            <span className="py-2">03</span>
            <span className="py-2">04</span>
            <span className="py-2">05</span>
            <span className="py-2">06</span>
            <span className="py-2">07</span>
            <span className="py-2">08</span>
            <span className="py-2">09</span>
            <span className="py-2">10</span>
            <span className="py-2">11</span>
            <span className="py-2">12</span>
            <span className="py-2">13</span>
            <span className="py-2">14</span>
            {/* Active Date Pill: 15 */}
            <button
              onClick={() => setSelectedDay(15)}
              className={`py-2 rounded-xl text-center font-bold transition-all ${
                selectedDay === 15
                  ? 'bg-brand-sky-light text-brand-sky-dark shadow-sm'
                  : 'hover:bg-slate-50'
              }`}
            >
              15
            </button>
            <span className="py-2">16</span>
            <span className="py-2">17</span>
            <span className="py-2">18</span>
            <span className="py-2">19</span>
            <span className="py-2">20</span>
            <span className="py-2">21</span>
            <span className="py-2">22</span>
            <span className="py-2">23</span>
            <span className="py-2">24</span>
          </div>

          {/* Agenda Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">Agenda</h4>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Agenda Item 1: Blue accent */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-l-4 border-brand-sky text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>History 11 AP World History</span>
                <span>8:00 AM - 9:00 AM</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Review Recent Test Results</p>
            </div>

            {/* Agenda Item 2: Lilac accent */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-l-4 border-brand-lilac text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>History 12</span>
                <span>10:00 AM - 11:30 AM</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Lecture on Cold War</p>
            </div>

            {/* Agenda Item 3: Yellow accent */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-l-4 border-brand-yellow text-left space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>History 10A</span>
                <span>4:30 PM - 5:30 PM</span>
              </div>
              <p className="text-xs font-bold text-slate-800">Prepare for Tomorrow's Debate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM SECTION: TASKS CHECKLIST + TEACHING ACTIVITY SPLINE WAVE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tasks Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-4 bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Tasks</h3>
            <button className="flex items-center gap-1 text-xs font-bold text-brand-sky-dark bg-brand-sky-light px-3 py-1.5 rounded-full hover:bg-brand-sky hover:text-white transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done ? (
                    <CheckCircle2 className="w-5 h-5 text-brand-sky fill-brand-sky text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-brand-sky" />
                  )}
                  <div>
                    <p
                      className={`text-xs font-bold text-slate-800 ${
                        task.done ? 'line-through text-slate-400 font-normal' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{task.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teaching Activity Spline Wave Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-8 bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Teaching Activity</h3>
            <span className="px-2.5 py-1 rounded-xl bg-slate-50 text-xs font-medium text-slate-500">
              Monthly ▼
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FCD34D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 160]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface p-3 rounded-2xl shadow-soft border border-slate-100 text-left">
                          <p className="text-[10px] text-slate-400 font-medium">April 30, 2026</p>
                          <p className="text-xs font-bold text-slate-800">
                            Working Hours: <span className="text-brand-yellow-dark">{payload[0].value} Hours</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
