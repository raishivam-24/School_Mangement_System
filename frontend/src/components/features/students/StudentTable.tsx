/**
 * @file StudentTable.tsx
 * @description Tabular roster of enrolled students with roll numbers, attendance compliance tags, and fee dues.
 */

import React from 'react';
import type { Student } from '../../../types';

interface StudentTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  isLoading?: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onSelectStudent,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted font-medium">Loading student records...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <p className="text-sm font-bold text-primary">No students found</p>
        <p className="text-xs text-muted mt-1">Try adjusting your search criteria or class filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised/70 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 w-20">Roll No</th>
              <th className="py-4 px-6">Student Name</th>
              <th className="py-4 px-6">Admission No</th>
              <th className="py-4 px-6">Class / Sec</th>
              <th className="py-4 px-6">Attendance</th>
              <th className="py-4 px-6">Fee Dues</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium text-secondary">
            {students.map((s) => {
              const attendance = s.attendanceRate ?? s.attendancePercentage ?? 90;
              const feeDue = s.feeBalance ?? 0;

              return (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="hover:bg-surface-raised/60 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-mono font-bold text-secondary">
                    <span className="w-7 h-7 rounded-xl bg-surface-raised flex items-center justify-center font-extrabold text-xs">
                      {s.rollNo || '—'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          s.gender === 'FEMALE'
                            ? 'bg-accent-violet-subtle text-accent-violet'
                            : 'bg-accent-blue-subtle text-accent-blue'
                        }`}
                      >
                        {(s.name || s.firstName || 'S').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{s.name || `${s.firstName || ''} ${s.lastName || ''}`}</p>
                        <span className="text-[10px] text-muted">{s.parentName || 'Parent Guardian'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-secondary font-semibold">{s.admissionNo}</td>
                  <td className="py-4 px-6 font-bold text-primary">
                    {s.class} - {s.section}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        attendance >= 75
                          ? 'bg-accent-green-subtle text-accent-green'
                          : 'bg-accent-rose-subtle text-accent-rose'
                      }`}
                    >
                      {attendance}% {attendance >= 75 ? 'Safe' : 'Shortage'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {feeDue === 0 ? (
                      <span className="text-accent-green font-semibold">Paid</span>
                    ) : (
                      <span className="text-accent-rose font-bold">₹{feeDue.toLocaleString('en-IN')} Due</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectStudent(s)}
                      className="px-3 py-1 rounded-full bg-surface-raised hover:bg-surface-raised/80 text-secondary font-bold text-xs transition-all cursor-pointer"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
