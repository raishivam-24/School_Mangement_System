/**
 * @file StudentsPage.tsx
 * @description Students Directory with filters, search, admission drawer, and detailed profile modal.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  User,
  MoreHorizontal,
  X,
  CalendarCheck,
  DollarSign,
  Award,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Demo Student Roster
  const [students] = useState([
    {
      id: 'std_1',
      admissionNo: 'ADM-2026-001',
      name: 'Rahul Sharma',
      class: 'Class 10',
      section: 'A',
      rollNo: '1001',
      gender: 'MALE',
      attendanceRate: 94.2,
      feeBalance: 5000,
      parentName: 'Ramesh Sharma',
      parentPhone: '+91 99999 88888',
      status: 'ACTIVE',
    },
    {
      id: 'std_2',
      admissionNo: 'ADM-2026-002',
      name: 'Aman Kumar',
      class: 'Class 10',
      section: 'B',
      rollNo: '1002',
      gender: 'MALE',
      attendanceRate: 88.0,
      feeBalance: 0,
      parentName: 'Sunil Kumar',
      parentPhone: '+91 98888 77777',
      status: 'ACTIVE',
    },
    {
      id: 'std_3',
      admissionNo: 'ADM-2026-003',
      name: 'Riya Patel',
      class: 'Class 9',
      section: 'A',
      rollNo: '901',
      gender: 'FEMALE',
      attendanceRate: 96.5,
      feeBalance: 12000,
      parentName: 'Anil Patel',
      parentPhone: '+91 97777 66666',
      status: 'ACTIVE',
    },
    {
      id: 'std_4',
      admissionNo: 'ADM-2026-004',
      name: 'Priya Verma',
      class: 'Class 10',
      section: 'A',
      rollNo: '1003',
      gender: 'FEMALE',
      attendanceRate: 91.0,
      feeBalance: 2500,
      parentName: 'Deepak Verma',
      parentPhone: '+91 96666 55555',
      status: 'ACTIVE',
    },
  ]);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Students Directory</h2>
          <p className="text-xs text-slate-400 font-medium">
            Manage student enrollments, academic history, and fee statuses.
          </p>
        </div>

        <button className="px-5 py-2.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-xs shadow-glow-sky hover:bg-sky-600 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Admit New Student
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-surface p-4 rounded-3xl border border-slate-100 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-72 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or admission no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Class:
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Classes</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-surface rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Admission No</th>
                <th className="py-4 px-6">Class & Section</th>
                <th className="py-4 px-6">Attendance</th>
                <th className="py-4 px-6">Fee Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-sky-light text-brand-sky-dark font-bold flex items-center justify-center">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.parentName}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500 font-bold">{s.admissionNo}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {s.class}-{s.section}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.attendanceRate >= 90 ? 'bg-brand-mint' : 'bg-brand-yellow'
                          }`}
                          style={{ width: `${s.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-800">{s.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {s.feeBalance === 0 ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-mint-light text-brand-mint-dark">
                        Paid Full
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-yellow-light text-brand-yellow-dark">
                        Pending ₹{s.feeBalance.toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-700 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Slide-Over Modal (Matching Wireframe Sec. 11) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 p-8 relative max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 absolute top-6 right-6"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-sky-light text-brand-sky-dark font-black text-2xl flex items-center justify-center">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedStudent.admissionNo} • {selectedStudent.class}-{selectedStudent.section}
                  </p>
                </div>
              </div>

              {/* 3 Metric Summary Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    ATTENDANCE
                  </span>
                  <span className="text-base font-black text-brand-sky-dark">
                    {selectedStudent.attendanceRate}%
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    AVG RESULTS
                  </span>
                  <span className="text-base font-black text-brand-lilac-dark">86.4% (A)</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">
                    FEE DUE
                  </span>
                  <span className="text-base font-black text-brand-yellow-dark">
                    ₹{selectedStudent.feeBalance}
                  </span>
                </div>
              </div>

              {/* Parent & Contact Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <h4 className="font-bold text-slate-800">Parent / Guardian Information</h4>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Name:</strong> {selectedStudent.parentName}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Phone:</strong> {selectedStudent.parentPhone}
                </p>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 rounded-2xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
