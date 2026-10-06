/**
 * @file TimetablePage.tsx
 * @description Interactive weekly timetable grid with class switcher and pastel subject cards.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Download, Printer, Filter } from 'lucide-react';

interface PeriodSlot {
  time: string;
  subject: string;
  room: string;
  teacher: string;
  color: string;
}

export const TimetablePage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10 - Section A');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['08:30 - 09:15', '09:15 - 10:00', '10:15 - 11:00', '11:00 - 11:45', '12:30 - 01:15', '01:15 - 02:00'];

  const schedule: Record<string, PeriodSlot[]> = {
    Monday: [
      { time: '08:30 - 09:15', subject: 'Mathematics', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '09:15 - 10:00', subject: 'Physics', room: 'Lab 1', teacher: 'Dr. Priya Patel', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '10:15 - 11:00', subject: 'English', room: 'Room 201', teacher: 'Sunita Rao', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '11:00 - 11:45', subject: 'Chemistry', room: 'Lab 2', teacher: 'Dr. Priya Patel', color: 'bg-brand-yellow-light text-brand-yellow-dark border-amber-200' },
      { time: '12:30 - 01:15', subject: 'Computer Sci', room: 'Comp Lab 3', teacher: 'Rajesh Nair', color: 'bg-sky-50 text-sky-700 border-sky-100' },
      { time: '01:15 - 02:00', subject: 'Physical Edu', room: 'Ground', teacher: 'Vikram Seth', color: 'bg-rose-50 text-rose-700 border-rose-100' },
    ],
    Tuesday: [
      { time: '08:30 - 09:15', subject: 'Physics', room: 'Lab 1', teacher: 'Dr. Priya Patel', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '09:15 - 10:00', subject: 'Mathematics', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '10:15 - 11:00', subject: 'Computer Sci', room: 'Comp Lab 3', teacher: 'Rajesh Nair', color: 'bg-sky-50 text-sky-700 border-sky-100' },
      { time: '11:00 - 11:45', subject: 'English', room: 'Room 201', teacher: 'Sunita Rao', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '12:30 - 01:15', subject: 'Biology', room: 'Lab 3', teacher: 'Dr. Meera', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '01:15 - 02:00', subject: 'Library Hour', room: 'Central Lib', teacher: 'Anand Roy', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    ],
    Wednesday: [
      { time: '08:30 - 09:15', subject: 'Mathematics', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '09:15 - 10:00', subject: 'English', room: 'Room 201', teacher: 'Sunita Rao', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '10:15 - 11:00', subject: 'Chemistry Lab', room: 'Lab 2', teacher: 'Dr. Priya Patel', color: 'bg-brand-yellow-light text-brand-yellow-dark border-amber-200' },
      { time: '11:00 - 11:45', subject: 'Chemistry Lab', room: 'Lab 2', teacher: 'Dr. Priya Patel', color: 'bg-brand-yellow-light text-brand-yellow-dark border-amber-200' },
      { time: '12:30 - 01:15', subject: 'History', room: 'Room 201', teacher: 'Kavita Sen', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '01:15 - 02:00', subject: 'Art & Craft', room: 'Studio B', teacher: 'Pooja Hegde', color: 'bg-rose-50 text-rose-700 border-rose-100' },
    ],
    Thursday: [
      { time: '08:30 - 09:15', subject: 'Biology', room: 'Lab 3', teacher: 'Dr. Meera', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '09:15 - 10:00', subject: 'Physics', room: 'Lab 1', teacher: 'Dr. Priya Patel', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '10:15 - 11:00', subject: 'Mathematics', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '11:00 - 11:45', subject: 'English', room: 'Room 201', teacher: 'Sunita Rao', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '12:30 - 01:15', subject: 'Computer Sci', room: 'Comp Lab 3', teacher: 'Rajesh Nair', color: 'bg-sky-50 text-sky-700 border-sky-100' },
      { time: '01:15 - 02:00', subject: 'Music & Drama', room: 'Auditorium', teacher: 'Suman Roy', color: 'bg-brand-yellow-light text-brand-yellow-dark border-amber-200' },
    ],
    Friday: [
      { time: '08:30 - 09:15', subject: 'Mathematics', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '09:15 - 10:00', subject: 'Physics', room: 'Lab 1', teacher: 'Dr. Priya Patel', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '10:15 - 11:00', subject: 'Social Studies', room: 'Room 201', teacher: 'Kavita Sen', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      { time: '11:00 - 11:45', subject: 'English', room: 'Room 201', teacher: 'Sunita Rao', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '12:30 - 01:15', subject: 'Sports / PE', room: 'Playground', teacher: 'Vikram Seth', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '01:15 - 02:00', subject: 'Club Activities', room: 'Activity Hall', teacher: 'Various', color: 'bg-brand-yellow-light text-brand-yellow-dark border-amber-200' },
    ],
    Saturday: [
      { time: '08:30 - 09:15', subject: 'Weekly Quiz', room: 'Room 201', teacher: 'Amit Sharma', color: 'bg-brand-sky-light text-brand-sky-dark border-sky-200' },
      { time: '09:15 - 10:00', subject: 'Doubt Clearing', room: 'Room 201', teacher: 'Dr. Priya Patel', color: 'bg-brand-lilac-light text-brand-lilac-dark border-purple-200' },
      { time: '10:15 - 11:00', subject: 'Robotics Club', room: 'Makerspace', teacher: 'Rajesh Nair', color: 'bg-sky-50 text-sky-700 border-sky-100' },
      { time: '11:00 - 11:45', subject: 'Yoga & Wellness', room: 'Yoga Hall', teacher: 'Suman Roy', color: 'bg-brand-mint-light text-brand-mint-dark border-emerald-200' },
      { time: '12:30 - 01:15', subject: 'Dispersal', room: 'Campus', teacher: 'Staff', color: 'bg-slate-100 text-slate-700 border-slate-200' },
      { time: '01:15 - 02:00', subject: 'Faculty Meet', room: 'Staff Room', teacher: 'Staff', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    ],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Class Timetable & Schedule</h1>
          <p className="text-sm text-slate-500">Weekly class periods, lab sessions, and assigned subject teachers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all">
            <Printer className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-sky text-white font-semibold text-xs shadow-soft hover:bg-brand-sky-dark transition-all">
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Class Selector Pill Bar */}
      <div className="bg-surface p-4 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Select Section:</span>
          {['Class 10 - Section A', 'Class 10 - Section B', 'Class 11 - Science A', 'Class 12 - Science A'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedClass === cls
                  ? 'bg-brand-sky text-white shadow-soft'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 rounded-l-2xl w-32">
                Day
              </th>
              {times.map((t, i) => (
                <th
                  key={i}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 text-center ${
                    i === times.length - 1 ? 'rounded-r-2xl' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-brand-sky" />
                    <span>Period {i + 1}</span>
                  </div>
                  <span className="text-[10px] font-normal text-slate-400 block">{t}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {days.map((day) => (
              <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-sm text-slate-800 align-middle">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-sky" />
                    <span>{day}</span>
                  </div>
                </td>
                {schedule[day]?.map((period, idx) => (
                  <td key={idx} className="p-2 align-top">
                    <div className={`p-3 rounded-2xl border transition-all ${period.color}`}>
                      <p className="font-bold text-xs leading-tight mb-1">{period.subject}</p>
                      <p className="text-[10px] font-medium opacity-80">{period.room}</p>
                      <p className="text-[10px] font-semibold opacity-90 truncate mt-1">{period.teacher}</p>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
