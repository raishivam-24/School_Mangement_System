/**
 * @file StudentsPage.tsx
 * @description Comprehensive Student Admissions & Directory Orchestrator.
 * Powered by TanStack Query (caching & optimistic mutations) and layered component architecture.
 */

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useStudents, useClasses } from '../hooks';
import {
  StudentFilters,
  StudentTable,
  StudentAdmissionModal,
  StudentProfileDrawer,
} from '../components/features/students';
import type { Student } from '../types';

const defaultSeedStudents: Student[] = [
  {
    id: 'std_1',
    admissionNo: 'DPA-2026-001',
    name: 'Rahul Sharma',
    class: 'Class 10',
    section: 'A',
    rollNo: '24',
    gender: 'MALE',
    attendanceRate: 88.4,
    feeBalance: 5000,
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    status: 'ACTIVE',
    bloodGroup: 'B+',
    dob: '15 Aug 2010',
  },
  {
    id: 'std_2',
    admissionNo: 'DPA-2026-002',
    name: 'Aarav Patel',
    class: 'Class 10',
    section: 'A',
    rollNo: '02',
    gender: 'MALE',
    attendanceRate: 94.0,
    feeBalance: 0,
    parentName: 'Sanjay Patel',
    parentPhone: '+91 98765 43211',
    status: 'ACTIVE',
    bloodGroup: 'O+',
    dob: '02 Feb 2010',
  },
  {
    id: 'std_3',
    admissionNo: 'DPA-2026-003',
    name: 'Ananya Iyer',
    class: 'Class 10',
    section: 'A',
    rollNo: '03',
    gender: 'FEMALE',
    attendanceRate: 96.5,
    feeBalance: 0,
    parentName: 'Venkat Iyer',
    parentPhone: '+91 98765 43212',
    status: 'ACTIVE',
    bloodGroup: 'A+',
    dob: '19 May 2010',
  },
  {
    id: 'std_4',
    admissionNo: 'DPA-2026-004',
    name: 'Devansh Verma',
    class: 'Class 10',
    section: 'B',
    rollNo: '04',
    gender: 'MALE',
    attendanceRate: 72.1,
    feeBalance: 12000,
    parentName: 'Alok Verma',
    parentPhone: '+91 98765 43213',
    status: 'ACTIVE',
    bloodGroup: 'AB+',
    dob: '11 Nov 2010',
  },
  {
    id: 'std_5',
    admissionNo: 'DPA-2026-005',
    name: 'Diya Deshmukh',
    class: 'Class 11 - Science',
    section: 'A',
    rollNo: '05',
    gender: 'FEMALE',
    attendanceRate: 91.8,
    feeBalance: 2500,
    parentName: 'Nitin Deshmukh',
    parentPhone: '+91 98765 43214',
    status: 'ACTIVE',
    bloodGroup: 'O+',
    dob: '24 Jan 2009',
  },
];

export const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);

  // TanStack Query Hooks
  const { data: serverStudents = [], isLoading } = useStudents();
  const { data: classesList = [] } = useClasses();

  // Combine live server students or fallback seeds
  const students = useMemo(() => {
    return serverStudents.length > 0 ? serverStudents : defaultSeedStudents;
  }, [serverStudents]);

  // Filter students by search term and selected class
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = s.name || `${s.firstName || ''} ${s.lastName || ''}`;
      const admissionNo = s.admissionNo || '';
      const rollNo = s.rollNo || '';
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rollNo.includes(searchTerm);
      const matchesClass = selectedClass === 'ALL' || s.class.includes(selectedClass);
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>Student Admissions &amp; Directory</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              {students.length} Enrolled
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Manage student registrations, academic records, and parent contacts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdmissionModal(true)}
          className="px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Admit New Student</span>
        </button>
      </div>

      {/* Filter Bar */}
      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classes={classesList}
      />

      {/* Roster Table */}
      <StudentTable
        students={filteredStudents}
        onSelectStudent={setSelectedStudent}
        isLoading={isLoading}
      />

      {/* Admission Modal */}
      <StudentAdmissionModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
        nextRollNumber={students.length + 1}
      />

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

export default StudentsPage;
