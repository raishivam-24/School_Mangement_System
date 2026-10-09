/**
 * @file NoticeCard.tsx
 * @description Card representing a school circular or announcement with downloadable attachments.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, Pin, FileText, Download, AlertTriangle } from 'lucide-react';
import { uploadService } from '../../../services';
import type { Announcement } from '../../../types';

interface NoticeCardProps {
  notice: Announcement;
  index: number;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, index }) => {
  const isUrgent = notice.priority === 'URGENT' || notice.priority === 'HIGH';

  const getPriorityBadge = () => {
    switch (notice.priority) {
      case 'URGENT':
        return 'bg-accent-rose-subtle text-accent-rose border border-rose-200';
      case 'HIGH':
        return 'bg-accent-amber-subtle text-accent-amber border border-amber-200';
      case 'LOW':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-accent-blue-subtle text-accent-blue';
    }
  };

  const getAudienceLabel = () => {
    switch (notice.targetAudience) {
      case 'STUDENTS':
        return 'For: All Students';
      case 'TEACHERS':
        return 'For: Teaching Faculty';
      case 'PARENTS':
        return 'For: Parents & Guardians';
      default:
        return 'For: Entire School';
    }
  };

  const formattedDate = notice.createdAt
    ? new Date(notice.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-surface rounded-3xl p-6 border transition-all ${
        isUrgent
          ? 'border-accent-rose/30 bg-rose-50/10 shadow-sm'
          : 'border-border shadow-card hover:shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isUrgent
                ? 'bg-accent-rose-subtle text-accent-rose'
                : 'bg-accent-blue-subtle text-accent-blue'
            }`}
          >
            {isUrgent ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge()}`}>
                {notice.priority}
              </span>
              <span className="text-xs font-semibold text-muted">• {getAudienceLabel()}</span>
            </div>

            <h3 className="text-base font-bold text-primary break-words">{notice.title}</h3>
            <p className="text-xs text-secondary mt-2 leading-relaxed whitespace-pre-line">
              {notice.content}
            </p>

            {/* Attached Circular / PDF badge */}
            {notice.attachmentUrl && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-surface-raised border border-border text-xs">
                <FileText className="w-4 h-4 text-accent-blue" />
                <span className="font-semibold text-primary truncate max-w-xs">
                  {notice.attachmentName || 'Official Circular Attachment'}
                </span>
                <a
                  href={uploadService.getFileUrl(notice.attachmentUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-accent-blue hover:text-brand-sky-dark flex items-center gap-1 font-bold text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 text-xs text-muted font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formattedDate}
              </span>
              {notice.author && (
                <span>
                  By: <strong className="text-secondary">{notice.author.name}</strong> ({notice.author.role})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
