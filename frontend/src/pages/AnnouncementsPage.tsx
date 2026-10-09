/**
 * @file AnnouncementsPage.tsx
 * @description Notice Board & School Circulars Orchestrator.
 * Powered by TanStack Query, typed services, and integrated file upload attachments.
 */

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAnnouncements } from '../hooks';
import {
  NoticeFilters,
  NoticeCard,
  PublishNoticeModal,
} from '../components/features/announcements';
import type { Announcement } from '../types';

const defaultSeedNotices: Announcement[] = [
  {
    id: '1',
    title: 'Mid-Term Examination Schedule Released (Term 1)',
    content:
      'The detailed date sheet for Mid-Term Examination 2026-27 has been published for Class 9 to 12. Students are requested to download the admit cards and syllabus guidelines attached below.',
    priority: 'HIGH',
    category: 'EXAM',
    targetAudience: 'ALL',
    isPublished: true,
    createdAt: '2026-04-20T10:00:00Z',
    attachmentName: 'MidTerm_DateSheet_2026-27.pdf',
    attachmentUrl: '/uploads/circulars/MidTerm_DateSheet_2026.pdf',
    author: { id: 'auth_1', name: 'Examination Cell', role: 'SCHOOL_ADMIN' },
  },
  {
    id: '2',
    title: 'Annual Science & Tech Fair 2026 Registrations Open',
    content:
      'Submit your working models and robotics project abstracts before May 5. Cash prizes and regional certificates will be awarded to top 3 entries.',
    priority: 'NORMAL',
    category: 'EVENT',
    targetAudience: 'STUDENTS',
    isPublished: true,
    createdAt: '2026-04-18T14:30:00Z',
    author: { id: 'auth_2', name: 'Science Club', role: 'TEACHER' },
  },
  {
    id: '3',
    title: 'School Campus Closed for Maintenance on Saturday',
    content:
      'Due to scheduled server maintenance and electrical upgrades, the school campus will remain closed on Saturday, April 25. Online portal will remain accessible.',
    priority: 'LOW',
    category: 'GENERAL',
    targetAudience: 'ALL',
    isPublished: true,
    createdAt: '2026-04-15T09:00:00Z',
    author: { id: 'auth_3', name: 'Administration', role: 'SCHOOL_ADMIN' },
  },
  {
    id: '4',
    title: 'Fee Payment Reminder for Q1 (2026-27)',
    content:
      'Parents are kindly requested to clear the first quarter tuition fees before April 30 to avoid any late fees. Online payment can be made instantly via the Finance portal.',
    priority: 'URGENT',
    category: 'URGENT',
    targetAudience: 'PARENTS',
    isPublished: true,
    createdAt: '2026-04-12T11:15:00Z',
    author: { id: 'auth_4', name: 'Accounts Office', role: 'SCHOOL_ADMIN' },
  },
];

export const AnnouncementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // TanStack Query
  const { data: serverNotices = [], isLoading } = useAnnouncements();

  const notices = useMemo(() => {
    return serverNotices.length > 0 ? serverNotices : defaultSeedNotices;
  }, [serverNotices]);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' ||
        n.priority === selectedCategory ||
        (n.category && n.category === selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [notices, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Notice Board &amp; Announcements</h1>
          <p className="text-sm text-secondary">
            School circulars, exam notifications, and campus event updates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-sm shadow-card hover:bg-brand-sky-dark transition-all self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Filters */}
      <NoticeFilters
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Notices List */}
      {isLoading ? (
        <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted font-medium">Loading school circulars...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-border shadow-card p-12 text-center">
          <p className="text-sm font-bold text-primary">No circulars found</p>
          <p className="text-xs text-muted mt-1">Try selecting a different filter or search term.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice, idx) => (
            <NoticeCard key={notice.id} notice={notice} index={idx} />
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      <PublishNoticeModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};

export default AnnouncementsPage;
