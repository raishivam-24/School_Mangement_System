/**
 * @file CourseCatalog.tsx
 * @description Catalog view for academic subjects and courses.
 */

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { SubjectItem } from '../../../types';

interface CourseCatalogProps {
  subjects?: SubjectItem[];
  isLoading?: boolean;
}

const defaultSubjectNames = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'Computer Science',
];

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ subjects = [], isLoading = false }) => {
  const displaySubjects =
    subjects.length > 0
      ? subjects.map((s) => ({ name: s.name, code: s.code }))
      : defaultSubjectNames.map((name) => ({ name, code: 'Core Credit' }));

  return (
    <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
      <h3 className="text-lg font-bold text-primary mb-4">Core Academic Subjects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displaySubjects.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-surface-raised border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary">{s.name}</h4>
              <p className="text-xs text-muted">Weekly 6 Sessions • {s.code || 'Core Credit'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
