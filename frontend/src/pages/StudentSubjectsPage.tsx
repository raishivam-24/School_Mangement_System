/**
 * @file StudentSubjectsPage.tsx
 * @description Dedicated Student Course & Subject Classroom Portal.
 * Enables students to:
 * 1. View all enrolled personal subjects with syllabus progress & teacher info.
 * 2. Enter individual subject classrooms to access chapter notes, tests & quizzes.
 * 3. Review assignments with highlighted due countdowns and submit homework via file upload.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Clock,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowRight,
  X,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Send,
  Eye,
  FileCheck,
  Check,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  chapter: string;
  dueDate: string;
  dueCountdown: string;
  isUrgent: boolean;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  maxMarks: number;
  obtainedMarks?: number;
  teacherFeedback?: string;
  description: string;
}

interface NoteMaterial {
  id: string;
  title: string;
  chapter: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
}

interface QuizItem {
  id: string;
  title: string;
  date: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'UPCOMING' | 'COMPLETED';
}

interface StudentSubject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  teacherEmail: string;
  room: string;
  color: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  weeklySessions: number;
  syllabusProgress: number;
  pendingAssignmentsCount: number;
  assignments: Assignment[];
  notes: NoteMaterial[];
  quizzes: QuizItem[];
}

const subjectsData: StudentSubject[] = [
  {
    id: 'sub_math',
    name: 'Mathematics',
    code: 'MATH-10',
    teacher: 'Amit Sharma Sir',
    teacherEmail: 'amit.sharma@dpa.edu',
    room: 'Room 201',
    color: '#38BDF8',
    gradient: 'from-sky-400 to-brand-sky',
    badgeBg: 'bg-brand-sky-light',
    badgeText: 'text-brand-sky-dark',
    weeklySessions: 6,
    syllabusProgress: 75,
    pendingAssignmentsCount: 1,
    assignments: [
      {
        id: 'asg_m1',
        title: 'Exercise 4.2: Quadratic Formula & Word Problems',
        chapter: 'Chapter 4: Quadratic Equations',
        dueDate: 'Tomorrow, 08:30 AM',
        dueCountdown: 'Due in 18 Hours',
        isUrgent: true,
        status: 'PENDING',
        maxMarks: 20,
        description: 'Solve questions 1 through 10 from Ex 4.2 in your mathematics notebook and upload scanned PDF copies.',
      },
      {
        id: 'asg_m2',
        title: 'Linear Equations in Two Variables Practice Sheet',
        chapter: 'Chapter 3: Pair of Linear Equations',
        dueDate: '10 Apr 2026',
        dueCountdown: 'Completed',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 20,
        obtainedMarks: 19,
        teacherFeedback: 'Outstanding step-by-step graphical method explanation! Neat work.',
        description: 'Complete the 5 graphical word problems given on the blackboard.',
      },
    ],
    notes: [
      {
        id: 'n_m1',
        title: 'Quadratic Equations Formula Sheet & Shortcuts',
        chapter: 'Chapter 4',
        fileType: 'PDF Document',
        fileSize: '1.8 MB',
        uploadedDate: '12 Apr 2026',
      },
      {
        id: 'n_m2',
        title: 'CBSE 10-Year Previous Questions (Maths Term 1)',
        chapter: 'Complete Term 1',
        fileType: 'PDF Document',
        fileSize: '4.2 MB',
        uploadedDate: '05 Apr 2026',
      },
      {
        id: 'n_m3',
        title: 'Real Numbers & Polynomials Quick Mindmap',
        chapter: 'Chapters 1 & 2',
        fileType: 'Handwritten Notes PDF',
        fileSize: '2.1 MB',
        uploadedDate: '28 Mar 2026',
      },
    ],
    quizzes: [
      {
        id: 'q_m1',
        title: 'Periodic Quiz 1: Quadratic Equations',
        date: '28 Apr 2026 (Next Tuesday)',
        totalMarks: 25,
        status: 'UPCOMING',
      },
      {
        id: 'q_m2',
        title: 'Class Mock Test: Real Numbers & Polynomials',
        date: '02 Apr 2026',
        totalMarks: 30,
        obtainedMarks: 29,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_phy',
    name: 'Physics',
    code: 'PHY-10',
    teacher: 'Dr. Priya Patel',
    teacherEmail: 'priya.patel@dpa.edu',
    room: 'Science Lab 1',
    color: '#C4B5FD',
    gradient: 'from-purple-400 to-brand-lilac',
    badgeBg: 'bg-brand-lilac-light',
    badgeText: 'text-brand-lilac-dark',
    weeklySessions: 5,
    syllabusProgress: 68,
    pendingAssignmentsCount: 1,
    assignments: [
      {
        id: 'asg_p1',
        title: 'Ohm’s Law Verification & V-I Graph Analysis',
        chapter: 'Chapter 12: Electricity',
        dueDate: 'Wednesday, Apr 23',
        dueCountdown: 'Due in 2 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 15,
        description: 'Complete the laboratory readings table and plot the resistance slope curve on graph sheet.',
      },
    ],
    notes: [
      {
        id: 'n_p1',
        title: 'Ray Optics & Lens Formula Summary Chart',
        chapter: 'Chapter 10: Light',
        fileType: 'PDF Document',
        fileSize: '3.1 MB',
        uploadedDate: '10 Apr 2026',
      },
      {
        id: 'n_p2',
        title: 'Electricity Lab Manual & Circuit Diagrams',
        chapter: 'Chapter 12',
        fileType: 'Laboratory Manual',
        fileSize: '5.4 MB',
        uploadedDate: '01 Apr 2026',
      },
    ],
    quizzes: [
      {
        id: 'q_p1',
        title: 'Electricity & Resistance Numerical Quiz',
        date: '30 Apr 2026',
        totalMarks: 20,
        status: 'UPCOMING',
      },
    ],
  },
  {
    id: 'sub_chem',
    name: 'Chemistry',
    code: 'CHEM-10',
    teacher: 'Dr. Priya Patel',
    teacherEmail: 'priya.patel@dpa.edu',
    room: 'Science Lab 2',
    color: '#FCD34D',
    gradient: 'from-amber-400 to-brand-yellow',
    badgeBg: 'bg-brand-yellow-light',
    badgeText: 'text-brand-yellow-dark',
    weeklySessions: 4,
    syllabusProgress: 72,
    pendingAssignmentsCount: 0,
    assignments: [
      {
        id: 'asg_c1',
        title: 'Chemical Reactions Balancing Exercise (50 Equations)',
        chapter: 'Chapter 1: Chemical Reactions',
        dueDate: '08 Apr 2026',
        dueCountdown: 'Submitted',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 25,
        obtainedMarks: 24,
        teacherFeedback: 'Very thorough balancing of redox reactions. Good attention to states (s, l, g, aq).',
        description: 'Balance all redox and precipitation reactions from page 14.',
      },
    ],
    notes: [
      {
        id: 'n_c1',
        title: 'Acids, Bases & Salts Reaction Tables',
        chapter: 'Chapter 2',
        fileType: 'PDF Document',
        fileSize: '2.5 MB',
        uploadedDate: '11 Apr 2026',
      },
    ],
    quizzes: [
      {
        id: 'q_c1',
        title: 'Periodic Assessment: Chemical Equations',
        date: '04 Apr 2026',
        totalMarks: 25,
        obtainedMarks: 23,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_bio',
    name: 'Biology',
    code: 'BIO-10',
    teacher: 'Dr. Meera Deshmukh',
    teacherEmail: 'meera.deshmukh@dpa.edu',
    room: 'Biology Lab 3',
    color: '#34D399',
    gradient: 'from-emerald-400 to-brand-mint',
    badgeBg: 'bg-brand-mint-light',
    badgeText: 'text-brand-mint-dark',
    weeklySessions: 4,
    syllabusProgress: 80,
    pendingAssignmentsCount: 0,
    assignments: [
      {
        id: 'asg_b1',
        title: 'Nephron & Human Excretory System Diagram',
        chapter: 'Chapter 6: Life Processes',
        dueDate: '12 Apr 2026',
        dueCountdown: 'Graded',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 10,
        obtainedMarks: 10,
        teacherFeedback: 'Flawlessly labeled diagram! Exceptional neatness.',
        description: 'Draw and label the nephron structure and write the 3 steps of urine filtration.',
      },
    ],
    notes: [
      {
        id: 'n_b1',
        title: 'Life Processes Complete Diagrams & Flowcharts',
        chapter: 'Chapter 6',
        fileType: 'PDF Document',
        fileSize: '6.1 MB',
        uploadedDate: '14 Apr 2026',
      },
    ],
    quizzes: [],
  },
  {
    id: 'sub_eng',
    name: 'English Literature',
    code: 'ENG-10',
    teacher: 'Sunita Rao Ma’am',
    teacherEmail: 'sunita.rao@dpa.edu',
    room: 'Room 201',
    color: '#FB7185',
    gradient: 'from-rose-400 to-brand-rose',
    badgeBg: 'bg-brand-rose-light',
    badgeText: 'text-brand-rose-dark',
    weeklySessions: 5,
    syllabusProgress: 82,
    pendingAssignmentsCount: 1,
    assignments: [
      {
        id: 'asg_e1',
        title: 'Analytical Essay: The Ball Poem & Metaphor of Loss',
        chapter: 'First Flight — Poetry Unit 3',
        dueDate: 'Friday, Apr 25',
        dueCountdown: 'Due in 4 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 15,
        description: 'Write a 250-word critical evaluation on John Berryman’s poem exploring childhood loss and resilience.',
      },
    ],
    notes: [
      {
        id: 'n_e1',
        title: 'Formal Letter Writing Formats & Sample Templates',
        chapter: 'Writing Section',
        fileType: 'PDF Document',
        fileSize: '1.2 MB',
        uploadedDate: '02 Apr 2026',
      },
    ],
    quizzes: [],
  },
  {
    id: 'sub_cs',
    name: 'Computer Science',
    code: 'CS-10',
    teacher: 'Rajesh Nair Sir',
    teacherEmail: 'rajesh.nair@dpa.edu',
    room: 'Computer Lab 3',
    color: '#818CF8',
    gradient: 'from-indigo-400 to-indigo-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-600',
    weeklySessions: 4,
    syllabusProgress: 85,
    pendingAssignmentsCount: 0,
    assignments: [],
    notes: [
      {
        id: 'n_cs1',
        title: 'Python Functions & List Comprehension Cheat Sheet',
        chapter: 'Python Basics',
        fileType: 'PDF Document',
        fileSize: '1.5 MB',
        uploadedDate: '15 Apr 2026',
      },
    ],
    quizzes: [
      {
        id: 'q_cs1',
        title: 'Python Coding Assessment on Loops & Conditionals',
        date: '02 May 2026',
        totalMarks: 20,
        status: 'UPCOMING',
      },
    ],
  },
];

export const StudentSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<StudentSubject[]>(subjectsData);
  const [selectedSubject, setSelectedSubject] = useState<StudentSubject | null>(null);
  const [activeTab, setActiveTab] = useState<'ASSIGNMENTS' | 'NOTES' | 'QUIZZES'>('ASSIGNMENTS');

  // Assignment Submission State
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [studentComments, setStudentComments] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle Homework Submission
  const handleSubmitHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !selectedSubject) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Update local assignment status
      const updatedSubject = {
        ...selectedSubject,
        assignments: selectedSubject.assignments.map((a) =>
          a.id === submittingAssignment.id ? { ...a, status: 'SUBMITTED' as const, dueCountdown: 'Submitted' } : a
        ),
        pendingAssignmentsCount: Math.max(0, selectedSubject.pendingAssignmentsCount - 1),
      };

      setSelectedSubject(updatedSubject);
      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmittingAssignment(null);
        setUploadedFileName(null);
        setStudentComments('');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HERO CHIP                                                 */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>My Enrolled Subjects</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-sky-light text-brand-sky-dark">
              Class 10 - Section A
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your course materials, chapter notes, upcoming unit tests, and submit homework assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>3 Assignments Due This Week</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBJECTS CARDS GRID                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => {
              setSelectedSubject(sub);
              setActiveTab('ASSIGNMENTS');
            }}
            className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              {/* Header with Color Pill & Pending Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.gradient} flex items-center justify-center text-white shadow-md`}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-brand-sky-dark transition-colors">
                      {sub.name}
                    </h3>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">{sub.code}</span>
                  </div>
                </div>

                {sub.pendingAssignmentsCount > 0 ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" />
                    <span>{sub.pendingAssignmentsCount} Due</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-mint-light text-brand-mint-dark">
                    All Clear
                  </span>
                )}
              </div>

              {/* Teacher Info */}
              <div className="py-3 border-y border-slate-50 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Teacher:</span>
                  <span className="font-bold text-slate-800">{sub.teacher}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Room / Lab:</span>
                  <span className="font-medium text-slate-600">{sub.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Weekly Lectures:</span>
                  <span className="font-semibold text-slate-700">{sub.weeklySessions} Periods/week</span>
                </div>
              </div>

              {/* Syllabus Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400 text-[11px] uppercase tracking-wider">Term 1 Syllabus</span>
                  <span className="text-slate-700">{sub.syllabusProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sub.syllabusProgress}%`, backgroundColor: sub.color }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Bottom Enter Classroom Button */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {sub.notes.length} Notes • {sub.quizzes.length} Quizzes
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 group-hover:bg-brand-sky group-hover:text-white text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                <span>Enter Classroom</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SUBJECT CLASSROOM DRAWER / MODAL                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Classroom Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedSubject.gradient} flex items-center justify-center text-white shadow-sm`}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedSubject.name} Classroom</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Instructor: <strong className="text-slate-700">{selectedSubject.teacher}</strong> •{' '}
                      {selectedSubject.room}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedSubject(null)}
                  className="p-2 rounded-2xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Classroom Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-surface">
                <button
                  type="button"
                  onClick={() => setActiveTab('ASSIGNMENTS')}
                  className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'ASSIGNMENTS'
                      ? 'border-brand-sky text-brand-sky-dark bg-sky-50/40'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Assignments ({selectedSubject.assignments.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('NOTES')}
                  className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'NOTES'
                      ? 'border-brand-sky text-brand-sky-dark bg-sky-50/40'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Notes &amp; PDFs ({selectedSubject.notes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('QUIZZES')}
                  className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'QUIZZES'
                      ? 'border-brand-sky text-brand-sky-dark bg-sky-50/40'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Tests &amp; Quizzes ({selectedSubject.quizzes.length})</span>
                </button>
              </div>

              {/* Tab Contents Area */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {/* 1. ASSIGNMENTS TAB */}
                {activeTab === 'ASSIGNMENTS' && (
                  <div className="space-y-4">
                    {selectedSubject.assignments.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No pending or graded assignments for {selectedSubject.name}.
                      </div>
                    ) : (
                      selectedSubject.assignments.map((asg) => (
                        <div
                          key={asg.id}
                          className={`p-5 rounded-3xl border transition-all ${
                            asg.isUrgent
                              ? 'bg-amber-50/30 border-amber-200'
                              : asg.status === 'GRADED'
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {asg.chapter}
                            </span>
                            <div className="flex items-center gap-2">
                              {asg.isUrgent && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>{asg.dueCountdown}</span>
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  asg.status === 'GRADED'
                                    ? 'bg-brand-mint-light text-brand-mint-dark'
                                    : asg.status === 'SUBMITTED'
                                    ? 'bg-brand-sky-light text-brand-sky-dark'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {asg.status}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-slate-800">{asg.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.description}</p>

                          {/* Graded Feedback Box */}
                          {asg.status === 'GRADED' && asg.obtainedMarks !== undefined && (
                            <div className="mt-3 p-3 rounded-2xl bg-white border border-emerald-100 text-xs flex items-start gap-3">
                              <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-extrabold text-slate-800">
                                  Score: {asg.obtainedMarks} / {asg.maxMarks} Marks
                                </p>
                                <p className="text-slate-600 text-[11px] mt-0.5 italic">
                                  Feedback: &ldquo;{asg.teacherFeedback}&rdquo;
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Due Date & Action */}
                          <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Due: {asg.dueDate}</span>

                            {asg.status === 'PENDING' ? (
                              <button
                                type="button"
                                onClick={() => setSubmittingAssignment(asg)}
                                className="px-4 py-2 rounded-2xl bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Submit Homework</span>
                              </button>
                            ) : asg.status === 'SUBMITTED' ? (
                              <span className="text-xs font-bold text-brand-sky-dark flex items-center gap-1">
                                <FileCheck className="w-4 h-4" /> Submitted • Pending Teacher Review
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. NOTES & STUDY MATERIAL TAB */}
                {activeTab === 'NOTES' && (
                  <div className="space-y-3">
                    {selectedSubject.notes.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-lilac-light text-brand-lilac-dark flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {n.chapter} • {n.fileType} ({n.fileSize}) • {n.uploadedDate}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            confetti({ particleCount: 20, spread: 40 });
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-brand-sky hover:text-brand-sky-dark text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. TESTS & QUIZZES TAB */}
                {activeTab === 'QUIZZES' && (
                  <div className="space-y-3">
                    {selectedSubject.quizzes.length === 0 ? (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No tests or quizzes currently scheduled for this subject.
                      </div>
                    ) : (
                      selectedSubject.quizzes.map((q) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {q.status === 'UPCOMING' ? 'Upcoming Test' : 'Completed Quiz'}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 mt-0.5">{q.title}</h4>
                            <span className="text-[10px] text-slate-400">{q.date}</span>
                          </div>

                          <div className="text-right">
                            {q.status === 'COMPLETED' ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-mint-light text-brand-mint-dark">
                                {q.obtainedMarks} / {q.totalMarks} Marks
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-lilac-light text-brand-lilac-dark">
                                Max {q.totalMarks} Marks
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. HOMEWORK SUBMISSION MODAL                                              */}
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
                  <h3 className="text-lg font-bold text-slate-800">Submit Homework</h3>
                  <p className="text-xs text-slate-500">{submittingAssignment.title}</p>
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
                  <p className="text-xs text-slate-500">Your file has been delivered to your teacher for review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitHomework} className="space-y-4 text-xs">
                  {/* File Upload Box */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1.5">
                      Upload Notebook Scans / Assignment PDF
                    </label>
                    <div
                      onClick={() => setUploadedFileName('Rahul_Sharma_Ex4.2_Solutions.pdf')}
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
                          <p className="font-bold text-slate-700">Click to upload file (PDF, PNG, JPG)</p>
                          <span className="text-[10px] text-slate-400">Max file size: 10 MB</span>
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
                      placeholder="e.g. Sir, I had a slight doubt on question 8 regarding discriminant negative values, please review."
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
    </div>
  );
};
