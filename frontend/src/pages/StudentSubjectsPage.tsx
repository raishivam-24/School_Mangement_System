/**
 * @file StudentSubjectsPage.tsx
 * @description Dedicated Student Course & Subject Classroom Portal.
 * Displays all enrolled personal subjects for the student. Clicking any subject card
 * navigates directly to its dedicated full-page classroom (/my-subjects/:subjectId).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  Sparkles,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  User,
  MapPin,
} from 'lucide-react';
import { initialStudentSubjects, type StudentSubject } from '../data/studentSubjectsData';

export const StudentSubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [subjects] = useState<StudentSubject[]>(initialStudentSubjects);

  // Total pending assignments across all subjects
  const totalPendingAssignments = subjects.reduce(
    (acc, sub) => acc + sub.assignments.filter((a) => a.status === 'PENDING').length,
    0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & METRICS                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>My Enrolled Subjects</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
              Class 10 - Section A
            </span>
          </h1>
          <p className="text-xs text-secondary mt-1">
            Access chapter notes, submit homework assignments, and review past test scorecards for each enrolled course.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{totalPendingAssignments} Homework Deadlines Pending</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUMMARY STATS CHIPS                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Courses Enrolled</span>
            <h4 className="text-2xl font-extrabold text-primary mt-1">{subjects.length} Subjects</h4>
            <span className="text-[11px] text-secondary">CBSE Curriculum</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Assignments Pending</span>
            <h4 className="text-2xl font-extrabold text-accent-amber mt-1">{totalPendingAssignments} Active</h4>
            <span className="text-[11px] text-secondary">1 Due in 18 Hours</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-amber/15 text-accent-amber flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Term 1 Syllabus</span>
            <h4 className="text-2xl font-extrabold text-accent-green mt-1">75.3% Avg</h4>
            <span className="text-[11px] text-secondary">On Track for Exams</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-green-subtle text-accent-green flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Weekly Lectures</span>
            <h4 className="text-2xl font-extrabold text-accent-violet mt-1">28 Periods</h4>
            <span className="text-[11px] text-secondary">Mon – Sat Schedule</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent-violet-subtle text-accent-violet flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ENROLLED SUBJECT CARDS GRID                                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => {
          const pendingCount = sub.assignments.filter((a) => a.status === 'PENDING').length;
          const urgentAssignment = sub.assignments.find((a) => a.isUrgent && a.status === 'PENDING');

          return (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/my-subjects/${sub.id}`)}
              className="bg-surface rounded-3xl p-6 border border-border shadow-card hover:shadow-card transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Top Accent Gradient Border */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: sub.color }}
              ></div>

              <div>
                {/* Header with Subject Badge & Pending Count */}
                <div className="flex items-start justify-between mb-4 pt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.gradient} flex items-center justify-center text-white shadow-md`}
                    >
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary group-hover:text-accent-blue transition-colors">
                        {sub.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[11px] text-muted font-semibold">{sub.code}</span>
                        <span className="text-[10px] text-muted">•</span>
                        <span className="text-[10px] font-bold text-muted">{sub.cbseCode}</span>
                      </div>
                    </div>
                  </div>

                  {pendingCount > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-accent-amber/20 text-accent-amber border border-accent-amber/30 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent-amber" />
                      <span>{pendingCount} Due</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                      All Clear
                    </span>
                  )}
                </div>

                {/* Urgent Homework Callout if applicable */}
                {urgentAssignment && (
                  <div className="mb-3 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-accent-amber shrink-0" />
                      <span className="font-bold truncate">{urgentAssignment.dueCountdown}:</span>
                      <span className="truncate">{urgentAssignment.title}</span>
                    </div>
                  </div>
                )}

                {/* Teacher & Room Specs */}
                <div className="py-3 border-y border-border space-y-1.5 text-xs text-secondary">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Faculty In-charge:</span>
                    <span className="font-bold text-primary">{sub.teacher.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Classroom / Lab:</span>
                    <span className="font-medium text-secondary">{sub.teacher.room}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Weekly Lectures:</span>
                    <span className="font-semibold text-secondary">{sub.weeklySessions} Periods</span>
                  </div>
                </div>

                {/* Syllabus Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted text-[11px] uppercase tracking-wider">Term 1 Syllabus</span>
                    <span className="text-secondary">{sub.syllabusProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-raised overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.syllabusProgress}%`, backgroundColor: sub.color }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Enter Classroom Button */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted font-medium">
                  {sub.chapters.length} Units • {sub.assignments.length} Tasks
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/my-subjects/${sub.id}`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-surface-raised hover:bg-accent-blue hover:text-white text-primary font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm border border-border"
                >
                  <span>Enter Classroom</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
