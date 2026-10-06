/**
 * @file useAcademicStore.ts
 * @description Zustand store for shared academic context: active academic year, selected class & section filters.
 */

import { create } from 'zustand';

interface AcademicState {
  academicYearId: string | null;
  academicYearLabel: string;
  selectedClassId: string | null;
  selectedClassName: string;
  selectedSectionId: string | null;
  selectedSectionName: string;
  selectedDate: string; // YYYY-MM-DD
  setAcademicYear: (id: string, label: string) => void;
  setClassAndSection: (classId: string, className: string, sectionId: string, sectionName: string) => void;
  setSelectedDate: (date: string) => void;
}

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useAcademicStore = create<AcademicState>((set) => ({
  academicYearId: null,
  academicYearLabel: '2026-2027 (Term 1)',
  selectedClassId: null,
  selectedClassName: 'Class 10',
  selectedSectionId: null,
  selectedSectionName: 'Section A',
  selectedDate: getTodayDateString(),

  setAcademicYear: (id, label) => set({ academicYearId: id, academicYearLabel: label }),
  setClassAndSection: (classId, className, sectionId, sectionName) =>
    set({
      selectedClassId: classId,
      selectedClassName: className,
      selectedSectionId: sectionId,
      selectedSectionName: sectionName,
    }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
