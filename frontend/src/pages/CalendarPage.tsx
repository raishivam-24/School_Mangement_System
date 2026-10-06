/**
 * @file CalendarPage.tsx
 * @description Academic Calendar with monthly view, upcoming holidays, exams, and school events.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState('April 2026');

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const events = [
    { day: 5, title: 'Annual Science Fair', type: 'EVENT', color: 'bg-brand-mint-light text-brand-mint-dark' },
    { day: 14, title: 'Ambedkar Jayanti Holiday', type: 'HOLIDAY', color: 'bg-brand-yellow-light text-brand-yellow-dark' },
    { day: 18, title: 'Class 10 Math Mock Exam', type: 'EXAM', color: 'bg-brand-lilac-light text-brand-lilac-dark' },
    { day: 22, title: 'Earth Day Green Drive', type: 'EVENT', color: 'bg-brand-sky-light text-brand-sky-dark' },
    { day: 28, title: 'Parent-Teacher Meeting (PTM)', type: 'MEETING', color: 'bg-brand-rose-light text-brand-rose-dark' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Events & Calendar</h1>
          <p className="text-sm text-slate-500">School holidays, examination dates, and co-curricular schedule.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Monthly Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-xs font-bold uppercase tracking-wider text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayEvent = events.find((e) => e.day === day);
              return (
                <div
                  key={day}
                  className={`min-h-[75px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    dayEvent ? 'border-slate-200 bg-slate-50/50' : 'border-slate-50 hover:bg-slate-50/30'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-700">{day}</span>
                  {dayEvent && (
                    <span className={`text-[10px] font-bold p-1 rounded-xl truncate leading-tight ${dayEvent.color}`}>
                      {dayEvent.title}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Agenda (1 col) */}
        <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-4">Upcoming Highlights</h3>
            <div className="space-y-3">
              {events.map((ev, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ev.color}`}>
                      {ev.type}
                    </span>
                    <span className="text-xs font-bold text-slate-500">April {ev.day}, 2026</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 09:30 AM
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Main Auditorium
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 rounded-2xl bg-brand-sky-light text-brand-sky-dark font-bold text-xs hover:bg-brand-sky/20 transition-all">
            Sync with Google Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
