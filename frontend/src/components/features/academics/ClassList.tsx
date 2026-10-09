/**
 * @file ClassList.tsx
 * @description Grid listing of classes & sections.
 */

import React from 'react';
import { ClassCard } from './ClassCard';
import type { ClassItem } from '../../../types';

interface ClassListProps {
  classes: ClassItem[];
  isLoading?: boolean;
}

export const ClassList: React.FC<ClassListProps> = ({ classes, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-muted font-medium">Loading academic classes...</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
        <p className="text-sm font-bold text-primary">No academic classes configured</p>
        <p className="text-xs text-muted mt-1">Click "Create Class" above to set up grade levels.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {classes.map((cls, idx) => (
        <ClassCard key={cls.id} classItem={cls} index={idx} />
      ))}
    </div>
  );
};
