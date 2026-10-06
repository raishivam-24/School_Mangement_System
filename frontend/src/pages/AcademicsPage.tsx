/**
 * @file AcademicsPage.tsx
 * @description Academic structure management: Classes, Sections, Subjects, and Curriculum.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Plus, Layers, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AcademicClass {
  id: string;
  name: string;
  code: string;
  sections: { name: string; studentsCount: number; classTeacher: string }[];
  subjectsCount: number;
  totalStudents: number;
  color: string;
}

const initialClasses: AcademicClass[] = [
  {
    id: '1',
    name: 'Class 10',
    code: 'CLS-10',
    sections: [
      { name: 'Section A', studentsCount: 42, classTeacher: 'Amit Sharma' },
      { name: 'Section B', studentsCount: 40, classTeacher: 'Sunita Rao' },
      { name: 'Section C', studentsCount: 38, classTeacher: 'Rajesh Nair' },
    ],
    subjectsCount: 6,
    totalStudents: 120,
    color: 'from-brand-sky-light to-sky-100',
  },
  {
    id: '2',
    name: 'Class 11 - Science',
    code: 'CLS-11-SCI',
    sections: [
      { name: 'Section A (PCM)', studentsCount: 35, classTeacher: 'Dr. Priya Patel' },
      { name: 'Section B (PCB)', studentsCount: 32, classTeacher: 'Meera Deshmukh' },
    ],
    subjectsCount: 5,
    totalStudents: 67,
    color: 'from-brand-lilac-light to-purple-100',
  },
  {
    id: '3',
    name: 'Class 12 - Science',
    code: 'CLS-12-SCI',
    sections: [
      { name: 'Section A (PCM)', studentsCount: 38, classTeacher: 'Dr. Priya Patel' },
      { name: 'Section B (PCB)', studentsCount: 34, classTeacher: 'Meera Deshmukh' },
    ],
    subjectsCount: 5,
    totalStudents: 72,
    color: 'from-brand-yellow-light to-amber-100',
  },
  {
    id: '4',
    name: 'Class 9',
    code: 'CLS-09',
    sections: [
      { name: 'Section A', studentsCount: 45, classTeacher: 'Sunita Rao' },
      { name: 'Section B', studentsCount: 44, classTeacher: 'Rajesh Nair' },
    ],
    subjectsCount: 6,
    totalStudents: 89,
    color: 'from-brand-mint-light to-emerald-100',
  },
];

export const AcademicsPage: React.FC = () => {
  const [classes] = useState<AcademicClass[]>(initialClasses);
  const [selectedTab, setSelectedTab] = useState<'CLASSES' | 'SUBJECTS' | 'CURRICULUM'>('CLASSES');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academics & Curriculum</h1>
          <p className="text-sm text-slate-500">Configure classes, streams, sections, and subject syllabi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all">
            <Plus className="w-4 h-4" />
            <span>Create Class</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-slate-100 shadow-card w-fit">
        <button
          onClick={() => setSelectedTab('CLASSES')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'CLASSES'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Classes & Sections
        </button>
        <button
          onClick={() => setSelectedTab('SUBJECTS')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'SUBJECTS'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Course Catalog
        </button>
        <button
          onClick={() => setSelectedTab('CURRICULUM')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedTab === 'CURRICULUM'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Syllabus & Lesson Plans
        </button>
      </div>

      {/* Classes Grid */}
      {selectedTab === 'CLASSES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls, idx) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-soft transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cls.color} flex items-center justify-center text-slate-800 font-bold shadow-sm`}>
                    <Layers className="w-6 h-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{cls.name}</h3>
                    <p className="text-xs text-slate-400 font-mono font-medium">{cls.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{cls.totalStudents}</span>
                  <p className="text-[11px] text-slate-400">Total Enrolled</p>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-2.5 mt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sections & Class Teachers
                </p>
                {cls.sections.map((sec, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{sec.name}</span>
                      <p className="text-[11px] text-slate-500">Teacher: {sec.classTeacher}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 font-semibold text-slate-700">
                        {sec.studentsCount} Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{cls.subjectsCount} Active Subjects</span>
                <button className="flex items-center gap-1 text-xs font-bold text-brand-sky-dark hover:underline">
                  <span>Manage Class</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Subjects View */}
      {selectedTab === 'SUBJECTS' && (
        <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Core Academic Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'Computer Science'].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{s}</h4>
                  <p className="text-xs text-slate-400">Weekly 6 Sessions • Core Credit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum View */}
      {selectedTab === 'CURRICULUM' && (
        <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Term 1 Curriculum & Milestones</h3>
          <p className="text-xs text-slate-500 mb-6">Track chapter completion rates and quarterly assessments.</p>
          <div className="space-y-3">
            {[
              { subject: 'Mathematics (Class 10)', chapter: 'Chapter 4: Quadratic Equations', status: 'Completed', progress: 100 },
              { subject: 'Physics (Class 11)', chapter: 'Chapter 6: Laws of Motion & Friction', status: 'In Progress', progress: 75 },
              { subject: 'English (Class 10)', chapter: 'Unit 3: Poetry & Critical Analysis', status: 'In Progress', progress: 50 },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-brand-sky-dark">{item.subject}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.chapter}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-mint-light text-brand-mint-dark">
                    {item.status} ({item.progress}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
