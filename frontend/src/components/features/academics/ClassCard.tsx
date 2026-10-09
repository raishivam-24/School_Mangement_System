/**
 * @file ClassCard.tsx
 * @description Card representing an academic grade/class with section details and student counts.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import type { ClassItem } from '../../../types';

interface ClassCardProps {
  classItem: ClassItem;
  index: number;
}

const colorGradients = [
  'from-brand-sky-light to-sky-100',
  'from-brand-lilac-light to-purple-100',
  'from-brand-yellow-light to-amber-100',
  'from-brand-mint-light to-emerald-100',
];

export const ClassCard: React.FC<ClassCardProps> = ({ classItem, index }) => {
  const gradient = colorGradients[index % colorGradients.length];
  const sections = classItem.sections || [];
  const totalStudents = sections.reduce((acc, sec) => acc + (sec.studentsCount || 35), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface rounded-3xl p-6 border border-border shadow-card hover:shadow-card transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-primary font-bold shadow-sm`}>
            <Layers className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">{classItem.name}</h3>
            <p className="text-xs text-muted font-mono font-medium">{classItem.code || `CLS-${classItem.order || index + 1}`}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-primary">{totalStudents}</span>
          <p className="text-[11px] text-muted">Total Enrolled</p>
        </div>
      </div>

      {/* Sections Breakdown */}
      <div className="space-y-2.5 mt-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Sections &amp; Class Teachers
        </p>
        {sections.length > 0 ? (
          sections.map((sec, i) => (
            <div
              key={sec.id || i}
              className="p-3 rounded-2xl bg-surface-raised border border-border flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-primary">Section {sec.name}</span>
                <p className="text-[11px] text-secondary">Teacher: {sec.classTeacher || 'Assigned Faculty'}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-surface border border-border font-semibold text-secondary">
                  {sec.studentsCount || 40} Students
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 rounded-2xl bg-surface-raised border border-border text-xs text-muted italic">
            No sections allotted yet.
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-secondary font-medium">{classItem.subjectsCount || 6} Active Subjects</span>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-bold text-accent-blue hover:underline cursor-pointer"
        >
          <span>Manage Class</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
