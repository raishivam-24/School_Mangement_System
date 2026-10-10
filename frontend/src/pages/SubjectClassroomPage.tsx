/**
 * @file SubjectClassroomPage.tsx
 * @description Dedicated Full-Page Classroom Portal for a student's enrolled subject.
 * Built with professional educational UX:
 * 1. Chapter-wise Notes: Collapsible chapter accordions (defaults to active chapter),
 *    quick chapter dropdown selector, search filter, and Expand/Collapse All controls.
 * 2. Assignments & Homework: Focused active assignments up top, with a collapsible
 *    Previous Submissions & Graded Archive accordion so historical work doesn't flood the screen.
 * 3. Tests & Results: Upcoming assessments with collapsible past scorecards & benchmarks.
 * 4. Faculty Contact: Teacher details & scheduled doubt clearing consultation.
 */

import React, { useState, useRef } from 'react';
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
  ChevronDown,
  ChevronUp,
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
  FolderCheck,
  Filter,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Trash2,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { initialStudentSubjects, type StudentSubject, type Assignment, type Chapter } from '../data/studentSubjectsData';
import { uploadService } from '../services/upload.service';

export const SubjectClassroomPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  // Load subject data from dataset (with fallback)
  const [subjects, setSubjects] = useState<StudentSubject[]>(initialStudentSubjects);
  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];

  const [activeTab, setActiveTab] = useState<'NOTES' | 'ASSIGNMENTS' | 'TESTS' | 'TEACHER'>('ASSIGNMENTS');

  // =========================================================================
  // UX CONTROLS: CHAPTER-WISE NOTES
  // =========================================================================
  // Accordion state: by default, only the active IN_PROGRESS chapter is expanded
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    subject.chapters.forEach((ch) => {
      initial[ch.id] = ch.status === 'IN_PROGRESS';
    });
    return initial;
  });

  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('ALL');
  const [notesTypeFilter, setNotesTypeFilter] = useState<string>('ALL');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleToggleAllChapters = (expand: boolean) => {
    const updated: Record<string, boolean> = {};
    subject.chapters.forEach((ch) => {
      updated[ch.id] = expand;
    });
    setExpandedChapters(updated);
  };

  // Filtered chapters for notes tab
  const displayedChapters = subject.chapters
    .filter((ch) => {
      if (selectedChapterFilter !== 'ALL' && ch.id !== selectedChapterFilter) {
        return false;
      }
      return true;
    })
    .map((ch) => {
      // Filter notes within this chapter by search and resource type
      const filteredNotes = ch.notes.filter((n) => {
        const matchesType =
          notesTypeFilter === 'ALL' ||
          n.fileType.toLowerCase().includes(notesTypeFilter.toLowerCase()) ||
          n.title.toLowerCase().includes(notesTypeFilter.toLowerCase());

        if (!matchesType) return false;

        if (notesSearchQuery.trim()) {
          const q = notesSearchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.fileType.toLowerCase().includes(q) ||
            ch.chapterName.toLowerCase().includes(q)
          );
        }
        return true;
      });

      return {
        ...ch,
        filteredNotes,
      };
    })
    .filter((ch) => {
      if (notesSearchQuery.trim() && ch.filteredNotes.length === 0) {
        return ch.chapterName.toLowerCase().includes(notesSearchQuery.toLowerCase());
      }
      if (notesTypeFilter !== 'ALL' && ch.filteredNotes.length === 0) {
        return false;
      }
      return true;
    });

  // =========================================================================
  // UX CONTROLS: ASSIGNMENTS & HOMEWORK ARCHIVE
  // =========================================================================
  const [assignmentFilter, setAssignmentFilter] = useState<'ALL' | 'PENDING' | 'GRADED'>('ALL');
  // Collapsible past homework archive (keeps screen clean & focused on what's due now)
  const [isPastAssignmentsOpen, setIsPastAssignmentsOpen] = useState(false);
  const [pastAssignmentChapterFilter, setPastAssignmentChapterFilter] = useState('ALL');
  const [expandedFeedbackIds, setExpandedFeedbackIds] = useState<Record<string, boolean>>({});

  const toggleFeedback = (asgId: string) => {
    setExpandedFeedbackIds((prev) => ({
      ...prev,
      [asgId]: !prev[asgId],
    }));
  };

  const pendingAssignments = subject.assignments.filter((a) => a.status === 'PENDING');
  const gradedAssignments = subject.assignments.filter((a) => a.status === 'GRADED');

  const filteredGradedAssignments =
    pastAssignmentChapterFilter === 'ALL'
      ? gradedAssignments
      : gradedAssignments.filter((a) => a.chapter.toLowerCase().includes(pastAssignmentChapterFilter.toLowerCase()));

  // =========================================================================
  // UX CONTROLS: TESTS & BENCHMARKS
  // =========================================================================
  // Collapsed by default so historical tests don't flood the initial viewport
  const [isPastTestsOpen, setIsPastTestsOpen] = useState(false);
  const [selectedTestTypeFilter, setSelectedTestTypeFilter] = useState<string>('ALL');
  const upcomingTests = subject.tests.filter((t) => t.status === 'UPCOMING');
  const completedTests = subject.tests.filter((t) => t.status === 'COMPLETED');
  const filteredCompletedTests =
    selectedTestTypeFilter === 'ALL'
      ? completedTests
      : completedTests.filter((t) => t.type === selectedTestTypeFilter);

  // =========================================================================
  // HOMEWORK SUBMISSION MODAL STATE
  // =========================================================================
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [studentComments, setStudentComments] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const homeworkFileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Note preview notification modal
  const [previewNoteTitle, setPreviewNoteTitle] = useState<string | null>(null);

  // Real Cloudflare R2 Homework File Upload Handler
  const handleHomeworkFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    setUploadFileError(null);
    try {
      const res = await uploadService.uploadFile(file, 'homework');
      setUploadedFileUrl(res.url);
      setUploadedFileName(res.originalName);
      setUploadedFileSize(res.size);
    } catch (err: any) {
      console.error('Homework upload failed:', err);
      setUploadFileError(err?.response?.data?.message || 'Failed to stream file to Cloudflare R2 storage.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveUploadedFile = async () => {
    if (uploadedFileUrl) {
      await uploadService.deleteFile(uploadedFileUrl).catch(() => null);
    }
    setUploadedFileUrl(null);
    setUploadedFileName(null);
    setUploadedFileSize(null);
    if (homeworkFileInputRef.current) homeworkFileInputRef.current.value = '';
  };

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
              submissionFileName: uploadedFileName || 'Assignment_Solution.pdf',
              submissionUrl: uploadedFileUrl || undefined,
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
        setUploadedFileUrl(null);
        setUploadedFileSize(null);
        setStudentComments('');
      }, 1800);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & BACK ACTION                                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/my-subjects')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-border text-secondary hover:text-accent-blue hover:border-accent-blue text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-muted group-hover:-translate-x-0.5 transition-transform" />
            <span>All Subjects</span>
          </button>

          {/* Quick Subject Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted hidden sm:inline">Switch Subject:</span>
            <select
              value={subject.id}
              onChange={(e) => navigate(`/my-subjects/${e.target.value}`)}
              className="px-3 py-1.5 rounded-2xl bg-surface border border-border text-xs font-bold text-secondary shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-semibold text-muted">
          Enrolled in <strong className="text-secondary">Class 10 - Section A</strong>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBJECT HERO BANNER WITH TEACHER & SYLLABUS STATS                      */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${subject.color} 0%, #0369A1 100%)`,
        }}
      >
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-bold text-white tracking-wide">
              {subject.cbseCode}
            </span>
            <span className="px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-white">
              {subject.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-white">
              {subject.weeklySessions} Periods / Week
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{subject.name} Classroom</h1>
          <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
            {subject.description}
          </p>

          {/* Teacher Info Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-surface/15 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border border-white/20">
              <User className="w-3.5 h-3.5 text-accent-amber" />
              <span>Instructor: <strong>{subject.teacher.name}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-surface/15 px-3.5 py-1.5 rounded-2xl backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-accent-amber" />
              <span>{subject.teacher.room}</span>
            </div>
          </div>
        </div>

        {/* Progress & Quick Action Pill */}
        <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
          {/* Syllabus Progress */}
          <div className="p-4 rounded-2xl bg-surface/15 backdrop-blur-md border border-white/25 flex-1">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>Term 1 Syllabus Progress</span>
              <span>{subject.syllabusProgress}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-surface/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-amber transition-all duration-700"
                style={{ width: `${subject.syllabusProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-sky-100 block mt-2">
              {subject.chapters.length} Syllabus Units • Currently in Unit 4
            </span>
          </div>

          {/* Pending Homework Quick Action */}
          {pendingAssignments.length > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/25 backdrop-blur-md border border-amber-300/40 text-amber-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-300 animate-pulse shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    {pendingAssignments.length} Assignment{pendingAssignments.length > 1 ? 's' : ''} Pending
                  </p>
                  <span className="text-[10px] text-amber-200">
                    Next: {pendingAssignments[0].dueCountdown}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('ASSIGNMENTS');
                  setSubmittingAssignment(pendingAssignments[0]);
                }}
                className="px-3 py-1.5 rounded-xl bg-surface text-primary text-xs font-bold shadow-sm hover:bg-amber-100 transition-all cursor-pointer whitespace-nowrap active:scale-95"
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
      <div className="bg-surface rounded-2xl p-2 border border-border shadow-card flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('ASSIGNMENTS')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ASSIGNMENTS'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Assignments &amp; Homework</span>
          {pendingAssignments.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'ASSIGNMENTS' ? 'bg-surface text-accent-blue' : 'bg-amber-100 text-amber-900'
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
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
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
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tests &amp; Results ({subject.tests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TEACHER')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'TEACHER'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Teacher &amp; Doubt Sessions</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB CONTENTS WITH INTUITIVE COLLAPSIBLES & DROPDOWNS                   */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB A: ASSIGNMENTS & HOMEWORK (UNCLUTTERED UX)                            */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-6">
          {/* Segmented Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border shadow-card">
            <div className="bg-surface-raised p-1 rounded-xl flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setAssignmentFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  assignmentFilter === 'ALL'
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                All Tasks ({subject.assignments.length})
              </button>
              <button
                type="button"
                onClick={() => setAssignmentFilter('PENDING')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  assignmentFilter === 'PENDING'
                    ? 'bg-surface text-amber-700 shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <span>Pending Deadlines</span>
                {pendingAssignments.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
                    {pendingAssignments.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAssignmentFilter('GRADED');
                  setIsPastAssignmentsOpen(true);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  assignmentFilter === 'GRADED'
                    ? 'bg-surface text-emerald-700 shadow-sm'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <span>Graded Archive</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent-green-subtle text-accent-green font-extrabold">
                  {gradedAssignments.length}
                </span>
              </button>
            </div>

            <span className="text-xs text-muted">
              {assignmentFilter === 'PENDING'
                ? 'Showing only homework requiring submission'
                : assignmentFilter === 'GRADED'
                ? 'Showing verified submissions & scores'
                : 'Prioritized view with collapsible archive'}
            </span>
          </div>

          {/* Active / Pending Section (Shown when filter is ALL or PENDING) */}
          {assignmentFilter !== 'GRADED' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
                    Active &amp; Pending Homework ({pendingAssignments.length})
                  </h3>
                </div>
                <span className="text-xs text-muted">Deadlines requiring submission</span>
              </div>

              {pendingAssignments.length === 0 ? (
                <div className="p-8 rounded-3xl bg-surface border border-border text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-primary">No Pending Homework</h4>
                  <p className="text-xs text-muted">
                    You are all caught up on assignments for {subject.name}!
                  </p>
                </div>
              ) : (
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

                        <h4 className="text-base font-bold text-primary">{asg.title}</h4>
                        <p className="text-xs text-secondary leading-relaxed">{asg.description}</p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted block">Due Date:</span>
                          <strong className="text-xs text-secondary">{asg.dueDate}</strong>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSubmittingAssignment(asg)}
                          className="px-5 py-2.5 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Submit Homework</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collapsible Historical & Graded Homework Archive (Shown when filter is ALL or GRADED) */}
          {assignmentFilter !== 'PENDING' && (
            <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
              {/* Clickable Accordion Header */}
              <button
                type="button"
                onClick={() => setIsPastAssignmentsOpen(!isPastAssignmentsOpen)}
                className="w-full p-5 flex items-center justify-between bg-surface-raised/70 hover:bg-surface-raised/60 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent-green-subtle text-accent-green flex items-center justify-center shrink-0">
                    <FolderCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-primary">
                        Previous &amp; Graded Submissions Archive
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                        {gradedAssignments.length} Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Click to {isPastAssignmentsOpen ? 'collapse' : 'view'} past homework copies, scores, and teacher remarks
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                  <span className="hidden sm:inline">
                    {isPastAssignmentsOpen ? 'Hide Past Work' : 'View Past Work'}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm">
                    {isPastAssignmentsOpen ? (
                      <ChevronUp className="w-4 h-4 text-secondary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-secondary" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expandable Content Area */}
              <AnimatePresence>
                {isPastAssignmentsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 border-t border-border space-y-4 overflow-hidden"
                  >
                    {/* Chapter Filter Dropdown for Past Assignments */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted" />
                        <span className="text-xs font-bold text-secondary">Filter by Chapter:</span>
                        <select
                          value={pastAssignmentChapterFilter}
                          onChange={(e) => setPastAssignmentChapterFilter(e.target.value)}
                          className="p-2 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-secondary cursor-pointer focus:outline-none"
                        >
                          <option value="ALL">All Past Chapters</option>
                          <option value="Chapter 1">Chapter 1: Real Numbers</option>
                          <option value="Chapter 3">Chapter 3: Linear Equations</option>
                          <option value="Chapter 4">Chapter 4: Quadratic Equations</option>
                        </select>
                      </div>

                      <span className="text-xs text-muted">
                        Showing {filteredGradedAssignments.length} past record{filteredGradedAssignments.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {filteredGradedAssignments.length === 0 ? (
                      <div className="text-center py-8 text-muted text-xs">
                        No matching graded assignments found for selected filter.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredGradedAssignments.map((asg) => {
                          const isFeedbackOpen = expandedFeedbackIds[asg.id] ?? false;

                          return (
                            <div
                              key={asg.id}
                              className="p-4 rounded-2xl bg-surface-raised/80 border border-border space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                      {asg.chapter}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                                      Graded
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-primary mt-0.5">{asg.title}</h4>
                                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                    <span className="text-[11px] text-muted">
                                      Submitted file: <strong className="text-secondary">{asg.submissionFileName}</strong> • {asg.submittedAt}
                                    </span>
                                    {asg.submissionUrl && (
                                      <a
                                        href={uploadService.getFileUrl(asg.submissionUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-[10px] font-bold hover:bg-orange-500/20 transition-all ml-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>View Copy in R2</span>
                                      </a>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {asg.obtainedMarks !== undefined && (
                                    <div className="text-right">
                                      <span className="text-base font-extrabold text-emerald-700 block">
                                        {asg.obtainedMarks} / {asg.maxMarks} Marks
                                      </span>
                                      <span className="text-[10px] text-muted">
                                        Score: {((asg.obtainedMarks / asg.maxMarks) * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => toggleFeedback(asg.id)}
                                    className="px-3 py-1.5 rounded-xl bg-surface border border-border text-secondary hover:text-accent-blue text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                                  >
                                    <span>{isFeedbackOpen ? 'Hide' : 'View'} Remarks</span>
                                    {isFeedbackOpen ? (
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Collapsible Teacher Feedback Box */}
                              <AnimatePresence>
                                {isFeedbackOpen && asg.teacherFeedback && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-start gap-2.5 overflow-hidden"
                                  >
                                    <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-extrabold text-emerald-900 block text-[11px]">
                                        Teacher Feedback ({subject.teacher.name}):
                                      </span>
                                      <p className="text-emerald-800 text-xs mt-0.5 italic leading-relaxed">
                                        &ldquo;{asg.teacherFeedback}&rdquo;
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB B: CHAPTER-WISE NOTES (ACCORDION & DROPDOWN UX)                       */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'NOTES' && (
        <div className="space-y-5">
          {/* Controls Bar: Search, Chapter Dropdown & Expand All */}
          <div className="bg-surface rounded-3xl p-4 sm:p-5 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={notesSearchQuery}
                onChange={(e) => setNotesSearchQuery(e.target.value)}
                placeholder="Search notes by title or keywords (e.g. Formula, Mindmap)..."
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
              />
            </div>

            {/* Chapter Selector Dropdown, Resource Format Filter & Expand Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary whitespace-nowrap">Chapter:</span>
                <select
                  value={selectedChapterFilter}
                  onChange={(e) => setSelectedChapterFilter(e.target.value)}
                  className="p-2 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-secondary cursor-pointer focus:outline-none"
                >
                  <option value="ALL">All Chapters ({subject.chapters.length})</option>
                  {subject.chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.chapterName} ({ch.status === 'IN_PROGRESS' ? 'Active' : ch.status.toLowerCase()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Format Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary whitespace-nowrap">Format:</span>
                <select
                  value={notesTypeFilter}
                  onChange={(e) => setNotesTypeFilter(e.target.value)}
                  className="p-2 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-secondary cursor-pointer focus:outline-none"
                >
                  <option value="ALL">All Formats</option>
                  <option value="Mindmap">Mindmaps</option>
                  <option value="Formula">Formula Sheets</option>
                  <option value="Question Bank">Question Banks / PYQs</option>
                  <option value="Handwritten">Handwritten Notes</option>
                </select>
              </div>

              <div className="flex items-center gap-1 border-l border-border pl-2">
                <button
                  type="button"
                  onClick={() => handleToggleAllChapters(true)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-secondary hover:text-primary hover:bg-surface-raised transition-all cursor-pointer"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAllChapters(false)}
                  className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-secondary hover:text-primary hover:bg-surface-raised transition-all cursor-pointer"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>

          {/* Chapter Accordions List */}
          <div className="space-y-4">
            {displayedChapters.length === 0 ? (
              <div className="p-10 rounded-3xl bg-surface border border-border text-center text-muted text-xs">
                No chapters or notes matched your search query.
              </div>
            ) : (
              displayedChapters.map((ch) => {
                const isOpen = expandedChapters[ch.id] ?? false;

                return (
                  <div
                    key={ch.id}
                    className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden transition-all"
                  >
                    {/* Clickable Chapter Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleChapter(ch.id)}
                      className={`w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                        ch.status === 'IN_PROGRESS'
                          ? 'bg-sky-50/50 hover:bg-sky-50'
                          : 'bg-surface-raised/60 hover:bg-surface-raised/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                            ch.status === 'IN_PROGRESS'
                              ? 'bg-accent-blue text-white shadow-glow-sky'
                              : 'bg-slate-200 text-secondary'
                          }`}
                        >
                          Ch {ch.chapterNumber}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-primary">{ch.chapterName}</h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                ch.status === 'COMPLETED'
                                  ? 'bg-accent-green-subtle text-accent-green'
                                  : ch.status === 'IN_PROGRESS'
                                  ? 'bg-accent-blue-subtle text-accent-blue ring-1 ring-sky-300'
                                  : 'bg-slate-200 text-secondary'
                              }`}
                            >
                              {ch.status === 'COMPLETED'
                                ? 'Completed'
                                : ch.status === 'IN_PROGRESS'
                                ? 'Current Active Chapter'
                                : 'Upcoming'}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-0.5 line-clamp-1">{ch.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span className="text-xs text-secondary font-semibold">
                          {ch.filteredNotes.length} Note{ch.filteredNotes.length !== 1 ? 's' : ''}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-secondary" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-secondary" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable Notes Content Area */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-5 border-t border-border space-y-3 bg-surface"
                        >
                          {ch.filteredNotes.length === 0 ? (
                            <p className="text-xs text-muted italic">No notes matching the selected filter in this unit.</p>
                          ) : (
                            ch.filteredNotes.map((note) => (
                              <div
                                key={note.id}
                                className="p-4 rounded-2xl bg-surface-raised/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-raised/60 transition-all"
                              >
                                <div className="flex items-center gap-3.5">
                                  <div className="w-10 h-10 rounded-xl bg-accent-violet-subtle text-accent-violet flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-primary">{note.title}</h5>
                                    <span className="text-[11px] text-muted mt-0.5 block">
                                      {note.fileType} • {note.fileSize} • {note.pages} Pages • Uploaded {note.uploadedDate}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewNoteTitle(note.title)}
                                    className="px-3.5 py-1.5 rounded-xl bg-surface border border-border text-secondary hover:text-accent-blue hover:border-accent-blue text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1 active:scale-95"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-secondary" />
                                    <span>Preview</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      confetti({ particleCount: 30, spread: 50 });
                                      alert(`Starting download for: ${note.title}`);
                                    }}
                                    className="px-4 py-1.5 rounded-xl bg-accent-blue text-white text-xs font-bold shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download PDF</span>
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB C: TESTS, QUIZZES & BENCHMARKS                                        */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'TESTS' && (
        <div className="space-y-6">
          {/* Upcoming Tests Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2 px-1">
              <Calendar className="w-4 h-4 text-accent-blue" />
              <span>Upcoming Scheduled Assessments ({upcomingTests.length})</span>
            </h3>

            {upcomingTests.length === 0 ? (
              <div className="p-8 rounded-3xl bg-surface border border-border text-center text-xs text-muted">
                No upcoming tests currently scheduled for {subject.name}.
              </div>
            ) : (
              upcomingTests.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-3xl bg-surface border-2 border-sky-100 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-accent-blue-subtle text-accent-blue uppercase">
                        {t.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-muted">{t.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-primary">{t.title}</h4>
                    <p className="text-xs text-secondary">
                      Syllabus: <strong className="text-secondary">{t.syllabus}</strong>
                    </p>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <span className="px-4 py-2 rounded-2xl bg-surface-raised font-extrabold text-primary text-sm block">
                      Max Marks: {t.totalMarks}
                    </span>
                    {t.time && <span className="text-[11px] text-muted block mt-1">Time: {t.time}</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Collapsible Past Assessment Scorecards */}
          <div className="bg-surface rounded-3xl border border-border shadow-card overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPastTestsOpen(!isPastTestsOpen)}
              className="w-full p-5 flex items-center justify-between bg-surface-raised/70 hover:bg-surface-raised/60 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-primary">
                      Past Assessment Scorecards &amp; Class Benchmarks
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                      {completedTests.length} Completed
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Click to {isPastTestsOpen ? 'collapse' : 'view'} detailed scores and performance analytics
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                <span className="hidden sm:inline">
                  {isPastTestsOpen ? 'Hide Past Scores' : 'View Past Scores'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shadow-sm">
                  {isPastTestsOpen ? (
                    <ChevronUp className="w-4 h-4 text-secondary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-secondary" />
                  )}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isPastTestsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 border-t border-border space-y-4"
                >
                  {/* Test Category Filter & Stats */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted" />
                      <span className="text-xs font-bold text-secondary">Assessment Type:</span>
                      <select
                        value={selectedTestTypeFilter}
                        onChange={(e) => setSelectedTestTypeFilter(e.target.value)}
                        className="p-2 rounded-xl bg-surface-raised border border-border text-xs font-semibold text-secondary cursor-pointer focus:outline-none"
                      >
                        <option value="ALL">All Completed Tests</option>
                        <option value="PERIODIC_ASSESSMENT">Periodic Assessments</option>
                        <option value="UNIT_TEST">Unit Tests</option>
                        <option value="CLASS_QUIZ">Class Quizzes</option>
                        <option value="MOCK_EXAM">Mock Exams</option>
                      </select>
                    </div>

                    <span className="text-xs text-muted">
                      Showing {filteredCompletedTests.length} of {completedTests.length} scorecards
                    </span>
                  </div>

                  {filteredCompletedTests.length === 0 ? (
                    <div className="text-center py-8 text-muted text-xs">
                      No completed tests found for the selected filter.
                    </div>
                  ) : (
                    filteredCompletedTests.map((t) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl bg-surface-raised/80 border border-border space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-raised text-secondary uppercase">
                                {t.type.replace('_', ' ')}
                              </span>
                              <span className="text-xs text-muted">{t.date}</span>
                            </div>
                            <h4 className="text-sm font-bold text-primary mt-1">{t.title}</h4>
                            <span className="text-xs text-secondary">Syllabus: {t.syllabus}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-emerald-700 block">
                                {t.obtainedMarks} / {t.totalMarks} Marks
                              </span>
                              <span className="text-[11px] text-muted">
                                {((t.obtainedMarks! / t.totalMarks) * 100).toFixed(1)}% Score
                              </span>
                            </div>
                            {t.grade && (
                              <div className="w-11 h-11 rounded-2xl bg-accent-green-subtle text-accent-green font-extrabold text-base flex items-center justify-center shrink-0">
                                {t.grade}
                              </div>
                            )}
                          </div>
                        </div>

                        {t.classAverage && (
                          <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-secondary">
                              <TrendingUp className="w-4 h-4 text-accent-blue" />
                              <span>Section A Class Average: <strong>{t.classAverage} Marks</strong></span>
                            </div>
                            <span className="font-bold text-emerald-700">
                              +{(t.obtainedMarks! - t.classAverage).toFixed(1)} marks above average
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB D: TEACHER & DOUBT SESSIONS                                           */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'TEACHER' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl p-8 border border-border shadow-card space-y-6 max-w-3xl">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-3xl bg-accent-blue text-white flex items-center justify-center text-2xl font-extrabold shadow-card shrink-0">
                {subject.teacher.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-primary">{subject.teacher.name}</h3>
                <p className="text-xs font-semibold text-accent-blue">{subject.teacher.role}</p>
                <p className="text-xs text-secondary">Delhi Public Academy Faculty Department</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-bold block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-accent-blue" />
                  <span>Official Email:</span>
                </span>
                <p className="font-bold text-primary">{subject.teacher.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-raised border border-border space-y-1">
                <span className="text-muted font-bold block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent-blue" />
                  <span>Cabin / Laboratory:</span>
                </span>
                <p className="font-bold text-primary">{subject.teacher.room}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 sm:col-span-2 space-y-1">
                <span className="text-amber-800 font-bold block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Weekly Doubt Clearing Consultation:</span>
                </span>
                <p className="font-extrabold text-primary">{subject.teacher.doubtHours}</p>
                <p className="text-[11px] text-secondary">
                  Students may bring solved notebook exercises and NCERT questions for 1-on-1 discussion during these hours.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => alert(`Opening teacher message draft to ${subject.teacher.email}...`)}
                className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    {submittingAssignment.chapter}
                  </span>
                  <h3 className="text-lg font-bold text-primary">{submittingAssignment.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-14 h-14 rounded-full bg-accent-green-subtle text-accent-green flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-primary">Homework Submitted Successfully!</h4>
                  <p className="text-xs text-secondary">
                    Your file has been delivered to <strong>{subject.teacher.name}</strong> for evaluation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitHomework} className="space-y-4 text-xs">
                  {/* File Upload Box with Cloudflare R2 Streaming */}
                  <div>
                    <label className="font-bold text-secondary block mb-1.5 flex items-center justify-between">
                      <span>Upload Notebook Scans / Assignment PDF</span>
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        ☁️ Cloudflare R2
                      </span>
                    </label>

                    {/* Hidden input */}
                    <input
                      ref={homeworkFileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleHomeworkFileChange}
                      className="hidden"
                    />

                    {isUploadingFile ? (
                      <div className="border-2 border-dashed border-orange-400 bg-orange-50/10 p-6 rounded-2xl text-center space-y-2">
                        <RefreshCw className="w-7 h-7 text-orange-500 animate-spin mx-auto" />
                        <p className="font-bold text-primary text-xs">Streaming file to Cloudflare R2 bucket...</p>
                        <span className="text-[10px] text-muted">Encrypting &amp; generating fast CDN URL</span>
                      </div>
                    ) : uploadedFileUrl ? (
                      <div className="p-4 rounded-2xl bg-surface-raised border border-border flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center shrink-0">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-primary truncate text-xs">{uploadedFileName}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted">
                              {uploadedFileSize && <span>{(uploadedFileSize / 1024).toFixed(1)} KB</span>}
                              <span>•</span>
                              <span className="text-accent-green font-bold flex items-center gap-1">
                                <Check className="w-3 h-3" /> Ready to submit
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={uploadService.getFileUrl(uploadedFileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-surface hover:bg-border text-accent-blue border border-border transition-all"
                            title="Preview file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedFile}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => homeworkFileInputRef.current?.click()}
                        className="border-2 border-dashed border-border hover:border-accent-blue p-6 rounded-2xl text-center cursor-pointer transition-all bg-surface-raised hover:bg-sky-50/20 group"
                      >
                        <Upload className="w-8 h-8 text-accent-blue mx-auto mb-2 group-hover:-translate-y-1 transition-transform" />
                        <p className="font-bold text-primary">Click to select homework file (PDF, PNG, JPG, DOC)</p>
                        <span className="text-[10px] text-muted block mt-1">
                          Files are uploaded directly to Cloudflare R2 • Max 10 MB
                        </span>
                      </div>
                    )}

                    {uploadFileError && (
                      <p className="text-[11px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{uploadFileError}</span>
                      </p>
                    )}
                  </div>

                  {/* Student Remarks / Note to Teacher */}
                  <div>
                    <label className="font-bold text-secondary block mb-1.5">Note to Teacher (Optional)</label>
                    <textarea
                      rows={3}
                      value={studentComments}
                      onChange={(e) => setStudentComments(e.target.value)}
                      placeholder="e.g. Sir, I solved questions 1 through 10 as assigned. Had a slight doubt on question 8 regarding negative discriminant values."
                      className="w-full p-3 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setSubmittingAssignment(null)}
                      className="px-5 py-2.5 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
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
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Note Preview</span>
                    <h3 className="text-sm font-bold text-primary">{previewNoteTitle}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewNoteTitle(null)}
                  className="p-2 rounded-xl hover:bg-surface-raised text-muted cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-surface-raised border border-border text-center space-y-2">
                <p className="text-xs text-secondary font-medium">
                  Document viewer initialized. Ready to download full high-resolution PDF for offline study.
                </p>
                <span className="text-[11px] text-muted block">Verified by Delhi Public Academy Faculty</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewNoteTitle(null)}
                  className="px-5 py-2.5 rounded-full border border-border text-secondary font-bold text-xs hover:bg-surface-raised cursor-pointer"
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
                  className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
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
