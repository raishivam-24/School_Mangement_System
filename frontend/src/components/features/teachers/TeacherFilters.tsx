/**
 * @file TeacherFilters.tsx
 * @description Search bar and department filter pills for the faculty directory.
 */

import React from 'react';
import { Search } from 'lucide-react';

interface TeacherFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (value: string) => void;
  departments?: string[];
}

const defaultDepartments = ['ALL', 'Mathematics', 'Science', 'Humanities', 'Computer Science'];

export const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  search,
  onSearchChange,
  selectedDept,
  onDeptChange,
  departments = defaultDepartments,
}) => {
  return (
    <div className="bg-surface p-4 rounded-3xl border border-border shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, employee ID, subject..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2 bg-surface-raised border border-border rounded-full text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
        />
      </div>

      {/* Department Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => onDeptChange(dept)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedDept === dept
                ? 'bg-accent-violet-subtle text-accent-violet font-bold border border-accent-violet/30 shadow-sm'
                : 'bg-surface-raised text-secondary hover:bg-surface-raised/80'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};
