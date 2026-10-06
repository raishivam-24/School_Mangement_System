/**
 * @file AttendancePage.tsx
 * @description Attendance management featuring Class Roster marking and the Dot Matrix Monthly Grid (from screenshot).
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Save,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2026-04-10');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Student Roster with attendance statuses
  const [roster, setRoster] = useState([
    { id: '1', name: 'Lucas Johnson', rollNo: '101', status: 'PRESENT' },
    { id: '2', name: 'Emily Peterson', rollNo: '102', status: 'PRESENT' },
    { id: '3', name: 'Michael Brown', rollNo: '103', status: 'ABSENT' },
    { id: '4', name: 'Hannah White', rollNo: '104', status: 'PRESENT' },
    { id: '5', name: 'Oliver Martinez', rollNo: '105', status: 'PRESENT' },
    { id: '6', name: 'Isabella Garcia', rollNo: '106', status: 'PRESENT' },
    { id: '7', name: 'Ethan Lee', rollNo: '107', status: 'LATE' },
    { id: '8', name: 'Sophia Wilson', rollNo: '108', status: 'PRESENT' },
    { id: '9', name: 'Aiden Taylor', rollNo: '109', status: 'PRESENT' },
    { id: '10', name: 'Ava Smith', rollNo: '110', status: 'PRESENT' },
  ]);

  // Demo days for Dot Matrix (days 08 to 21 matching screenshot)
  const matrixDays = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

  const setStudentStatus = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setRoster(roster.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Class Attendance</h2>
          <p className="text-xs text-slate-400 font-medium">
            Mark daily attendance or review monthly student attendance patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-xs shadow-glow-sky hover:bg-sky-600 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {savedSuccess ? 'Saved Successfully!' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {/* Selector Filters */}
      <div className="bg-surface p-4 rounded-3xl border border-slate-100 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          />

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-sky"></span> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-rose"></span> Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-yellow"></span> Late
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MONTHLY DOT MATRIX TABLE (Directly from Screenshot) */}
      {/* ========================================================================= */}
      <div className="bg-surface rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">Monthly Attendance Matrix</h3>
          <span className="text-xs font-semibold text-slate-400">April 2026 • Week 2-3</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">Student Name</th>
                {matrixDays.map((d) => (
                  <th key={d} className="py-4 px-2 w-10">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {roster.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-6 text-left font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <span>{student.name}</span>
                  </td>

                  {matrixDays.map((d, dIdx) => {
                    // Generate deterministic dots matching screenshot look
                    const isAbsent = (idx + dIdx) % 7 === 0;
                    const isOff = dIdx === 5 || dIdx === 6 || dIdx === 12 || dIdx === 13; // Weekend
                    return (
                      <td key={d} className="py-3 px-2">
                        {isOff ? (
                          <span className="text-slate-300 font-bold">-</span>
                        ) : isAbsent ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-brand-rose inline-block shadow-sm"></span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-brand-sky inline-block shadow-sm"></span>
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
    </div>
  );
};
