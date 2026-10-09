/**
 * @file TeacherClassAttendanceView.tsx
 * @description Teacher and Admin Attendance Engine: Class/Section selection,
 * roll call execution via DailyRollCallSheet, and institutional MonthlyDotMatrix view.
 */

import React, { useState, useEffect } from 'react';
import { Calendar, UserCheck, CalendarCheck, Search, Check } from 'lucide-react';
import { useAcademicStore } from '../../../store/useAcademicStore';
import { useClasses, useAcademicYears, useAttendanceSheet } from '../../../hooks';
import { DailyRollCallSheet } from './DailyRollCallSheet';
import { MonthlyDotMatrix } from './MonthlyDotMatrix';
import type { StudentRosterItem } from '../../../types';

const defaultStudents: StudentRosterItem[] = [
  { id: '1', name: 'Rahul Sharma', rollNo: '1', admissionNo: 'DPA-2024-001', gender: 'MALE', status: 'PRESENT' },
  { id: '2', name: 'Aarav Patel', rollNo: '2', admissionNo: 'DPA-2024-002', gender: 'MALE', status: 'PRESENT' },
  { id: '3', name: 'Ananya Iyer', rollNo: '3', admissionNo: 'DPA-2024-003', gender: 'FEMALE', status: 'PRESENT' },
  { id: '4', name: 'Devansh Verma', rollNo: '4', admissionNo: 'DPA-2024-004', gender: 'MALE', status: 'ABSENT', reason: 'High fever (Parent informed)' },
  { id: '5', name: 'Diya Deshmukh', rollNo: '5', admissionNo: 'DPA-2024-005', gender: 'FEMALE', status: 'PRESENT' },
  { id: '6', name: 'Ishaan Gupta', rollNo: '6', admissionNo: 'DPA-2024-006', gender: 'MALE', status: 'PRESENT' },
  { id: '7', name: 'Kavya Nair', rollNo: '7', admissionNo: 'DPA-2024-007', gender: 'FEMALE', status: 'LATE', reason: 'School bus route delay' },
  { id: '8', name: 'Manav Joshi', rollNo: '8', admissionNo: 'DPA-2024-008', gender: 'MALE', status: 'PRESENT' },
  { id: '9', name: 'Neha Reddy', rollNo: '9', admissionNo: 'DPA-2024-009', gender: 'FEMALE', status: 'PRESENT' },
  { id: '10', name: 'Pranav Saxena', rollNo: '10', admissionNo: 'DPA-2024-010', gender: 'MALE', status: 'PRESENT' },
  { id: '11', name: 'Riya Sen', rollNo: '11', admissionNo: 'DPA-2024-011', gender: 'FEMALE', status: 'ABSENT', reason: 'Family function' },
  { id: '12', name: 'Siddharth Roy', rollNo: '12', admissionNo: 'DPA-2024-012', gender: 'MALE', status: 'PRESENT' },
];

export const TeacherClassAttendanceView: React.FC = () => {
  const { selectedDate, setSelectedDate } = useAcademicStore();

  const [activeTab, setActiveTab] = useState<'ROLL_CALL' | 'DOT_MATRIX'>('ROLL_CALL');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roster, setRoster] = useState<StudentRosterItem[]>(defaultStudents);

  const { data: classes = [] } = useClasses();
  const { data: academicYears = [] } = useAcademicYears();
  const currentAcademicYear = academicYears.find((y) => y.isCurrent) || academicYears[0];
  const academicYearId = currentAcademicYear?.id || '';

  // Initialize selected class & section
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
      if (classes[0].sections && classes[0].sections.length > 0) {
        setSelectedSectionId(classes[0].sections[0].id);
      }
    }
  }, [classes, selectedClassId]);

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const activeSections = activeClass?.sections || [];

  // Query live attendance sheet
  const { data: attendanceSheetData } = useAttendanceSheet(
    selectedDate,
    selectedClassId,
    selectedSectionId
  );

  // Sync sheet roster when backend returns data
  useEffect(() => {
    if (attendanceSheetData?.roster && attendanceSheetData.roster.length > 0) {
      setRoster(
        attendanceSheetData.roster.map((r) => ({
          id: r.studentId,
          name: r.name,
          rollNo: String(r.rollNumber || ''),
          admissionNo: r.admissionNo,
          gender: 'MALE',
          status: r.status,
          reason: r.reason || '',
        }))
      );
    }
  }, [attendanceSheetData]);

  // Summary counts
  const totalCount = roster.length;
  const presentCount = roster.filter((r) => r.status === 'PRESENT').length;
  const absentCount = roster.filter((r) => r.status === 'ABSENT').length;
  const lateCount = roster.filter((r) => r.status === 'LATE').length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  const filteredRoster = roster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>Class Attendance Engine</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              CBSE &gt;75% Norm
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Conduct daily morning roll calls or review institutional dot matrix attendance patterns.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-card">
          <button
            type="button"
            onClick={() => setActiveTab('ROLL_CALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ROLL_CALL'
                ? 'bg-accent-blue text-white shadow-card'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Daily Roll Call Sheet</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DOT_MATRIX')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'DOT_MATRIX'
                ? 'bg-accent-blue text-white shadow-card'
                : 'text-secondary hover:text-primary'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Monthly Dot Matrix</span>
          </button>
        </div>
      </div>

      {/* Filters & Live Counters */}
      <div className="bg-surface p-5 rounded-3xl border border-border shadow-card flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary">
            <Calendar className="w-4 h-4 text-accent-blue" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => {
              const newClassId = e.target.value;
              setSelectedClassId(newClassId);
              const cls = classes.find((c) => c.id === newClassId);
              if (cls?.sections && cls.sections.length > 0) {
                setSelectedSectionId(cls.sections[0].id);
              }
            }}
            className="px-4 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary focus:outline-none cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary focus:outline-none cursor-pointer"
          >
            {activeSections.map((s) => (
              <option key={s.id} value={s.id}>
                Section {s.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Roll No or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-surface-raised text-secondary font-bold text-xs">
            Total: {totalCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-green-subtle text-accent-green font-bold text-xs flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Present: {presentCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-rose-subtle text-accent-rose font-bold text-xs">
            Absent: {absentCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-amber-subtle text-accent-amber font-bold text-xs">
            Late: {lateCount}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-accent-blue-subtle text-accent-blue font-bold text-xs">
            {attendanceRate}% Present
          </span>
        </div>
      </div>

      {/* Render Current View */}
      {activeTab === 'ROLL_CALL' ? (
        <DailyRollCallSheet
          roster={filteredRoster}
          setRoster={setRoster}
          selectedDate={selectedDate}
          classId={selectedClassId}
          sectionId={selectedSectionId}
          academicYearId={academicYearId}
        />
      ) : (
        <MonthlyDotMatrix roster={roster} />
      )}
    </div>
  );
};
