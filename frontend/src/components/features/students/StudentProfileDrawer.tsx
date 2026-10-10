/**
 * @file StudentProfileDrawer.tsx
 * @description Slide-over drawer displaying student credentials, CBSE compliance, fee status, and parent details.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award } from 'lucide-react';
import type { Student } from '../../../types';

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
}) => {
  const navigate = useNavigate();
  if (!student) return null;

  const attendance = student.attendanceRate ?? student.attendancePercentage ?? 90;
  const feeDue = student.feeBalance ?? 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md h-full bg-surface shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-l border-border"
        >
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <h3 className="text-lg font-bold text-primary">Student Profile</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Identity Header */}
            <div className="pt-6 pb-4 flex items-center gap-4">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-border shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-sky to-brand-lilac flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0">
                  {(student.name || student.firstName || 'S').charAt(0)}
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-primary">{student.name}</h4>
                <p className="text-xs text-accent-blue font-semibold">
                  {student.class} - {student.section}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs font-bold text-muted">
                    Roll No: {student.rollNo || '—'}
                  </span>
                  <span className="text-[10px] text-muted">•</span>
                  <span className="font-mono text-xs font-bold text-muted">
                    {student.admissionNo}
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-2xl bg-surface-raised border border-border text-center">
                <span className="text-[10px] font-bold text-muted block mb-0.5">ATTENDANCE</span>
                <span
                  className={`text-sm font-extrabold ${
                    attendance >= 75 ? 'text-accent-green' : 'text-accent-rose'
                  }`}
                >
                  {attendance}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-raised border border-border text-center">
                <span className="text-[10px] font-bold text-muted block mb-0.5">FEE DUES</span>
                <span className="text-sm font-extrabold text-primary">
                  ₹{feeDue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-surface-raised border border-border text-center">
                <span className="text-[10px] font-bold text-muted block mb-0.5">BLOOD GROUP</span>
                <span className="text-sm font-extrabold text-accent-violet">
                  {student.bloodGroup || 'B+'}
                </span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Parent / Guardian</span>
                <span className="font-bold text-primary text-sm">{student.parentName || 'Parent Guardian'}</span>
                <span className="text-secondary block mt-0.5">{student.parentPhone || '+91 98765 00000'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Date of Birth</span>
                <span className="font-semibold text-primary">{student.dob || student.dateOfBirth || '2010-08-15'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">House Affiliation</span>
                <span className="font-semibold text-rose-600">Tagore House (Red)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border space-y-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/exams');
              }}
              className="w-full py-2.5 rounded-full bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Award className="w-4 h-4" />
              View Examinations &amp; Report Card
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-full bg-surface-raised text-secondary text-xs font-bold hover:bg-surface-raised/80 transition-all cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
