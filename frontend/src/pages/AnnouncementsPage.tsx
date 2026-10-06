/**
 * @file AnnouncementsPage.tsx
 * @description School-wide Notices, Circulars, and Emergency broadcast board.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Calendar, Tag, AlertCircle, CheckCircle2, ChevronRight, Pin } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'EXAM' | 'EVENT' | 'HOLIDAY' | 'GENERAL' | 'URGENT';
  date: string;
  targetRole: string;
  isPinned: boolean;
  author: string;
}

const initialNotices: Notice[] = [
  {
    id: '1',
    title: 'Mid-Term Examination Schedule Released (Term 1)',
    content:
      'The detailed date sheet for Mid-Term Examination 2026-27 has been published for Class 9 to 12. Students are requested to download the admit cards by next week.',
    category: 'EXAM',
    date: 'April 20, 2026',
    targetRole: 'All Students & Parents',
    isPinned: true,
    author: 'Examination Cell',
  },
  {
    id: '2',
    title: 'Annual Science & Tech Fair 2026 Registrations Open',
    content:
      'Submit your working models and robotics project abstracts before May 5. Cash prizes and regional certificates will be awarded to top 3 entries.',
    category: 'EVENT',
    date: 'April 18, 2026',
    targetRole: 'Class 6 to 12',
    isPinned: true,
    author: 'Science Club',
  },
  {
    id: '3',
    title: 'School Campus Closed for Maintenance on Saturday',
    content:
      'Due to scheduled server maintenance and electrical upgrades, the school campus will remain closed on Saturday, April 25. Online portal will remain accessible.',
    category: 'GENERAL',
    date: 'April 15, 2026',
    targetRole: 'Staff & Students',
    isPinned: false,
    author: 'Administration',
  },
  {
    id: '4',
    title: 'Fee Payment Reminder for Q1 (2026-27)',
    content:
      'Parents are kindly requested to clear the first quarter tuition fees before April 30 to avoid any late fees. Online payment can be made via the Finance portal.',
    category: 'URGENT',
    date: 'April 12, 2026',
    targetRole: 'All Parents',
    isPinned: false,
    author: 'Accounts Office',
  },
];

export const AnnouncementsPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [selectedCat, setSelectedCat] = useState('ALL');

  const categories = ['ALL', 'EXAM', 'EVENT', 'GENERAL', 'URGENT'];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'EXAM':
        return 'bg-brand-lilac-light text-brand-lilac-dark';
      case 'EVENT':
        return 'bg-brand-mint-light text-brand-mint-dark';
      case 'URGENT':
        return 'bg-brand-rose-light text-brand-rose-dark';
      case 'HOLIDAY':
        return 'bg-brand-yellow-light text-brand-yellow-dark';
      default:
        return 'bg-brand-sky-light text-brand-sky-dark';
    }
  };

  const filteredNotices = notices.filter(
    (n) => selectedCat === 'ALL' || n.category === selectedCat
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notice Board & Announcements</h1>
          <p className="text-sm text-slate-500">School circulars, exam notifications, and campus event updates.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 bg-surface p-2 rounded-2xl border border-slate-100 shadow-card overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-brand-sky text-white shadow-soft'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice, idx) => (
          <motion.div
            key={notice.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-surface rounded-3xl p-6 border transition-all ${
              notice.isPinned ? 'border-brand-sky/40 bg-sky-50/20' : 'border-slate-100'
            } shadow-card hover:shadow-soft`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center shrink-0">
                  {notice.isPinned ? <Pin className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getCategoryBadge(notice.category)}`}>
                      {notice.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">• {notice.targetRole}</span>
                    {notice.isPinned && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{notice.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{notice.content}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {notice.date}
                    </span>
                    <span>By: <strong className="text-slate-700">{notice.author}</strong></span>
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-2">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
