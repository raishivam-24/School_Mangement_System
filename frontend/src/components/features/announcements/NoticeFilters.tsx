/**
 * @file NoticeFilters.tsx
 * @description Filter controls for Notice Board: category pills and search input.
 */

import React from 'react';
import { Search } from 'lucide-react';
import type { NoticeCategory } from '../../../types';

interface NoticeFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const categories: Array<{ id: string; label: string }> = [
  { id: 'ALL', label: 'All Notices' },
  { id: 'URGENT', label: 'Urgent Circulars' },
  { id: 'EXAM', label: 'Examinations' },
  { id: 'EVENT', label: 'Campus Events' },
  { id: 'GENERAL', label: 'General Admin' },
];

export const NoticeFilters: React.FC<NoticeFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="bg-surface p-4 rounded-3xl border border-border shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search circulars, exams, events..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2 bg-surface-raised border border-border rounded-full text-xs text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-accent-blue text-white shadow-card'
                : 'bg-surface-raised text-secondary hover:bg-surface-raised/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
