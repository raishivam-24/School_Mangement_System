/**
 * @file CurriculumMilestones.tsx
 * @description View tracking syllabus milestones, chapters, and quarterly progress.
 */

import React from 'react';

const milestones = [
  { subject: 'Mathematics (Class 10)', chapter: 'Chapter 4: Quadratic Equations', status: 'Completed', progress: 100 },
  { subject: 'Physics (Class 11)', chapter: 'Chapter 6: Laws of Motion & Friction', status: 'In Progress', progress: 75 },
  { subject: 'English (Class 10)', chapter: 'Unit 3: Poetry & Critical Analysis', status: 'In Progress', progress: 50 },
];

export const CurriculumMilestones: React.FC = () => {
  return (
    <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
      <h3 className="text-lg font-bold text-primary mb-2">Term 1 Curriculum &amp; Milestones</h3>
      <p className="text-xs text-secondary mb-6">Track chapter completion rates and quarterly assessments.</p>
      <div className="space-y-3">
        {milestones.map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-surface-raised border border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-accent-blue">{item.subject}</p>
              <p className="text-sm font-semibold text-primary">{item.chapter}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-green-subtle text-accent-green">
                {item.status} ({item.progress}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
