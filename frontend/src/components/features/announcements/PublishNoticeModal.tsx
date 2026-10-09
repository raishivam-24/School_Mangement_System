/**
 * @file PublishNoticeModal.tsx
 * @description Modal dialog for broadcasting circulars and notices with optional PDF attachments.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Upload, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCreateAnnouncement } from '../../../hooks';
import { uploadService } from '../../../services';
import type { AudienceType, AnnouncementPriority } from '../../../types';

interface PublishNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishNoticeModal: React.FC<PublishNoticeModalProps> = ({ isOpen, onClose }) => {
  const { mutate: createNotice, isPending: submitting } = useCreateAnnouncement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<AudienceType>('ALL');
  const [priority, setPriority] = useState<AnnouncementPriority>('NORMAL');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedName, setUploadedName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadingFile(true);
      try {
        const uploadRes = await uploadService.uploadFile(file, 'circulars');
        if (uploadRes?.url) {
          setUploadedUrl(uploadRes.url);
          setUploadedName(uploadRes.originalName || file.name);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to upload circular attachment.');
        setSelectedFile(null);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createNotice(
      {
        title,
        content,
        targetAudience,
        priority,
        attachmentUrl: uploadedUrl || undefined,
        attachmentName: uploadedName || undefined,
      },
      {
        onSuccess: () => {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          onClose();
          setTitle('');
          setContent('');
          setSelectedFile(null);
          setUploadedUrl('');
          setUploadedName('');
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to publish announcement.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Publish Circular / Notice</h2>
            <p className="text-xs text-secondary">
              Broadcast school notifications to students, parents, or faculty.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-secondary mb-1">Circular Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule for Mid-Term Examination 2026-27"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as AudienceType)}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option value="ALL">Entire School (All)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="PARENTS">Parents Only</option>
                <option value="TEACHERS">Teaching Staff Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Priority / Importance</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold text-primary focus:outline-none cursor-pointer"
              >
                <option value="NORMAL">Normal Announcement</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Circular (Red Alert)</option>
                <option value="LOW">Low (FYI Notice)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary mb-1">Notice Body / Description</label>
            <textarea
              rows={4}
              required
              placeholder="Type the full circular text or guidelines here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-bold text-secondary mb-1">Attach Circular Document (PDF / Image)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-raised border border-dashed border-border hover:border-accent-blue text-xs font-bold text-secondary cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-accent-blue" />
                <span>{uploadingFile ? 'Uploading...' : 'Choose File (Max 10MB)'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploadingFile}
                />
              </label>

              {uploadedName && (
                <div className="flex items-center gap-1.5 text-xs text-accent-green font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{uploadedName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-border text-secondary font-semibold text-xs hover:bg-surface-raised transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingFile}
              className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
