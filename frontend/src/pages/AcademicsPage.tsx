/**
 * @file AcademicsPage.tsx
 * @description Academic Structure & Curriculum Management Orchestrator.
 * Powered by TanStack Query for dynamic class and course catalog fetching.
 */

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useClasses, useSubjects } from '../hooks';
import {
  ClassList,
  CourseCatalog,
  CurriculumMilestones,
} from '../components/features/academics';

export const AcademicsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'CLASSES' | 'SUBJECTS' | 'CURRICULUM'>('CLASSES');

  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Academics &amp; Curriculum</h1>
          <p className="text-sm text-secondary">
            Configure classes, streams, sections, and subject syllabi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-sm shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Class</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-card w-fit">
        <button
          type="button"
          onClick={() => setSelectedTab('CLASSES')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'CLASSES'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Classes &amp; Sections
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('SUBJECTS')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'SUBJECTS'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Course Catalog
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('CURRICULUM')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'CURRICULUM'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          Syllabus &amp; Lesson Plans
        </button>
      </div>

      {/* Tab Panels */}
      {selectedTab === 'CLASSES' && (
        <ClassList classes={classes} isLoading={classesLoading} />
      )}

      {selectedTab === 'SUBJECTS' && (
        <CourseCatalog subjects={subjects} isLoading={subjectsLoading} />
      )}

      {selectedTab === 'CURRICULUM' && (
        <CurriculumMilestones />
      )}
    </div>
  );
};

export default AcademicsPage;
