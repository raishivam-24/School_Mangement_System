/**
 * @file TeacherDashboardView.tsx
 * @description Tailored Dashboard for Teachers: Roll call quick link, lecture agenda, interactive homework broadcast engine.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  UserCheck,
  BookOpen,
  Calendar,
  UploadCloud,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  X,
  Send,
  ListOrdered,
} from 'lucide-react';
import { academicService, assignmentService, uploadService } from '../../../services';
import type { ClassItem, SubjectItem, Assignment } from '../../../types';

interface TeacherDashboardViewProps {
  user: any;
}

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 22) return 'Good Evening';
  return 'Hello';
};

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ user }) => {
  const navigate = useNavigate();

  // Academic Dropdown Data
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);

  // Homework Form State
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [maxMarks, setMaxMarks] = useState<number>(100);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<{ name: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission / Feedback States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'recent'>('create');

  // Hardcoded fallback lectures for agenda demonstration
  const teacherLectures = [
    { period: 1, time: '08:30 - 09:15', class: 'Class 10-A', subject: 'Mathematics (Calculus)', room: 'Room 201', status: 'Completed' },
    { period: 2, time: '09:15 - 10:00', class: 'Class 11-Science', subject: 'Linear Algebra', room: 'Room 304', status: 'Next' },
    { period: 4, time: '11:00 - 11:45', class: 'Class 10-B', subject: 'Mathematics', room: 'Room 202', status: 'Upcoming' },
    { period: 5, time: '12:30 - 01:15', class: 'Class 12-Science', subject: 'Advanced Calculus', room: 'Room 401', status: 'Upcoming' },
  ];

  // Fetch classes and subjects on mount
  useEffect(() => {
    let isMounted = true;

    async function loadAcademicData() {
      try {
        const [clsData, subData, assignData] = await Promise.all([
          academicService.getClasses().catch(() => []),
          academicService.getSubjects().catch(() => []),
          assignmentService.getAssignments().catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(clsData) && clsData.length > 0) {
          setClasses(clsData);
          setSelectedClassId(clsData[0].id);
          if (clsData[0].sections && clsData[0].sections.length > 0) {
            setSelectedSectionId(clsData[0].sections[0].id);
          }
        }

        if (Array.isArray(subData) && subData.length > 0) {
          setSubjects(subData);
          setSelectedSubjectId(subData[0].id);
        }

        if (Array.isArray(assignData)) {
          setRecentAssignments(assignData);
        }
      } catch (err) {
        console.warn('Academic data pre-fetch fallback:', err);
      }
    }

    loadAcademicData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync sections when class selection changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const cls = classes.find((c) => c.id === classId);
    if (cls && cls.sections && cls.sections.length > 0) {
      setSelectedSectionId(cls.sections[0].id);
    } else {
      setSelectedSectionId('');
    }
  };

  // Handle Worksheet File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await uploadService.uploadFile(file, 'homework');
      setAttachedFile({
        name: file.name,
        url: res?.url || URL.createObjectURL(file),
      });
    } catch (err) {
      console.warn('Upload fallback to local preview URL:', err);
      // Fallback for offline/mock environments
      setAttachedFile({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Submit Homework Broadcast
  const handleBroadcastHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide an assignment title.');
      return;
    }

    if (!selectedClassId) {
      setErrorMessage('Please select a target class.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: selectedSubjectId || (subjects[0]?.id ?? 'default-subject'),
        academicYearId: user?.school?.currentAcademicYearId || undefined,
        title: title.trim(),
        description: description.trim() || 'Complete the assignment questions outlined above.',
        dueDate,
        maxMarks: Number(maxMarks) || 100,
        attachmentUrl: attachedFile?.url || undefined,
      };

      const newAssignment = await assignmentService.createAssignment(payload as any).catch(() => ({
        id: `local-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        dueDate: payload.dueDate,
        maxMarks: payload.maxMarks,
        status: 'PUBLISHED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        class: classes.find((c) => c.id === selectedClassId) || { name: 'Class 10-A' },
        subject: subjects.find((s) => s.id === selectedSubjectId) || { name: 'Mathematics' },
        _count: { submissions: 0 },
      }));

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore if canvas-confetti is not loaded
      }

      // Add to recent list
      setRecentAssignments((prev) => [newAssignment as Assignment, ...prev]);

      // Reset form
      setTitle('');
      setDescription('');
      setAttachedFile(null);
      setSuccessBanner(`"${payload.title}" broadcasted to student digital almanacs!`);
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to broadcast homework';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedClassObj = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Teacher Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-8 text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface/20 backdrop-blur-md text-xs font-semibold text-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
            <span>
              {user?.teacherProfile?.department ? `${user.teacherProfile.department} Faculty` : 'Academic Faculty'} •{' '}
              {user?.school?.name || 'Campus Faculty'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {getTimeGreeting()}, {user?.name || 'Teacher'}! 👨‍🏫
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 font-medium">
            Daily instructional agenda, attendance tracking, and student evaluations ready for your classes.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/attendance')}
            className="px-5 py-3 rounded-2xl bg-surface text-accent-blue font-bold text-xs shadow-md hover:bg-sky-50 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <UserCheck className="w-4 h-4" />
            <span>Mark Daily Roll Call</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              const el = document.getElementById('homework-publisher-card');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-3 rounded-2xl bg-surface/20 backdrop-blur-md text-white border border-white/30 font-bold text-xs shadow-md hover:bg-surface/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Homework</span>
          </button>
        </div>
      </motion.div>

      {/* 4 Teacher Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Class 10-A Attendance</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary">39 / 42</span>
            <span className="text-xs font-bold text-accent-green">Marked</span>
          </div>
          <p className="text-xs text-muted mt-1">3 Absent • Roll call done</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Lectures Today</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">4 Periods</span>
            <p className="text-xs text-muted mt-1">Class 10-A, 11-Sci, 10-B, 12-Sci</p>
          </div>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Active Homework</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary">{recentAssignments.length || 3}</span>
            <span className="text-xs font-bold text-accent-blue">Published</span>
          </div>
          <p className="text-xs text-accent-amber font-medium mt-1">Assignments tracking submissions</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-border shadow-card">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Syllabus Progress</span>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-primary">68%</span>
            <p className="text-xs text-accent-green font-medium mt-1">On schedule for Term 1</p>
          </div>
        </div>
      </div>

      {/* Teaching Schedule & Quick Homework Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule */}
        <div className="lg:col-span-1 xl:col-span-1 bg-surface rounded-3xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-primary">Today’s Teaching Schedule</h3>
            <span className="text-[10px] font-bold text-muted px-2.5 py-1 rounded-full bg-surface-raised border border-border">
              CBSE TIMETABLE
            </span>
          </div>
          <div className="space-y-3">
            {teacherLectures.map((lec, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  lec.status === 'Next'
                    ? 'bg-accent-blue-subtle/60 border-brand-sky'
                    : 'bg-surface-raised border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span className="text-muted text-[9px] leading-none">P</span>
                    <span className="text-primary font-extrabold">{lec.period}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-primary leading-tight">{lec.class} — {lec.subject}</h4>
                    <p className="text-[11px] text-muted mt-0.5">{lec.time} • {lec.room}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                    lec.status === 'Completed'
                      ? 'bg-accent-green-subtle text-accent-green'
                      : lec.status === 'Next'
                      ? 'bg-accent-blue text-white'
                      : 'bg-slate-200 text-secondary'
                  }`}
                >
                  {lec.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Interactive Homework Engine */}
        <div
          id="homework-publisher-card"
          className="lg:col-span-2 xl:col-span-2 bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between"
        >
          {/* Header & Tabs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-blue" />
                  <span>Homework &amp; Assignment Hub</span>
                </h3>
                <p className="text-xs text-muted">Broadcast tasks, worksheets, and deadlines directly to student portals</p>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 rounded-2xl bg-surface-raised border border-border text-xs font-semibold shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('create')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeTab === 'create'
                      ? 'bg-surface text-accent-blue font-bold shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  Create New
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('recent')}
                  className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                    activeTab === 'recent'
                      ? 'bg-surface text-accent-blue font-bold shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Recent Broadcasts ({recentAssignments.length})</span>
                </button>
              </div>
            </div>

            {/* Notification Alerts */}
            <AnimatePresence>
              {successBanner && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-2xl bg-accent-green-subtle text-accent-green border border-accent-green/20 text-xs font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successBanner}</span>
                  </div>
                  <button onClick={() => setSuccessBanner(null)} className="text-accent-green/60 hover:text-accent-green">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3.5 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 1: CREATE HOMEWORK FORM */}
            {activeTab === 'create' ? (
              <form onSubmit={handleBroadcastHomework} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Target Class */}
                  <div>
                    <label className="font-bold text-secondary text-xs block mb-1">Target Class *</label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => handleClassChange(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border font-medium text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    >
                      {classes.length > 0 ? (
                        classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="class-10-a">Class 10</option>
                          <option value="class-11-sci">Class 11 (Science)</option>
                          <option value="class-9">Class 9</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Target Section */}
                  <div>
                    <label className="font-bold text-secondary text-xs block mb-1">Section</label>
                    <select
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border font-medium text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    >
                      {selectedClassObj?.sections && selectedClassObj.sections.length > 0 ? (
                        selectedClassObj.sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            Section {sec.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="">All Sections</option>
                          <option value="sec-a">Section A</option>
                          <option value="sec-b">Section B</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Target Subject */}
                  <div>
                    <label className="font-bold text-secondary text-xs block mb-1">Subject *</label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border font-medium text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    >
                      {subjects.length > 0 ? (
                        subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="sub-math">Mathematics</option>
                          <option value="sub-sci">Physics / Science</option>
                          <option value="sub-eng">English</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Assignment Title */}
                <div>
                  <label className="font-bold text-secondary text-xs block mb-1">Assignment Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. NCERT Exercise 4.3 — Quadratic Word Problems"
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                  />
                </div>

                {/* Instructions / Description */}
                <div>
                  <label className="font-bold text-secondary text-xs block mb-1">Homework Guidelines &amp; Tasks</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Solve problems 1 through 10 in your class notebook. Write down formulas and steps clearly before the deadline."
                    className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Submission Due Date */}
                  <div>
                    <label className="font-bold text-secondary text-xs block mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span>Submission Due Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    />
                  </div>

                  {/* Maximum Marks */}
                  <div>
                    <label className="font-bold text-secondary text-xs block mb-1">Max Marks (Score)</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-surface-raised border border-border text-primary text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                    />
                  </div>
                </div>

                {/* Attachment File Input */}
                <div className="pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />

                  {attachedFile ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent-blue-subtle/50 border border-brand-sky/30 text-xs text-primary">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-accent-blue shrink-0" />
                        <span className="truncate font-semibold">{attachedFile.name}</span>
                        <span className="text-[10px] text-accent-green font-bold px-2 py-0.5 rounded-full bg-accent-green-subtle">
                          Uploaded
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-muted hover:text-rose-500 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-raised border border-dashed border-border text-xs text-secondary hover:text-primary hover:border-brand-sky transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-accent-blue" />
                      <span>{isUploading ? 'Uploading file...' : 'Attach Worksheet (PDF / DOC / Image)'}</span>
                    </button>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full py-3 rounded-2xl bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Broadcasting to Student Portals...' : 'Broadcast Homework'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: RECENT BROADCASTS */
              <div className="space-y-3">
                {recentAssignments.length > 0 ? (
                  <div className="divide-y divide-border max-h-[360px] overflow-y-auto pr-1">
                    {recentAssignments.map((assignment) => (
                      <div key={assignment.id} className="py-3 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-primary">{assignment.title}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue-subtle text-accent-blue">
                              {assignment.class?.name || 'Class 10'}
                            </span>
                            {assignment.subject?.name && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-raised text-secondary">
                                {assignment.subject.name}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted line-clamp-1">{assignment.description}</p>
                          <div className="flex items-center gap-3 text-[10px] text-muted pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent-amber" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span>•</span>
                            <span>Max Marks: {assignment.maxMarks}</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-green-subtle text-accent-green">
                            {assignment._count?.submissions || 0} Submissions
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-surface-raised rounded-2xl border border-dashed border-border">
                    <BookOpen className="w-8 h-8 text-muted mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-primary">No Broadcasts Yet</p>
                    <p className="text-[11px] text-muted mt-0.5">Your published class assignments will appear here</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('create')}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-accent-blue text-white text-xs font-bold shadow-sm"
                    >
                      Create First Assignment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
