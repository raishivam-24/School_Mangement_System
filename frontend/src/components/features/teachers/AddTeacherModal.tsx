/**
 * @file AddTeacherModal.tsx
 * @description Modal dialog for adding new faculty members and creating portal accounts.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCreateTeacher } from '../../../hooks';
import { AvatarUploader } from '../../common/AvatarUploader';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextEmployeeId?: string;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  nextEmployeeId = 'TCH-005',
}) => {
  const { mutate: createTeacher, isPending: submitting } = useCreateTeacher();

  const [formData, setFormData] = useState({
    employeeId: nextEmployeeId,
    name: '',
    avatarUrl: '',
    designation: 'PGT Mathematics',
    department: 'Mathematics',
    email: '',
    phone: '',
    qualification: 'M.Sc, B.Ed',
    password: 'Teacher@Secure123!',
    experience: '3 Years',
    gender: 'MALE' as const,
    subjects: 'Mathematics',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createTeacher(
      {
        employeeId: formData.employeeId,
        name: formData.name,
        email: formData.email,
        password: formData.password || 'Teacher@Secure123!',
        designation: formData.designation,
        department: formData.department,
        qualification: formData.qualification,
        experience: formData.experience,
        subjects: formData.subjects,
        gender: formData.gender,
        phone: formData.phone || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      },
      {
        onSuccess: () => {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          onClose();
          setFormData({
            employeeId: '',
            name: '',
            avatarUrl: '',
            designation: 'PGT Mathematics',
            department: 'Mathematics',
            email: '',
            phone: '',
            qualification: 'M.Sc, B.Ed',
            password: 'Teacher@Secure123!',
            experience: '3 Years',
            gender: 'MALE',
            subjects: 'Mathematics',
          });
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to create faculty member.');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Add Faculty Member</h2>
            <p className="text-xs text-secondary">Provide staff details, department, and portal credentials.</p>
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
          {/* Teacher Profile Photo via Cloudflare R2 */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-raised border border-border">
            <AvatarUploader
              currentAvatarUrl={formData.avatarUrl}
              onAvatarChange={(url) => setFormData((prev) => ({ ...prev, avatarUrl: url || '' }))}
              size="md"
              fallbackName={formData.name || 'Teacher'}
              allowDelete={true}
            />
            <div>
              <h4 className="text-xs font-bold text-primary">Faculty Photo (Optional)</h4>
              <p className="text-[11px] text-muted mt-0.5">
                Upload teacher photo stored securely in Cloudflare R2 object storage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Employee ID</label>
              <input
                type="text"
                required
                placeholder="e.g. TCH-005"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Ramesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Designation</label>
              <input
                type="text"
                required
                placeholder="Senior PGT Physics"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 cursor-pointer"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="teacher@dpa.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Qualification</label>
              <input
                type="text"
                required
                placeholder="M.Sc, B.Ed"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Assigned Subjects (comma separated)</label>
              <input
                type="text"
                placeholder="Physics, Lab 1"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary mb-1">Portal Login Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            />
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
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Faculty</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
