/**
 * @file ExamsPage.tsx
 * @description Comprehensive Examination Management, Date Sheets, Teacher Marks Entry Grid,
 * and Official CBSE Printable Report Card Generator.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Printer,
  ChevronRight,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Filter,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { examService, studentService, academicService } from '../services';
import type { ExamItem, ExamSubject, ReportCardResponse } from '../services';
import type { AcademicYear, ClassItem, SubjectItem, Student } from '../types';

export const ExamsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'SCHOOL_ADMIN' || user?.role === 'SUPER_ADMIN';
  const isTeacher = user?.role === 'TEACHER' || isAdmin;
  const isStudent = user?.role === 'STUDENT';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'exams' | 'marks' | 'reportCards'>('exams');

  // Core Data State
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [reportCardModalData, setReportCardModalData] = useState<ReportCardResponse | null>(null);
  const [loadingReportCard, setLoadingReportCard] = useState(false);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Marks Entry State
  const [marksExamId, setMarksExamId] = useState<string>('');
  const [marksClassId, setMarksClassId] = useState<string>('');
  const [marksSubjectId, setMarksSubjectId] = useState<string>('');
  const [marksStudents, setMarksStudents] = useState<Array<{ studentId: string; name: string; rollNo?: number; marks: number; remarks: string }>>([]);
  const [marksMaxScore, setMarksMaxScore] = useState<number>(100);
  const [submittingMarks, setSubmittingMarks] = useState(false);

  // Report Card Search
  const [reportSearchStudentId, setReportSearchStudentId] = useState<string>('');
  const [allStudentsList, setAllStudentsList] = useState<Array<{ id: string; name: string; admissionNo: string; className?: string }>>([]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Safe date formatting helper to prevent any RangeError invalid time value crashes
  const safeDate = (dateStr?: string | Date | null, options?: Intl.DateTimeFormatOptions) => {
    if (!dateStr) return 'TBA';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'TBA';
      return d.toLocaleDateString('en-IN', options);
    } catch {
      return 'TBA';
    }
  };

  // 1. Initial Load of Exams and Academic Context
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [examsData, classesData, subjectsData, yearsData, studentsData] = await Promise.all([
          examService.listExams().catch(() => []),
          academicService.getClasses().catch(() => []),
          academicService.getSubjects().catch(() => []),
          academicService.getAcademicYears().catch(() => []),
          // Only fetch full school student roster for teacher/admin to prevent 403 Forbidden
          isTeacher ? studentService.getStudents().catch(() => []) : Promise.resolve([]),
        ]);

        setExams(examsData);
        setClasses(classesData);
        setSubjects(subjectsData);
        setAcademicYears(yearsData);

        if (examsData.length > 0) {
          setSelectedExam(examsData[0]);
          setMarksExamId(examsData[0].id);
        }
        if (classesData.length > 0) {
          setMarksClassId(classesData[0].id);
        }
        if (subjectsData.length > 0) {
          setMarksSubjectId(subjectsData[0].id);
        }

        if (isStudent) {
          const myStudentId = user?.studentProfile?.id || user?.id;
          if (myStudentId) {
            setReportSearchStudentId(myStudentId);
            if (examsData.length > 0) {
              handleGenerateReportCard(myStudentId, examsData[0].id);
            }
          }
        } else {
          const formattedStudents = studentsData.map((s: Student) => ({
            id: s.id,
            name: s.name,
            admissionNo: s.admissionNo,
            className: s.class || 'Class 10',
          }));
          setAllStudentsList(formattedStudents);
          if (formattedStudents.length > 0) {
            setReportSearchStudentId(formattedStudents[0].id);
          }
        }
      } catch (err: any) {
        showToast('Error loading exam records. Please refresh.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user?.role, user?.studentProfile?.id, user?.id]);

  // 2. Fetch specific exam details when selectedExam changes
  useEffect(() => {
    if (!selectedExam?.id) return;
    examService.getExamDetails(selectedExam.id).then((detailed) => {
      setSelectedExam(detailed);
    }).catch(() => {});
  }, [selectedExam?.id]);

  // 3. Load students for marks entry (only for teachers/admins)
  useEffect(() => {
    if (isStudent || !marksClassId) return;
    studentService.getStudents({ classId: marksClassId }).then((students: Student[]) => {
      const roster = students.map((s: Student, idx: number) => ({
        studentId: s.id,
        name: s.name,
        rollNo: s.rollNo ? Number(s.rollNo) || (idx + 1) : idx + 1,
        marks: 75,
        remarks: 'Good grasp of concepts',
      }));
      setMarksStudents(roster);
    }).catch(() => {});
  }, [marksClassId, isStudent]);

  // Helper: CBSE 9-Point Grading Scale
  const getCbseGrade = (marks: number, max: number = 100) => {
    const pct = (marks / max) * 100;
    if (pct >= 91) return { grade: 'A1', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' };
    if (pct >= 81) return { grade: 'A2', color: 'bg-green-500/15 text-green-600 border-green-500/30' };
    if (pct >= 71) return { grade: 'B1', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30' };
    if (pct >= 61) return { grade: 'B2', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30' };
    if (pct >= 51) return { grade: 'C1', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' };
    if (pct >= 41) return { grade: 'C2', color: 'bg-orange-500/15 text-orange-600 border-orange-500/30' };
    if (pct >= 33) return { grade: 'D', color: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30' };
    return { grade: 'E (Needs Improvement)', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' };
  };

  // Handle Marks Submission
  const handleSubmitMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marksStudents.length) {
      showToast('No student records found to submit.', 'error');
      return;
    }

    // Find the examSubject ID matching this exam, class, and subject
    const subjectEntry = selectedExam?.subjects?.find(
      (s) => s.classId === marksClassId && s.subjectId === marksSubjectId
    );

    if (!subjectEntry) {
      showToast('Please schedule this subject in the Date Sheet first before recording marks.', 'error');
      return;
    }

    setSubmittingMarks(true);
    try {
      await examService.submitMarks({
        examSubjectId: subjectEntry.id,
        marks: marksStudents.map((s) => ({
          studentId: s.studentId,
          marksObtained: s.marks,
          remarks: s.remarks,
        })),
      });
      showToast(`Marks recorded successfully for ${marksStudents.length} students!`);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit marks.', 'error');
    } finally {
      setSubmittingMarks(false);
    }
  };

  // Generate Report Card
  const handleGenerateReportCard = async (studentId: string, examId: string) => {
    if (!studentId || !examId) return;
    setLoadingReportCard(true);
    try {
      const card = await examService.getStudentReportCard(examId, studentId);
      setReportCardModalData(card);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Could not load report card. Marks may not be published yet.', 'error');
    } finally {
      setLoadingReportCard(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-primary tracking-tight">
              Examinations & CBSE Report Cards
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-sky-subtle text-accent-blue border border-brand-sky/30">
              CBSE Evaluation System
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            Manage exam date sheets, record subject marks with instant grading, and print official report cards.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateExamModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent-blue text-white font-bold text-sm shadow-md hover:bg-brand-sky-dark transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Exam</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted font-bold block uppercase tracking-wider">Total Exams</span>
            <span className="text-2xl font-black text-primary">{exams.length || 3}</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted font-bold block uppercase tracking-wider">Scheduled Subjects</span>
            <span className="text-2xl font-black text-primary">
              {exams.reduce((acc, curr) => acc + (curr.subjects?.length || 0), 0) || 18}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted font-bold block uppercase tracking-wider">Grading Standard</span>
            <span className="text-sm font-black text-primary">CBSE 9-Point Scale</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted font-bold block uppercase tracking-wider">Report Cards</span>
            <span className="text-sm font-black text-primary">1-Click PDF Ready</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('exams')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'exams'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isStudent ? 'My Exam Schedule' : 'Exams & Date Sheets'}</span>
        </button>

        {isTeacher && (
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'marks'
                ? 'bg-accent-blue text-white shadow-md'
                : 'text-secondary hover:text-primary hover:bg-surface-raised'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Marks Entry Grid</span>
          </button>
        )}

        <button
          onClick={() => {
            setActiveTab('reportCards');
            if (isStudent) {
              const myStudentId = user?.studentProfile?.id || user?.id;
              const targetExamId = marksExamId || exams[0]?.id;
              if (myStudentId && targetExamId && (!reportCardModalData || reportCardModalData.exam?.id !== targetExamId)) {
                handleGenerateReportCard(myStudentId, targetExamId);
              }
            }
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'reportCards'
              ? 'bg-accent-blue text-white shadow-md'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isStudent ? 'My CBSE Report Card' : 'CBSE Report Card Generator'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXAMS & DATE SHEETS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam Terms Column */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-primary flex items-center justify-between">
              <span>Exam Terms</span>
              <span className="text-xs text-muted font-semibold">{exams.length} Configured</span>
            </h2>

            {exams.length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-3xl border border-border text-muted">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold">No exams configured yet.</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowCreateExamModal(true)}
                    className="mt-3 text-xs text-accent-blue font-bold hover:underline"
                  >
                    + Create First Exam Term
                  </button>
                )}
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                    selectedExam?.id === exam.id
                      ? 'bg-surface border-accent-blue ring-2 ring-accent-blue/20 shadow-md'
                      : 'bg-surface hover:bg-surface-raised border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue-subtle text-accent-blue">
                      {exam.term || 'Term 1'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        exam.status === 'ONGOING'
                          ? 'bg-emerald-500/15 text-emerald-600'
                          : exam.status === 'COMPLETED'
                          ? 'bg-purple-500/15 text-purple-600'
                          : 'bg-amber-500/15 text-amber-600'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-primary text-base">{exam.name}</h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {safeDate(exam.startDate)} - {safeDate(exam.endDate)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Date Sheet Details Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    {selectedExam?.academicYear?.name || 'Academic Session 2026-27'}
                  </span>
                  <h2 className="text-xl font-extrabold text-primary mt-0.5">
                    {selectedExam?.name || 'Date Sheet & Syllabus Schedule'}
                  </h2>
                </div>

                {isAdmin && selectedExam && (
                  <button
                    onClick={() => setShowAddSubjectModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-accent-blue-subtle text-accent-blue font-bold text-xs hover:bg-brand-sky/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject to Date Sheet</span>
                  </button>
                )}
              </div>

              {/* Scheduled Subjects Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3">Subject & Code</th>
                      <th className="pb-3 px-3">Class</th>
                      <th className="pb-3 px-3">Timing</th>
                      <th className="pb-3 px-3">Max / Pass</th>
                      <th className="pb-3 px-3 text-right">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {selectedExam?.subjects && selectedExam.subjects.length > 0 ? (
                      selectedExam.subjects.map((sub, idx) => (
                        <tr key={idx} className="hover:bg-surface-raised/50 transition-colors">
                          <td className="py-4 px-3 font-semibold text-primary">
                            {safeDate(sub.examDate, {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-extrabold text-primary block">
                              {sub.subject?.name || 'Subject'}
                            </span>
                            <span className="text-[10px] text-muted font-mono">{sub.subject?.code}</span>
                          </td>
                          <td className="py-4 px-3 font-semibold text-secondary">
                            {sub.class?.name || 'Class 10'}
                          </td>
                          <td className="py-4 px-3 text-muted font-medium">
                            {sub.startTime} - {sub.endTime}
                          </td>
                          <td className="py-4 px-3">
                            <span className="font-bold text-primary">{Number(sub.maxMarks)}</span>
                            <span className="text-muted"> / {Number(sub.passMarks)}</span>
                          </td>
                          <td className="py-4 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-md bg-surface-raised border border-border text-[11px] font-bold text-secondary">
                              {sub.roomNumber || 'Hall A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted">
                          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold">No subjects scheduled for this exam yet.</p>
                          {isAdmin && (
                            <button
                              onClick={() => setShowAddSubjectModal(true)}
                              className="mt-2 text-accent-blue font-bold hover:underline"
                            >
                              + Add first subject to date sheet
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MARKS ENTRY GRID                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'marks' && isTeacher && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div>
              <h2 className="text-xl font-extrabold text-primary">Subject Teacher Marks Entry Grid</h2>
              <p className="text-xs text-secondary mt-0.5">
                Record student scores. Instant CBSE 9-point grade calculation and validation.
              </p>
            </div>
            <button
              onClick={handleSubmitMarks}
              disabled={submittingMarks}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submittingMarks ? 'Saving Marks...' : 'Save & Lock Marks'}</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-surface-raised border border-border">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Select Exam
              </label>
              <select
                value={marksExamId}
                onChange={(e) => setMarksExamId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary"
              >
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Select Class
              </label>
              <select
                value={marksClassId}
                onChange={(e) => setMarksClassId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Select Subject
              </label>
              <select
                value={marksSubjectId}
                onChange={(e) => setMarksSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                Max Marks
              </label>
              <input
                type="number"
                value={marksMaxScore}
                onChange={(e) => setMarksMaxScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-bold text-primary"
              />
            </div>
          </div>

          {/* Student Roster Marks Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 px-4">Roll</th>
                  <th className="pb-3 px-4">Student Name</th>
                  <th className="pb-3 px-4">Marks Obtained (Max: {marksMaxScore})</th>
                  <th className="pb-3 px-4">Calculated CBSE Grade</th>
                  <th className="pb-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {marksStudents.map((student, idx) => {
                  const gradeInfo = getCbseGrade(student.marks, marksMaxScore);
                  return (
                    <tr key={student.studentId} className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-muted">{student.rollNo || idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-primary">{student.name}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min={0}
                          max={marksMaxScore}
                          value={student.marks}
                          onChange={(e) => {
                            const val = Math.min(marksMaxScore, Math.max(0, Number(e.target.value)));
                            const updated = [...marksStudents];
                            updated[idx].marks = val;
                            setMarksStudents(updated);
                          }}
                          className="w-24 px-3 py-1.5 bg-surface border border-border rounded-xl font-bold text-primary text-center"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={student.remarks}
                          onChange={(e) => {
                            const updated = [...marksStudents];
                            updated[idx].remarks = e.target.value;
                            setMarksStudents(updated);
                          }}
                          placeholder="Add teacher remark..."
                          className="w-full max-w-xs px-3 py-1.5 bg-surface border border-border rounded-xl text-xs text-primary"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CBSE REPORT CARD GENERATOR                                        */}
      {/* ========================================================================= */}
      {activeTab === 'reportCards' && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-extrabold text-primary">
                {isStudent ? 'My CBSE Academic Progress Report Card' : 'CBSE Format Student Report Card Generator'}
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                {isStudent
                  ? 'Official scholastic marks breakdown, CBSE 9-point grades, and teacher evaluation comments.'
                  : 'Select an exam term and student to render and print the official CBSE Comprehensive Grade Sheet.'}
              </p>
            </div>
            {isStudent && (
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-muted">Term:</label>
                <select
                  value={marksExamId}
                  onChange={(e) => {
                    const newExamId = e.target.value;
                    setMarksExamId(newExamId);
                    const myStudentId = user?.studentProfile?.id || user?.id;
                    if (myStudentId) {
                      handleGenerateReportCard(myStudentId, newExamId);
                    }
                  }}
                  className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-brand-sky"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Student Selector (Only for Teachers / Admins) */}
          {!isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-surface-raised border border-border">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                  Select Exam Term
                </label>
                <select
                  value={marksExamId}
                  onChange={(e) => setMarksExamId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary"
                >
                  {exams.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                    Select Student
                  </label>
                  <select
                    value={reportSearchStudentId}
                    onChange={(e) => setReportSearchStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold text-primary"
                  >
                    {allStudentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.admissionNo}) — {s.className}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleGenerateReportCard(reportSearchStudentId, marksExamId)}
                  disabled={loadingReportCard}
                  className="px-6 py-2 rounded-xl bg-accent-blue text-white font-bold text-xs shadow-md hover:bg-brand-sky-dark transition-all disabled:opacity-50 shrink-0"
                >
                  {loadingReportCard ? 'Generating...' : 'View Report Card'}
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loadingReportCard && (
            <div className="p-12 text-center bg-surface-raised rounded-3xl border border-border">
              <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-muted">Generating CBSE Report Card...</p>
            </div>
          )}

          {/* Empty State when no report card loaded */}
          {!loadingReportCard && !reportCardModalData && (
            <div className="p-12 text-center bg-surface rounded-3xl border border-border text-muted space-y-2">
              <Award className="w-10 h-10 mx-auto text-accent-blue/50" />
              <h4 className="text-sm font-bold text-primary">No Report Card Available Yet</h4>
              <p className="text-xs text-secondary max-w-md mx-auto">
                {isStudent
                  ? 'Marks for this examination term have not been published by your teachers yet.'
                  : 'Please select a valid student and exam term above to generate the report card.'}
              </p>
            </div>
          )}

          {/* Printable Report Card Preview */}
          {reportCardModalData ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-slate-800 shadow-xl space-y-8 font-sans print:m-0 print:p-0">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                  SH
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-slate-900">
                  {reportCardModalData.school.name || 'DELHI PUBLIC ACADEMY'}
                </h1>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Affiliated to Central Board of Secondary Education (CBSE), New Delhi • Affiliation No:{' '}
                  {reportCardModalData.school.affiliationNo || 'CBSE/AFF/2026/9102'}
                </p>
                <div className="inline-block mt-3 px-4 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 uppercase tracking-widest">
                  Academic Progress Report Card • {reportCardModalData.exam.name}
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Student Name</span>
                  <span className="font-extrabold text-slate-900 text-sm">{reportCardModalData.student.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Admission No</span>
                  <span className="font-mono font-bold text-slate-800">{reportCardModalData.student.admissionNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Class & Section</span>
                  <span className="font-bold text-slate-800">
                    {reportCardModalData.student.className} - {reportCardModalData.student.sectionName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Roll Number</span>
                  <span className="font-bold text-slate-800">{reportCardModalData.student.rollNumber || '01'}</span>
                </div>
              </div>

              {/* Scholastic Marks Table */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                  Part 1: Scholastic Performance
                </h3>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                      <th className="p-3 border-r border-slate-300">Subject</th>
                      <th className="p-3 border-r border-slate-300 text-center">Max Marks</th>
                      <th className="p-3 border-r border-slate-300 text-center">Pass Marks</th>
                      <th className="p-3 border-r border-slate-300 text-center">Marks Obtained</th>
                      <th className="p-3 border-r border-slate-300 text-center">Grade</th>
                      <th className="p-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {reportCardModalData.results.map((res, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3 border-r border-slate-300 font-bold text-slate-900">
                          {res.subjectName} ({res.subjectCode})
                        </td>
                        <td className="p-3 border-r border-slate-300 text-center text-slate-600">{res.maxMarks}</td>
                        <td className="p-3 border-r border-slate-300 text-center text-slate-600">{res.passMarks}</td>
                        <td className="p-3 border-r border-slate-300 text-center font-extrabold text-slate-900">
                          {res.marksObtained}
                        </td>
                        <td className="p-3 border-r border-slate-300 text-center font-black text-blue-600">
                          {res.grade}
                        </td>
                        <td className="p-3 text-slate-600">{res.remarks || 'Consistent performance'}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-extrabold text-slate-900">
                      <td className="p-3 border-r border-slate-300">Grand Total</td>
                      <td className="p-3 border-r border-slate-300 text-center">{reportCardModalData.summary.totalMaxMarks}</td>
                      <td className="p-3 border-r border-slate-300 text-center">—</td>
                      <td className="p-3 border-r border-slate-300 text-center text-blue-700">
                        {reportCardModalData.summary.totalMarksObtained}
                      </td>
                      <td className="p-3 border-r border-slate-300 text-center text-blue-700">
                        {reportCardModalData.summary.overallGrade}
                      </td>
                      <td className="p-3 font-black text-emerald-600">
                        {reportCardModalData.summary.status} ({reportCardModalData.summary.overallPercentage.toFixed(1)}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-16 grid grid-cols-3 gap-8 text-center text-xs text-slate-600 font-bold">
                <div className="border-t border-slate-400 pt-2">Class Teacher Signature</div>
                <div className="border-t border-slate-400 pt-2">Examination In-Charge</div>
                <div className="border-t border-slate-400 pt-2 font-black text-slate-900">
                  Principal Signature & School Seal
                </div>
              </div>

              {/* Print Action Bar */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Report Card</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-muted bg-surface-raised rounded-3xl border border-dashed border-border">
              <Award className="w-10 h-10 mx-auto mb-2 opacity-40 text-accent-blue" />
              <p className="font-semibold text-sm">Select a student and click "View Report Card" to generate.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE EXAM                                                     */}
      {/* ========================================================================= */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-extrabold text-primary">Create Examination Term</h3>
              <button
                onClick={() => setShowCreateExamModal(false)}
                className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-muted hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                try {
                  const newExam = await examService.createExam({
                    academicYearId: academicYears[0]?.id || '',
                    name: formData.get('name') as string,
                    term: formData.get('term') as string,
                    startDate: formData.get('startDate') as string,
                    endDate: formData.get('endDate') as string,
                  });
                  setExams([newExam, ...exams]);
                  setSelectedExam(newExam);
                  setShowCreateExamModal(false);
                  showToast('Exam created successfully!');
                } catch (err: any) {
                  showToast(err.response?.data?.message || 'Failed to create exam.', 'error');
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-primary block mb-1">Exam Title</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. Mid-Term Half Yearly Examination 2026"
                  className="w-full px-4 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Term</label>
                  <select
                    name="term"
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  >
                    <option value="Periodic Assessment 1">Periodic Assessment 1 (PA-1)</option>
                    <option value="Term 1 Half-Yearly">Term 1 Half-Yearly</option>
                    <option value="Periodic Assessment 2">Periodic Assessment 2 (PA-2)</option>
                    <option value="Annual Pre-Board">Annual Pre-Board</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Academic Year</label>
                  <select
                    name="academicYearId"
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  >
                    {academicYears.map((y) => (
                      <option key={y.id} value={y.id}>
                        {y.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateExamModal(false)}
                  className="px-4 py-2 rounded-2xl bg-surface-raised text-secondary font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-md hover:bg-brand-sky-dark transition-all"
                >
                  Save Exam
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD SUBJECT TO DATE SHEET                                       */}
      {/* ========================================================================= */}
      {showAddSubjectModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-extrabold text-primary">Schedule Subject in Date Sheet</h3>
                <p className="text-xs text-muted">{selectedExam.name}</p>
              </div>
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-muted hover:text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                try {
                  const newSlot = await examService.addExamSubject(selectedExam.id, {
                    classId: formData.get('classId') as string,
                    subjectId: formData.get('subjectId') as string,
                    examDate: formData.get('examDate') as string,
                    startTime: formData.get('startTime') as string,
                    endTime: formData.get('endTime') as string,
                    maxMarks: Number(formData.get('maxMarks') || 100),
                    passMarks: Number(formData.get('passMarks') || 33),
                    roomNumber: (formData.get('roomNumber') as string) || 'Hall 1',
                  });

                  // Update state
                  const updatedSubjects = [...(selectedExam.subjects || []), newSlot];
                  setSelectedExam({ ...selectedExam, subjects: updatedSubjects });
                  setShowAddSubjectModal(false);
                  showToast('Subject schedule added to date sheet!');
                } catch (err: any) {
                  showToast(err.response?.data?.message || 'Failed to schedule subject.', 'error');
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Class</label>
                  <select
                    name="classId"
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Subject</label>
                  <select
                    name="subjectId"
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">Exam Date</label>
                <input
                  type="date"
                  name="examDate"
                  required
                  className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue="09:00"
                    required
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue="12:00"
                    required
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Max Marks</label>
                  <input
                    type="number"
                    name="maxMarks"
                    defaultValue={100}
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Pass Marks</label>
                  <input
                    type="number"
                    name="passMarks"
                    defaultValue={33}
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-primary block mb-1">Room / Hall</label>
                  <input
                    type="text"
                    name="roomNumber"
                    defaultValue="Exam Hall A"
                    className="w-full px-3 py-2.5 bg-surface-raised border border-border rounded-2xl text-xs font-semibold text-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 rounded-2xl bg-surface-raised text-secondary font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-md hover:bg-brand-sky-dark transition-all"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
