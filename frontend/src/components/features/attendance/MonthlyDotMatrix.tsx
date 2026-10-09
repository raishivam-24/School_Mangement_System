/**
 * @file MonthlyDotMatrix.tsx
 * @description Monthly Attendance Dot Matrix Grid showing institutional attendance patterns.
 */

import React from 'react';
import type { StudentRosterItem } from '../../../types';

interface MonthlyDotMatrixProps {
  roster: StudentRosterItem[];
  matrixDays?: string[];
  className?: string;
}

const defaultMatrixDays = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];

export const MonthlyDotMatrix: React.FC<MonthlyDotMatrixProps> = ({
  roster,
  matrixDays = defaultMatrixDays,
  className = '',
}) => {
  return (
    <div className={`bg-surface rounded-3xl border border-border shadow-card overflow-hidden ${className}`}>
      <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-primary text-base">Monthly Attendance Matrix</h3>
          <p className="text-xs text-muted">Visual dot matrix pattern (Week 2–3)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-blue"></span> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent-rose"></span> Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-300"></span> Weekend / Holiday
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs">
          <thead className="bg-surface-raised/70 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
            <tr>
              <th className="py-4 px-6 text-left">Student Name</th>
              {matrixDays.map((d) => (
                <th key={d} className="py-4 px-2 w-10">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium text-secondary">
            {roster.map((student, idx) => (
              <tr key={student.id} className="hover:bg-surface-raised/60 transition-colors">
                <td className="py-3 px-6 text-left font-bold text-primary flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-surface-raised text-secondary flex items-center justify-center text-[10px] font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <span>{student.name}</span>
                </td>

                {matrixDays.map((d, dIdx) => {
                  const isAbsent = (idx + dIdx) % 7 === 0;
                  const isOff = dIdx === 5 || dIdx === 6 || dIdx === 12 || dIdx === 13;
                  return (
                    <td key={d} className="py-3 px-2">
                      {isOff ? (
                        <span className="text-muted font-bold">-</span>
                      ) : isAbsent ? (
                        <span className="w-3.5 h-3.5 rounded-full bg-accent-rose inline-block shadow-sm"></span>
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full bg-accent-blue inline-block shadow-sm"></span>
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
  );
};
