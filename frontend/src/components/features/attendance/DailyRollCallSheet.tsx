/**
 * @file DailyRollCallSheet.tsx
 * @description Interactive Roll Call Puncher with 1-click 'Mark All Present' and live status pills.
 */

import React, { useState } from 'react';
import { Sparkles, Save, Check, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSubmitAttendance } from '../../../hooks';
import type { StudentRosterItem, AttendanceStatus } from '../../../types';

interface DailyRollCallSheetProps {
  roster: StudentRosterItem[];
  setRoster: React.Dispatch<React.SetStateAction<StudentRosterItem[]>>;
  selectedDate: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
}

export const DailyRollCallSheet: React.FC<DailyRollCallSheetProps> = ({
  roster,
  setRoster,
  selectedDate,
  classId,
  sectionId,
  academicYearId,
}) => {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { mutate: submitAttendance, isPending: isSaving } = useSubmitAttendance();

  // 1-Click Action: Mark All Present
  const handleMarkAllPresent = () => {
    setRoster(roster.map((s) => ({ ...s, status: 'PRESENT', reason: undefined })));
  };

  // Change individual student status (PRESENT, ABSENT, LATE)
  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setRoster(
      roster.map((s) => (s.id === id ? { ...s, status, reason: status === 'PRESENT' ? undefined : s.reason } : s))
    );
  };

  // Update absence reason
  const handleReasonChange = (id: string, reason: string) => {
    setRoster(roster.map((s) => (s.id === id ? { ...s, reason } : s)));
  };

  const handleSave = () => {
    if (!classId || !sectionId || !academicYearId) {
      alert('Please select an active Class, Section, and Academic Year.');
      return;
    }

    submitAttendance(
      {
        date: selectedDate,
        academicYearId,
        classId,
        sectionId,
        records: roster.map((r) => ({
          studentId: r.id,
          status: r.status,
          reason: r.reason || undefined,
        })),
      },
      {
        onSuccess: () => {
          setSaveSuccess(true);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          setTimeout(() => setSaveSuccess(false), 3500);
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to save attendance records.');
        },
      }
    );
  };

  return (
    <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
      {/* Table Header Action Bar */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-raised/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-secondary">Quick Actions:</span>
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-green-subtle text-accent-green hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {saveSuccess && (
            <span className="text-xs font-bold text-accent-green flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Attendance Saved &amp; Audited!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-accent-blue text-white text-xs font-bold shadow-glow-sky hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Auditing...' : 'Save Attendance Records'}</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-raised/70 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Roll #</th>
              <th className="py-3 px-5">Student Name</th>
              <th className="py-3 px-5">Admission ID</th>
              <th className="py-3 px-5 text-center">Status (P / A / L)</th>
              <th className="py-3 px-5">Absence Remarks / Parent Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-secondary">
            {roster.map((student) => {
              const isPresent = student.status === 'PRESENT';
              const isAbsent = student.status === 'ABSENT';
              const isLate = student.status === 'LATE';

              return (
                <tr key={student.id} className="hover:bg-surface-raised/60 transition-colors">
                  <td className="py-3 px-5 font-bold text-primary">{student.rollNo || '—'}</td>
                  <td className="py-3 px-5 font-bold text-primary">{student.name}</td>
                  <td className="py-3 px-5 font-mono text-muted">{student.admissionNo}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={`w-8 h-8 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                          isPresent
                            ? 'bg-emerald-500 text-white shadow-sm scale-105'
                            : 'bg-surface-raised text-muted hover:bg-emerald-100 dark:hover:bg-emerald-950'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={`w-8 h-8 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                          isAbsent
                            ? 'bg-rose-500 text-white shadow-sm scale-105'
                            : 'bg-surface-raised text-muted hover:bg-rose-100 dark:hover:bg-rose-950'
                        }`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'LATE')}
                        className={`w-8 h-8 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                          isLate
                            ? 'bg-amber-500 text-white shadow-sm scale-105'
                            : 'bg-surface-raised text-muted hover:bg-amber-100 dark:hover:bg-amber-950'
                        }`}
                      >
                        L
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <input
                      type="text"
                      placeholder={isAbsent || isLate ? 'Enter absence reason...' : 'No remarks'}
                      value={student.reason || ''}
                      onChange={(e) => handleReasonChange(student.id, e.target.value)}
                      disabled={isPresent}
                      className={`w-full max-w-xs px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-all ${
                        isPresent
                          ? 'bg-transparent border-transparent text-muted cursor-not-allowed'
                          : 'bg-surface-raised border-border text-primary'
                      }`}
                    />
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
