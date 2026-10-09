/**
 * @file TeacherGrid.tsx
 * @description Responsive grid displaying all filtered teacher cards.
 */

import React from 'react';
import { TeacherCard } from './TeacherCard';
import type { Teacher } from '../../../types';

interface TeacherGridProps {
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
  isLoading?: boolean;
}

export const TeacherGrid: React.FC<TeacherGridProps> = ({
  teachers,
  onSelectTeacher,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted font-medium">Loading faculty members...</p>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <p className="text-sm font-bold text-primary">No faculty members found</p>
        <p className="text-xs text-muted mt-1">Try searching by a different name, subject, or department filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teachers.map((teacher, idx) => (
        <TeacherCard
          key={teacher.id}
          teacher={teacher}
          index={idx}
          onSelect={onSelectTeacher}
        />
      ))}
    </div>
  );
};
