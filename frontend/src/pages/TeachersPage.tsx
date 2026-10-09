/**
 * @file TeachersPage.tsx
 * @description Faculty & Teaching Staff Directory Orchestrator.
 * Powered by TanStack Query, typed services, and modular feature components.
 */

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useTeachers } from '../hooks';
import {
  TeacherFilters,
  TeacherGrid,
  AddTeacherModal,
  TeacherProfileDrawer,
} from '../components/features/teachers';
import type { Teacher } from '../types';

const defaultSeedTeachers: Teacher[] = [
  {
    id: '1',
    employeeId: 'TCH-001',
    name: 'Amit Sharma',
    designation: 'Senior PGT Mathematics',
    department: 'Mathematics',
    email: 'amit.sharma@dpa.edu',
    phone: '+91 98765 43210',
    qualification: 'M.Sc. Mathematics, B.Ed',
    experience: '8 Years',
    subjects: ['Calculus', 'Linear Algebra', 'Class 10 Math'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    joiningDate: '15 Jun 2018',
  },
  {
    id: '2',
    employeeId: 'TCH-002',
    name: 'Dr. Priya Patel',
    designation: 'Head of Department - Science',
    department: 'Science',
    email: 'priya.patel@dpa.edu',
    phone: '+91 98765 43211',
    qualification: 'Ph.D. Physics',
    experience: '12 Years',
    subjects: ['Physics (11th & 12th)', 'Thermodynamics', 'Lab 1'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    joiningDate: '01 Aug 2014',
  },
  {
    id: '3',
    employeeId: 'TCH-003',
    name: 'Sunita Rao',
    designation: 'TGT English Literature',
    department: 'Humanities',
    email: 'sunita.rao@dpa.edu',
    phone: '+91 98765 43212',
    qualification: 'M.A. English, B.Ed',
    experience: '6 Years',
    subjects: ['English Literature', 'Grammar', 'Class 9 English'],
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE',
    joiningDate: '10 Jul 2020',
  },
  {
    id: '4',
    employeeId: 'TCH-004',
    name: 'Rajesh Nair',
    designation: 'Computer Science Instructor',
    department: 'Computer Science',
    email: 'rajesh.nair@dpa.edu',
    phone: '+91 98765 43213',
    qualification: 'M.Tech CSE',
    experience: '5 Years',
    subjects: ['Python Programming', 'Database Systems', 'AI Basics'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'ON_LEAVE',
    joiningDate: '12 Jan 2021',
  },
];

export const TeachersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // TanStack Query Hook
  const { data: serverTeachers = [], isLoading } = useTeachers();

  const teachers = useMemo(() => {
    return serverTeachers.length > 0 ? serverTeachers : defaultSeedTeachers;
  }, [serverTeachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchQuery =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchDept = selectedDept === 'ALL' || t.department === selectedDept;
      return matchQuery && matchDept;
    });
  }, [teachers, search, selectedDept]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>Faculty &amp; Teaching Staff</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              {teachers.length} Active Staff
            </span>
          </h1>
          <p className="text-sm text-secondary">
            Manage teaching staff profiles, subject allocations, and credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-sm shadow-card hover:bg-brand-sky-dark transition-all self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filters & Search */}
      <TeacherFilters
        search={search}
        onSearchChange={setSearch}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
      />

      {/* Teachers Grid */}
      <TeacherGrid
        teachers={filteredTeachers}
        onSelectTeacher={setSelectedTeacher}
        isLoading={isLoading}
      />

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        nextEmployeeId={`TCH-${String(teachers.length + 1).padStart(3, '0')}`}
      />

      {/* Teacher Profile Drawer */}
      <TeacherProfileDrawer
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
};

export default TeachersPage;
