/**
 * @file StudentAdmissionModal.tsx
 * @description Modal dialog for admitting new students into classes with parent guardian details.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClasses, useAcademicYears, useAdmitStudent } from '../../../hooks';
import type { ClassItem } from '../../../types';

interface StudentAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextRollNumber?: number;
}

export const StudentAdmissionModal: React.FC<StudentAdmissionModalProps> = ({
  isOpen,
  onClose,
  nextRollNumber = 1,
}) => {
  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const currentAcademicYear = academicYears.find((y) => y.isCurrent) || academicYears[0];
  const academicYearId = currentAcademicYear?.id || '';

  const { mutate: admitStudent, isPending: submitting } = useAdmitStudent();

  const [formData, setFormData] = useState({
    admissionNo: '',
    firstName: '',
    lastName: '',
    classId: '',
    class: 'Class 10',
    sectionId: '',
    section: 'A',
    rollNumber: String(nextRollNumber),
    gender: 'MALE' as const,
    dateOfBirth: '2010-05-15',
    bloodGroup: 'B+',
    parentName: '',
    parentPhone: '+91 ',
    emergencyContact: '',
    address: '',
    createLoginAccount: false,
    email: '',
    password: 'Student@Secure123!',
  });

  // Pre-populate first class & section
  useEffect(() => {
    if (classes.length > 0 && !formData.classId) {
      const firstClass = classes[0];
      const firstSection = firstClass.sections?.[0];
      setFormData((prev) => ({
        ...prev,
        classId: firstClass.id,
        class: firstClass.name,
        sectionId: firstSection?.id || '',
        section: firstSection?.name || 'A',
      }));
    }
  }, [classes, formData.classId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const admissionNo =
      formData.admissionNo || `ADM-2026-${String(Date.now()).slice(-4)}`;

    admitStudent(
      {
        admissionNo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact || undefined,
        address: formData.address || undefined,
        academicYearId: academicYearId || undefined,
        classId: formData.classId || undefined,
        sectionId: formData.sectionId || undefined,
        rollNumber: formData.rollNumber || String(nextRollNumber),
        parentName: formData.parentName || undefined,
        parentPhone: formData.parentPhone || undefined,
        createLoginAccount: formData.createLoginAccount,
        email: formData.email || undefined,
        password: formData.password || undefined,
      },
      {
        onSuccess: () => {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          onClose();
          setFormData((prev) => ({
            ...prev,
            admissionNo: '',
            firstName: '',
            lastName: '',
            rollNumber: '',
            parentName: '',
            parentPhone: '+91 ',
            emergencyContact: '',
            address: '',
            createLoginAccount: false,
          }));
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to admit student.');
        },
      }
    );
  };

  const selectedClassObj = classes.find((c) => c.id === formData.classId) || classes[0];
  const sectionsList = selectedClassObj?.sections || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">Admit New Student</h2>
            <p className="text-xs text-secondary">Register student details, parent info, and class allotment.</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Sharma"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Class</label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const selId = e.target.value;
                  const selClass = classes.find((c) => c.id === selId);
                  const firstSec = selClass?.sections?.[0];
                  setFormData({
                    ...formData,
                    classId: selId,
                    class: selClass?.name || 'Class 10',
                    sectionId: firstSec?.id || '',
                    section: firstSec?.name || 'A',
                  });
                }}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none font-semibold text-primary cursor-pointer"
              >
                {classes.length > 0 ? (
                  classes.map((c) => (
                    <option key={c.id} value={c.id} className="bg-surface text-primary">
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">Class 10</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Section</label>
              <select
                value={formData.sectionId}
                onChange={(e) => {
                  const selId = e.target.value;
                  const selSec = sectionsList.find((s) => s.id === selId);
                  setFormData({
                    ...formData,
                    sectionId: selId,
                    section: selSec?.name || 'A',
                  });
                }}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none font-semibold text-primary cursor-pointer"
              >
                {sectionsList.length > 0 ? (
                  sectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id} className="bg-surface text-primary">
                      Section {sec.name}
                    </option>
                  ))
                ) : (
                  <option value="">Section A</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Roll Number</label>
              <input
                type="text"
                placeholder="e.g. 26"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none font-semibold text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none text-primary cursor-pointer"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none text-primary cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none font-semibold text-primary cursor-pointer"
              >
                <option>A+</option>
                <option>B+</option>
                <option>O+</option>
                <option>AB+</option>
                <option>A-</option>
                <option>B-</option>
                <option>O-</option>
                <option>AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Sharma"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-1">Parent Contact Phone</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary mb-1">Residential Address</label>
            <input
              type="text"
              placeholder="Street, locality, city, pincode"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs text-primary focus:outline-none"
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
                  <span>Confirm Admission</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
