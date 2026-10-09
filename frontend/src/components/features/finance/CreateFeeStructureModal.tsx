/**
 * @file CreateFeeStructureModal.tsx
 * @description Modal for Building Fee Structures and Bulk Generating Invoices.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClasses, useAcademicYears, useCreateFeeStructure } from '../../../hooks';

interface CreateFeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFeeStructureModal: React.FC<CreateFeeStructureModalProps> = ({ isOpen, onClose }) => {
  const { data: classList = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();

  const [structureName, setStructureName] = useState('');
  const [structureAmount, setStructureAmount] = useState('25000');
  const [structureClassId, setStructureClassId] = useState('');
  const [structureYearId, setStructureYearId] = useState('');
  const [structureDueDate, setStructureDueDate] = useState('2026-11-15');

  const { mutate: createStructure, isPending } = useCreateFeeStructure();

  // Set initial default selections once metadata loads
  React.useEffect(() => {
    if (classList.length > 0 && !structureClassId) {
      setStructureClassId(classList[0].id);
    }
  }, [classList, structureClassId]);

  React.useEffect(() => {
    if (academicYears.length > 0 && !structureYearId) {
      const current = academicYears.find((y) => y.isCurrent) || academicYears[0];
      setStructureYearId(current.id);
    }
  }, [academicYears, structureYearId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!structureName.trim() || !structureClassId || !structureYearId) {
      alert('Please select class, academic year, and structure name.');
      return;
    }

    createStructure(
      {
        structure: {
          academicYearId: structureYearId,
          classId: structureClassId,
          name: structureName.trim(),
          frequency: 'ONE_TIME',
          dueDate: structureDueDate,
          items: [{ name: structureName.trim(), amount: Number(structureAmount) }],
        },
        generateDueDate: structureDueDate,
      },
      {
        onSuccess: () => {
          confetti({ particleCount: 60, spread: 70 });
          setStructureName('');
          onClose();
        },
        onError: (err: any) => {
          alert(err.response?.data?.message || 'Failed to create fee structure.');
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-primary">Create Class Fee Structure</h3>
              <p className="text-xs text-muted">Generate invoices for all enrolled students in the class.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-secondary block">Fee Structure Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Tuition & Lab Fee 2026"
                value={structureName}
                onChange={(e) => setStructureName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-secondary block">Target Class</label>
                <select
                  value={structureClassId}
                  onChange={(e) => setStructureClassId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none"
                >
                  {classList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-secondary block">Academic Year</label>
                <select
                  value={structureYearId}
                  onChange={(e) => setStructureYearId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none"
                >
                  {academicYears.map((y) => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-secondary block">Total Fee (₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={structureAmount}
                  onChange={(e) => setStructureAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-secondary block">Due Date</label>
                <input
                  type="date"
                  required
                  value={structureDueDate}
                  onChange={(e) => setStructureDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 rounded-full bg-accent-blue text-white font-bold text-xs shadow-glow-sky hover:bg-brand-sky-dark cursor-pointer flex items-center gap-1.5"
              >
                {isPending ? 'Generating Invoices...' : 'Save & Generate Invoices'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
