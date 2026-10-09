/**
 * @file StudentFilters.tsx
 * @description Filter controls for Student Directory: search input and class selector.
 */

import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ClassItem } from '../../../types';

interface StudentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedClass: string;
  onClassChange: (value: string) => void;
  classes?: ClassItem[];
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  classes = [],
}) => {
  return (
    <div className="bg-surface p-4 rounded-3xl border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
      <div className="relative w-72 max-w-md">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, roll no, or admission no..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-surface-raised border border-border rounded-full text-xs text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky/20 placeholder:text-muted"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-secondary">
          <Filter className="w-3.5 h-3.5 text-muted" /> Class:
          <select
            value={selectedClass}
            onChange={(e) => onClassChange(e.target.value)}
            className="bg-surface-raised border border-border px-3 py-1.5 rounded-xl text-xs font-semibold text-primary focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Classes</option>
            {classes.length > 0 ? (
              classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))
            ) : (
              <>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Class 9">Class 9</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};
