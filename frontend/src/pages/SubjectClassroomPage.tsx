/**
 * @file SubjectClassroomPage.tsx
 * @description Dedicated Full-Page Classroom Portal for a student's enrolled subject.
 * Provides detailed, structured access to:
 * 1. Chapter-wise Notes & Learning Material with download & preview actions
 * 2. Active Assignments with highlighted due hours countdowns + Homework File Submission Form
 * 3. Previous / Historical Assignment Submissions with graded marks & teacher feedback
 * 4. Upcoming Tests schedule & completed assessment scorecards with class averages
 * 5. Faculty instructor contact & scheduled doubt clearing timings
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Award,
  Layers,
  ChevronRight,
  Send,
  Eye,
  FileCheck,
  Check,
  X,
  Sparkles,
  MapPin,
  Mail,
  User,
  HelpCircle,
  TrendingUp,
  FolderOpen,
  Filter,
} from 'lucide-react';
import { initialStudentSubjects, type StudentSubject, type Assignment } from '../data/studentSubjectsData';

export const SubjectClassroomPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  // Load subject data from dataset (with fallback)
  const [subjects, setSubjects] = useState<StudentSubject[]>(initialStudentSubjects);
  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const [activeTab, setActiveTab] = useState<'NOTES' | 'ASSIGNMENTS' | 'TESTS' | 'TEACHER'>('ASSIGNMENTS');
  const [assignmentFilter, setAssignmentFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');

  // Homework Submission Modal State
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [studentComments, setStudentComments] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Note preview notification
  const [previewNoteTitle, setPreviewNoteTitle] = useState<string | null>(null);

  // Handle Homework Submission
  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const updatedAssignments: Assignment[] = subject.assignments.map((a) =>
        a.id === submittingAssignment.id
          ? {
              ...a,
              status: 'SUBMITTED',
              dueCountdown: 'Submitted',
              submittedAt: 'Just now',
              submissionFileName: uploadedFileName || 'Assignment_Submission.pdf',
            }
          : a
      );

      const updatedSubject: StudentSubject = {
        ...subject,
        assignments: updatedAssignments,
      };

      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmittingAssignment(null);
        setUploadedFileName(null);
        setStudentComments('');
      }, 1800);
    }, 900);
  };

  const pendingAssignments = subject.assignments.filter((a) => a.status === 'PENDING');
  const gradedAssignments = subject.assignments.filter((a) => a.status === 'GRADED');
  const filteredAssignments =
    assignmentFilter === 'PENDING'
      ? pendingAssignments
      : assignmentFilter === 'GRADED'
      ? gradedAssignments
      : subject.assignments;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & BACK ACTION                                           */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/my-subjects')}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-brand-sky-dark hover:border-brand-sky text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to All Enrolled Subjects</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">
          Enrolled in <strong className="text-slate-700">Class 10 - Section A</strong>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBJECT HERO BANNER WITH TEACHER & SYLLABUS STATS                      */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${subject.color} 0%, #0369A1 100%)`,
        }}
      >
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white tracking-wide">
              {subject.cbseCode}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              {subject.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              {subject.weeklySessions} Periods / Week
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{subject.name} Classroom</h1>
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            {subject.description}
          </p>

          {/* Teacher Info Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border border-white/20">
              <User className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Instructor: <strong>{subject.teacher.name}</strong> ({subject.teacher.role})</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-brand-yellow" />
              <span>{subject.teacher.room}</span>
            </div>
          </div>
        </div>

        {/* Progress & Urgent Card */}
        <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
          {/* Syllabus Progress */}
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex-1">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>Term 1 Syllabus Covered</span>
              <span>{subject.syllabusProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-yellow transition-all duration-700"
                style={{ width: `${subject.syllabusProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-sky-100 block mt-2">
              {subject.chapters.length} Total Units • 4 Completed
            </span>
          </div>

          {/* Pending Homework Alert */}
          {pendingAssignments.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/25 backdrop-blur-md border border-amber-300/40 text-amber-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    {pendingAssignments.length} Assignment{pendingAssignments.length > 1 ? 's' : ''} Pending
                  </p>
                  <span className="text-[10px] text-amber-200">
                    Next deadline: {pendingAssignments[0].dueCountdown}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('ASSIGNMENTS');
                  setSubmittingAssignment(pendingAssignments[0]);
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-sm hover:bg-amber-100 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Submit Now
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 text-emerald-100 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>All Homework Caught Up!</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. STRUCTURED NAVIGATION TABS                                             */}
      {/* ========================================================================= */}
      <div className="bg-surface rounded-2xl p-2 border border-slate-100 shadow-card flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('ASSIGNMENTS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ASSIGNMENTS'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments &amp; Homework ({subject.assignments.length})</span>
          {pendingAssignments.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'ASSIGNMENTS' ? 'bg-white text-brand-sky-dark' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {pendingAssignments.length} Due
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('NOTES')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'NOTES'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapter-wise Notes ({subject.chapters.length} Chapters)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TESTS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'TESTS'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tests, Quizzes &amp; Results ({subject.tests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TEACHER')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'TEACHER'
              ? 'bg-brand-sky text-white shadow-soft'
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Teacher &amp; Doubt Sessions</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB CONTENTS                                                           */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB A: ASSIGNMENTS & HOMEWORK (STRUCTURED PREVIOUS & UPCOMING)           */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-6">
          {/* Sub-Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-slate-100 shadow-card">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Filter Status:</span>
              <button
                type="button"
                onClick={() => setAssignmentFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  assignmentFilter === 'ALL'
                    ? 'bg-brand-sky text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({subject.assignments.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentFilter('PENDING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  assignmentFilter === 'PENDING'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Pending Action ({pendingAssignments.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentFilter('GRADED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  assignmentFilter === 'GRADED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Graded &amp; Reviewed ({gradedAssignments.length})
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredAssignments.length} assignment records
            </span>
          </div>

          {/* Active / Pending Section */}
          {(assignmentFilter === 'ALL' || assignmentFilter === 'PENDING') && pendingAssignments.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Upcoming Due Assignments
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingAssignments.map((asg) => (
                  <motion.div
                    key={asg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface rounded-3xl p-6 border-2 border-amber-200 shadow-card flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {asg.chapter}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white flex items-center gap-1.5 animate-pulse shadow-sm">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{asg.dueCountdown}</span>
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-800">{asg.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Due Date:</span>
                        <strong className="text-xs text-slate-700">{asg.dueDate}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSubmittingAssignment(asg)}
                        className="px-5 py-2.5 rounded-2xl bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Submit Homework</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Previous & Graded Section */}
          {(assignmentFilter === 'ALL' || assignmentFilter === 'GRADED') && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Previous &amp; Graded Homework Archives
                </h3>
              </div>

              {gradedAssignments.length === 0 ? (
                <div className="text-center py-10 bg-surface rounded-3xl border border-slate-100 text-slate-400 text-xs">
                  No graded homework submissions in archive yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {gradedAssignments.map((asg) => (
                    <div
                      key={asg.id}
                      className="bg-surface rounded-3xl p-6 border border-emerald-100 shadow-card space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {asg.chapter}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-mint-light text-brand-mint-dark">
                              Graded &amp; Verified
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-1">{asg.title}</h4>
                        </div>

                        {asg.obtainedMarks !== undefined && (
                          <div className="text-right sm:text-right">
                            <span className="text-lg font-extrabold text-emerald-700">
                              {asg.obtainedMarks} / {asg.maxMarks} Marks
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Score: {((asg.obtainedMarks / asg.maxMarks) * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

                      {/* Teacher Feedback Box */}
                      {asg.teacherFeedback && (
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex items-start gap-3">
                          <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-emerald-900 block">
                              Teacher Feedback ({subject.teacher.name}):
                            </span>
                            <p className="text-emerald-800 text-xs mt-1 italic leading-relaxed">
                              &ldquo;{asg.teacherFeedback}&rdquo;
                            </p>
                            <span className="text-[10px] text-emerald-600 font-medium block mt-1">
                              Submitted file: {asg.submissionFileName} • {asg.submittedAt}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB B: CHAPTER-WISE NOTES & LEARNING MATERIAL                             */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'NOTES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-bold text-slate-800">Chapter-wise Syllabus Notes</h3>
              <p className="text-xs text-slate-500">
                Official CBSE curriculum handwritten mindmaps, formula cheat sheets, and NCERT exemplars.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {subject.chapters.map((ch) => (
              <div
                key={ch.id}
                className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card space-y-4"
              >
                {/* Chapter Heading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center font-extrabold text-sm shrink-0">
                      Ch {ch.chapterNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{ch.chapterName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{ch.description}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                      ch.status === 'COMPLETED'
                        ? 'bg-brand-mint-light text-brand-mint-dark'
                        : ch.status === 'IN_PROGRESS'
                        ? 'bg-brand-sky-light text-brand-sky-dark ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ch.status === 'COMPLETED'
                      ? 'Completed'
                      : ch.status === 'IN_PROGRESS'
                      ? 'Current Active Chapter'
                      : 'Upcoming'}
                  </span>
                </div>

                {/* Notes List under Chapter */}
                <div className="space-y-3 pt-1">
                  {ch.notes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes uploaded yet for this chapter.</p>
                  ) : (
                    ch.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-brand-lilac-light text-brand-lilac-dark flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">{note.title}</h5>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              {note.fileType} • {note.fileSize} • {note.pages} Pages • Uploaded {note.uploadedDate}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setPreviewNoteTitle(note.title)}
                            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-sky-dark hover:border-brand-sky text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              confetti({ particleCount: 30, spread: 50 });
                              alert(`Starting download for: ${note.title}`);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-brand-sky text-white text-xs font-bold shadow-soft hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB C: TESTS, QUIZZES & RESULTS                                          */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'TESTS' && (
        <div className="space-y-6">
          {/* Upcoming Tests Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-sky" />
              <span>Upcoming Tests &amp; Periodic Assessments</span>
            </h3>

            {subject.tests.filter((t) => t.status === 'UPCOMING').length === 0 ? (
              <div className="p-8 rounded-3xl bg-surface border border-slate-100 text-center text-xs text-slate-400">
                No upcoming tests currently scheduled for {subject.name}.
              </div>
            ) : (
              subject.tests
                .filter((t) => t.status === 'UPCOMING')
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-3xl bg-surface border-2 border-sky-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-sky-light text-brand-sky-dark uppercase">
                          {t.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">{t.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800">{t.title}</h4>
                      <p className="text-xs text-slate-600">
                        Syllabus: <strong className="text-slate-700">{t.syllabus}</strong>
                      </p>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <span className="px-4 py-2 rounded-2xl bg-slate-100 font-extrabold text-slate-800 text-sm block">
                        Max Marks: {t.totalMarks}
                      </span>
                      {t.time && <span className="text-[11px] text-slate-400 block mt-1">Time: {t.time}</span>}
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Past Completed Tests Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Past Assessment Scorecards &amp; Class Benchmarks</span>
            </h3>

            {subject.tests.filter((t) => t.status === 'COMPLETED').length === 0 ? (
              <div className="p-8 rounded-3xl bg-surface border border-slate-100 text-center text-xs text-slate-400">
                No past completed tests on record.
              </div>
            ) : (
              <div className="space-y-4">
                {subject.tests
                  .filter((t) => t.status === 'COMPLETED')
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-6 rounded-3xl bg-surface border border-slate-100 shadow-card space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                              {t.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400">{t.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mt-1">{t.title}</h4>
                          <span className="text-xs text-slate-500">Syllabus: {t.syllabus}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-xl font-extrabold text-emerald-700 block">
                              {t.obtainedMarks} / {t.totalMarks} Marks
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {((t.obtainedMarks! / t.totalMarks) * 100).toFixed(1)}% Score
                            </span>
                          </div>
                          {t.grade && (
                            <div className="w-12 h-12 rounded-2xl bg-brand-mint-light text-brand-mint-dark font-extrabold text-lg flex items-center justify-center shrink-0">
                              {t.grade}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Class Benchmark Comparison */}
                      {t.classAverage && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-slate-600">
                            <TrendingUp className="w-4 h-4 text-brand-sky" />
                            <span>Section A Class Average: <strong>{t.classAverage} Marks</strong></span>
                          </div>
                          <span className="font-bold text-emerald-700">
                            +{(t.obtainedMarks! - t.classAverage).toFixed(1)} marks above average
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB D: TEACHER & DOUBT SESSIONS                                           */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'TEACHER' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-8 border border-slate-100 shadow-card space-y-6 max-w-3xl">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-3xl bg-brand-sky text-white flex items-center justify-center text-2xl font-extrabold shadow-soft shrink-0">
                {subject.teacher.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800">{subject.teacher.name}</h3>
                <p className="text-xs font-semibold text-brand-sky-dark">{subject.teacher.role}</p>
                <p className="text-xs text-slate-500">Delhi Public Academy Faculty Department</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-sky" />
                  <span>Official Email:</span>
                </span>
                <p className="font-bold text-slate-800">{subject.teacher.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-sky" />
                  <span>Cabin / Laboratory:</span>
                </span>
                <p className="font-bold text-slate-800">{subject.teacher.room}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 sm:col-span-2 space-y-1">
                <span className="text-amber-800 font-bold block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Weekly Doubt Clearing Consultation:</span>
                </span>
                <p className="font-extrabold text-slate-800">{subject.teacher.doubtHours}</p>
                <p className="text-[11px] text-slate-500">
                  Students may bring solved notebook exercises and NCERT questions for 1-on-1 discussion during these hours.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => alert(`Opening teacher message draft to ${subject.teacher.email}...`)}
                className="px-6 py-2.5 rounded-full bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Message Faculty Member</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOMEWORK SUBMISSION MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {submittingAssignment && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {submittingAssignment.chapter}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800">{submittingAssignment.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-brand-mint-light text-brand-mint-dark flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">Homework Submitted Successfully!</h4>
                  <p className="text-xs text-slate-500">
                    Your file has been delivered to <strong>{subject.teacher.name}</strong> for evaluation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitHomework} className="space-y-4 text-xs">
                  {/* File Upload Box */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      Upload Notebook Scans / Assignment PDF
                    </label>
                    <div
                      onClick={() => setUploadedFileName('Rahul_Sharma_Solutions_Ex4.2.pdf')}
                      className="border-2 border-dashed border-slate-200 hover:border-brand-sky p-6 rounded-2xl text-center cursor-pointer transition-all bg-slate-50 hover:bg-sky-50/20"
                    >
                      <Upload className="w-8 h-8 text-brand-sky mx-auto mb-2" />
                      {uploadedFileName ? (
                        <div className="flex items-center justify-center gap-2 text-brand-sky-dark font-bold">
                          <Check className="w-4 h-4 text-brand-mint-dark" />
                          <span>{uploadedFileName} (Ready to submit)</span>
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-slate-700">Click to upload scanned document (PDF, PNG, JPG)</p>
                          <span className="text-[10px] text-slate-400">Maximum allowed file size: 10 MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Student Remarks / Note to Teacher */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">Note to Teacher (Optional)</label>
                    <textarea
                      rows={3}
                      value={studentComments}
                      onChange={(e) => setStudentComments(e.target.value)}
                      placeholder="e.g. Sir, I solved questions 1 through 10 as assigned. Had a slight doubt on question 8 regarding negative discriminant values."
                      className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSubmittingAssignment(null)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send to Teacher</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. NOTE PREVIEW MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewNoteTitle && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Preview</span>
                    <h3 className="text-sm font-bold text-slate-800">{previewNoteTitle}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewNoteTitle(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-600 font-medium">
                  Document viewer initialized. Ready to download full high-resolution PDF for offline study.
                </p>
                <span className="text-[11px] text-slate-400 block">Verified by Delhi Public Academy Faculty</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewNoteTitle(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    confetti({ particleCount: 30, spread: 50 });
                    alert(`Downloading ${previewNoteTitle}...`);
                    setPreviewNoteTitle(null);
                  }}
                  className="px-6 py-2.5 rounded-full bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
