/**
 * @file TeacherProfileDrawer.tsx
 * @description Slide-over drawer for inspecting detailed teacher credentials and assigned courses.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Teacher } from '../../../types';

interface TeacherProfileDrawerProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export const TeacherProfileDrawer: React.FC<TeacherProfileDrawerProps> = ({
  teacher,
  onClose,
}) => {
  if (!teacher) return null;

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
              <h3 className="text-lg font-bold text-primary">Faculty Details</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Card */}
            <div className="pt-6 pb-4 flex items-center gap-4">
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-sky-light shadow-sm"
              />
              <div>
                <h4 className="text-base font-bold text-primary">{teacher.name}</h4>
                <p className="text-xs text-accent-blue font-semibold">{teacher.designation}</p>
                <span className="font-mono text-xs font-bold text-muted">{teacher.employeeId}</span>
              </div>
            </div>

            {/* Details List */}
            <div className="space-y-3 py-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Department</span>
                <span className="font-semibold text-primary">{teacher.department}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Academic Qualifications</span>
                <span className="font-semibold text-primary">
                  {teacher.qualification} ({teacher.experience})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Contact Email</span>
                <span className="font-semibold text-primary">{teacher.email}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Phone Number</span>
                <span className="font-semibold text-primary">{teacher.phone}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Assigned Subjects</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {teacher.subjects.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-surface border border-border font-bold text-secondary text-[11px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-surface-raised text-secondary text-xs font-bold hover:bg-surface-raised/80 transition-all cursor-pointer"
            >
              Close Drawer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
