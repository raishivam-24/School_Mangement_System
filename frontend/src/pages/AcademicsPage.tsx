/**
 * @file AcademicsPage.tsx
 * @description Academic Structure & Curriculum Management Orchestrator.
 * Powered by TanStack Query for dynamic class and course catalog fetching.
 */

import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useClasses, useSubjects } from '../hooks';
import { academicService } from '../services/academic.service';
import {
  ClassList,
  CourseCatalog,
  CurriculumMilestones,
} from '../components/features/academics';

export const AcademicsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'CLASSES' | 'SUBJECTS' | 'CURRICULUM'>('CLASSES');
  const [initializing, setInitializing] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();

  const handleInitStarterPack = async () => {
    setInitializing(true);
    try {
      await academicService.initializeStarterPack();
      await queryClient.invalidateQueries({ queryKey: ['classes'] });
      await queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setBannerMessage('Standard CBSE Classes (1 to 10) and Core Subjects initialized!');
      setTimeout(() => setBannerMessage(null), 5000);
    } catch {
      setBannerMessage('Failed to initialize starter pack. Please try again.');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {bannerMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          {bannerMessage}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Academics &amp; Curriculum</h1>
          <p className="text-sm text-secondary">
            Configure classes, streams, sections, and subject syllabi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!classesLoading && classes.length === 0 && (
            <button
              type="button"
              onClick={handleInitStarterPack}
              disabled={initializing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-accent-amber" />
              <span>{initializing ? 'Provisioning...' : '1-Click CBSE Starter Kit'}</span>
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-raised border border-border text-primary font-semibold text-xs shadow-card hover:bg-surface transition-all cursor-pointer active:scale-95"
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
