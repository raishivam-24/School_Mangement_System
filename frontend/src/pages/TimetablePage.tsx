/**
 * @file TimetablePage.tsx
 * @description Interactive weekly timetable grid with role isolation, vibrant pastel color palettes,
 * student-exclusive schedule lock, and period detail modal.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  Download,
  Printer,
  Filter,
  Sparkles,
  BookOpen,
  MapPin,
  User,
  X,
  ExternalLink,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PeriodSlot {
  periodNum: number;
  time: string;
  subject: string;
  code: string;
  room: string;
  teacher: string;
  teacherRole?: string;
  topic?: string;
  colorClass: string;
  badgeClass: string;
  borderClass: string;
}

export const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Role isolation check: Students and Parents only see their enrolled class timetable
  const isStudent = user?.role === 'STUDENT' || user?.role === 'PARENT';
  const [selectedClass, setSelectedClass] = useState('Class 10 - Section A');
  const [activeSlot, setActiveSlot] = useState<PeriodSlot | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['08:30 - 09:15', '09:15 - 10:00', '10:15 - 11:00', '11:00 - 11:45', '12:30 - 01:15', '01:15 - 02:00'];

  // Current day helper (defaulting to Monday for school schedule demo)
  const currentDayIndex = new Date().getDay(); // 1 = Monday
  const todayName = days[Math.max(0, Math.min(5, currentDayIndex === 0 ? 0 : currentDayIndex - 1))];

  const schedule: Record<string, PeriodSlot[]> = {
    Monday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Mathematics',
        code: 'MATH-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Senior PGT Mathematics',
        topic: 'Chapter 4: Quadratic Equations & Nature of Roots',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'Physics Lab',
        code: 'PHY-10',
        room: 'Science Lab 1',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Physics',
        topic: 'Verification of Ohm’s Law & Resistance Curve',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400 ring-2 ring-purple-300/60',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'English Lit',
        code: 'ENG-10',
        room: 'Room 201',
        teacher: 'Sunita Rao Ma’am',
        teacherRole: 'TGT English',
        topic: 'The Ball Poem: Metaphors & Symbolic Analysis',
        colorClass: 'bg-rose-50/90 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800',
        borderClass: 'border-rose-200 hover:border-rose-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'Chemistry',
        code: 'CHEM-10',
        room: 'Science Lab 2',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Chemistry',
        topic: 'Chapter 2: Acids, Bases & pH Indicators',
        colorClass: 'bg-amber-50/90 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800',
        borderClass: 'border-amber-200 hover:border-amber-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Computer Sci',
        code: 'CS-10',
        room: 'Computer Lab 3',
        teacher: 'Rajesh Nair Sir',
        teacherRole: 'Head of IT Department',
        topic: 'Python Conditionals & Loops Coding Exercise',
        colorClass: 'bg-indigo-50/90 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800',
        borderClass: 'border-indigo-200 hover:border-indigo-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Physical Edu',
        code: 'PE-10',
        room: 'Sports Complex',
        teacher: 'Vikram Seth Sir',
        teacherRole: 'Director of Physical Education',
        topic: 'Athletics, Track Warmup & Badminton Drills',
        colorClass: 'bg-teal-50/90 text-teal-900',
        badgeClass: 'bg-teal-100 text-teal-800',
        borderClass: 'border-teal-200 hover:border-teal-400',
      },
    ],
    Tuesday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Physics',
        code: 'PHY-10',
        room: 'Room 201',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Physics',
        topic: 'Electric Potential & Circuit Numericals',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'Mathematics',
        code: 'MATH-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Senior PGT Mathematics',
        topic: 'Quadratic Formula Word Problems Problem Set 4.3',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'Computer Sci',
        code: 'CS-10',
        room: 'Computer Lab 3',
        teacher: 'Rajesh Nair Sir',
        teacherRole: 'Head of IT Department',
        topic: 'List Slicing & String Methods in Python',
        colorClass: 'bg-indigo-50/90 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800',
        borderClass: 'border-indigo-200 hover:border-indigo-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'English Lit',
        code: 'ENG-10',
        room: 'Room 201',
        teacher: 'Sunita Rao Ma’am',
        teacherRole: 'TGT English',
        topic: 'Formal Letter Writing to the Editor',
        colorClass: 'bg-rose-50/90 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800',
        borderClass: 'border-rose-200 hover:border-rose-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Biology',
        code: 'BIO-10',
        room: 'Biology Lab 3',
        teacher: 'Dr. Meera Deshmukh',
        teacherRole: 'PGT Biology',
        topic: 'Human Excretory System & Nephron Architecture',
        colorClass: 'bg-emerald-50/90 text-emerald-900',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        borderClass: 'border-emerald-200 hover:border-emerald-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Library Hour',
        code: 'LIB-10',
        room: 'Central Library',
        teacher: 'Anand Roy Sir',
        teacherRole: 'Chief Librarian',
        topic: 'Reference Reading & Project Journal Consultation',
        colorClass: 'bg-slate-100/90 text-slate-800',
        badgeClass: 'bg-slate-200 text-slate-700',
        borderClass: 'border-slate-200 hover:border-slate-400',
      },
    ],
    Wednesday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Mathematics',
        code: 'MATH-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Senior PGT Mathematics',
        topic: 'Arithmetic Progressions Introduction & General Term',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'English Lit',
        code: 'ENG-10',
        room: 'Room 201',
        teacher: 'Sunita Rao Ma’am',
        teacherRole: 'TGT English',
        topic: 'Grammar: Reported Speech & Dialogue Transformation',
        colorClass: 'bg-rose-50/90 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800',
        borderClass: 'border-rose-200 hover:border-rose-400',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'Chemistry Lab',
        code: 'CHEM-10',
        room: 'Science Lab 2',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Chemistry',
        topic: 'Salt Analysis & Precipitation Reactions Experiment',
        colorClass: 'bg-amber-50/90 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800',
        borderClass: 'border-amber-200 hover:border-amber-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'Chemistry Lab',
        code: 'CHEM-10',
        room: 'Science Lab 2',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Chemistry',
        topic: 'Observation Log Recording & Neutralization Tests',
        colorClass: 'bg-amber-50/90 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800',
        borderClass: 'border-amber-200 hover:border-amber-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Social Science',
        code: 'SST-10',
        room: 'Room 201',
        teacher: 'Kavita Sen Ma’am',
        teacherRole: 'TGT Social Sciences',
        topic: 'The Rise of Nationalism in Europe (History Ch 1)',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Art & Design',
        code: 'ART-10',
        room: 'Studio B',
        teacher: 'Pooja Hegde Ma’am',
        teacherRole: 'Fine Arts Coordinator',
        topic: 'Perspective Sketching & Charcoal Still Life',
        colorClass: 'bg-orange-50/90 text-orange-900',
        badgeClass: 'bg-orange-100 text-orange-800',
        borderClass: 'border-orange-200 hover:border-orange-400',
      },
    ],
    Thursday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Biology',
        code: 'BIO-10',
        room: 'Biology Lab 3',
        teacher: 'Dr. Meera Deshmukh',
        teacherRole: 'PGT Biology',
        topic: 'Life Processes: Transportation in Human Beings',
        colorClass: 'bg-emerald-50/90 text-emerald-900',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        borderClass: 'border-emerald-200 hover:border-emerald-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'Physics',
        code: 'PHY-10',
        room: 'Science Lab 1',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Physics',
        topic: 'Joule’s Law of Heating & Electrical Power Formulas',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'Mathematics',
        code: 'MATH-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Senior PGT Mathematics',
        topic: 'Sum of First n Terms of an AP (Derivation & Ex 5.2)',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'English Lit',
        code: 'ENG-10',
        room: 'Room 201',
        teacher: 'Sunita Rao Ma’am',
        teacherRole: 'TGT English',
        topic: 'Nelson Mandela: Long Walk to Freedom Reading',
        colorClass: 'bg-rose-50/90 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800',
        borderClass: 'border-rose-200 hover:border-rose-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Computer Sci',
        code: 'CS-10',
        room: 'Computer Lab 3',
        teacher: 'Rajesh Nair Sir',
        teacherRole: 'Head of IT Department',
        topic: 'Python Nested Loops & Patterns Programming',
        colorClass: 'bg-indigo-50/90 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800',
        borderClass: 'border-indigo-200 hover:border-indigo-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Music & Drama',
        code: 'MUS-10',
        room: 'Auditorium',
        teacher: 'Suman Roy Sir',
        teacherRole: 'Performing Arts Head',
        topic: 'Indian Classical Vocal Scales & Annual Day Choir',
        colorClass: 'bg-amber-50/90 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800',
        borderClass: 'border-amber-200 hover:border-amber-400',
      },
    ],
    Friday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Mathematics',
        code: 'MATH-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Senior PGT Mathematics',
        topic: 'Doubt Clearing & CBSE Board Exemplar Questions',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'Physics',
        code: 'PHY-10',
        room: 'Science Lab 1',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'PGT Physics',
        topic: 'Magnetic Effects of Electric Current (Ch 13 intro)',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'Social Science',
        code: 'SST-10',
        room: 'Room 201',
        teacher: 'Kavita Sen Ma’am',
        teacherRole: 'TGT Social Sciences',
        topic: 'Federalism & Power Sharing Mechanisms in India',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'English Lit',
        code: 'ENG-10',
        room: 'Room 201',
        teacher: 'Sunita Rao Ma’am',
        teacherRole: 'TGT English',
        topic: 'Analytical Paragraph Writing & Evaluation Rubric',
        colorClass: 'bg-rose-50/90 text-rose-900',
        badgeClass: 'bg-rose-100 text-rose-800',
        borderClass: 'border-rose-200 hover:border-rose-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Sports / PE',
        code: 'PE-10',
        room: 'Main Playground',
        teacher: 'Vikram Seth Sir',
        teacherRole: 'Director of Physical Education',
        topic: 'Inter-House Football Practice Match (Tagore vs Shivaji)',
        colorClass: 'bg-teal-50/90 text-teal-900',
        badgeClass: 'bg-teal-100 text-teal-800',
        borderClass: 'border-teal-200 hover:border-teal-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Club Activities',
        code: 'ACT-10',
        room: 'Activity Hall',
        teacher: 'Club Mentors',
        teacherRole: 'Extracurricular Faculty',
        topic: 'Robotics, MUN Debate & Science Innovation Club',
        colorClass: 'bg-amber-50/90 text-amber-900',
        badgeClass: 'bg-amber-100 text-amber-800',
        borderClass: 'border-amber-200 hover:border-amber-400',
      },
    ],
    Saturday: [
      {
        periodNum: 1,
        time: '08:30 - 09:15',
        subject: 'Weekly Quiz',
        code: 'ASSESS-10',
        room: 'Room 201',
        teacher: 'Amit Sharma Sir',
        teacherRole: 'Class Teacher',
        topic: 'Weekly 25-Mark Assessment (Maths & Science)',
        colorClass: 'bg-sky-50/90 text-sky-900',
        badgeClass: 'bg-sky-100 text-sky-800',
        borderClass: 'border-sky-200 hover:border-sky-400',
      },
      {
        periodNum: 2,
        time: '09:15 - 10:00',
        subject: 'Doubt Clearing',
        code: 'TUTOR-10',
        room: 'Room 201',
        teacher: 'Dr. Priya Patel',
        teacherRole: 'Science Faculty',
        topic: 'Open Session: Numerical & Formula Clarifications',
        colorClass: 'bg-purple-50/90 text-purple-900',
        badgeClass: 'bg-purple-100 text-purple-800',
        borderClass: 'border-purple-200 hover:border-purple-400',
      },
      {
        periodNum: 3,
        time: '10:15 - 11:00',
        subject: 'Robotics Club',
        code: 'ROBO-10',
        room: 'Makerspace Lab',
        teacher: 'Rajesh Nair Sir',
        teacherRole: 'IT Head',
        topic: 'Arduino Microcontroller & Sensor Interfacing',
        colorClass: 'bg-indigo-50/90 text-indigo-900',
        badgeClass: 'bg-indigo-100 text-indigo-800',
        borderClass: 'border-indigo-200 hover:border-indigo-400',
      },
      {
        periodNum: 4,
        time: '11:00 - 11:45',
        subject: 'Yoga & Wellness',
        code: 'YOGA-10',
        room: 'Yoga Hall',
        teacher: 'Suman Roy Sir',
        teacherRole: 'Wellness Instructor',
        topic: 'Pranayama, Mindfulness & Posture Exercises',
        colorClass: 'bg-emerald-50/90 text-emerald-900',
        badgeClass: 'bg-emerald-100 text-emerald-800',
        borderClass: 'border-emerald-200 hover:border-emerald-400',
      },
      {
        periodNum: 5,
        time: '12:30 - 01:15',
        subject: 'Dispersal & Bus',
        code: 'BUS-10',
        room: 'Campus Gate',
        teacher: 'Transport In-charge',
        teacherRole: 'Logistics Team',
        topic: 'Safe Boarding & Student Roll Count',
        colorClass: 'bg-slate-100/90 text-slate-800',
        badgeClass: 'bg-slate-200 text-slate-700',
        borderClass: 'border-slate-200 hover:border-slate-400',
      },
      {
        periodNum: 6,
        time: '01:15 - 02:00',
        subject: 'Faculty Meeting',
        code: 'FAC-10',
        room: 'Staff Room',
        teacher: 'Staff Only',
        teacherRole: 'Administration',
        topic: 'Weekly Academic Review & Progress Audit',
        colorClass: 'bg-slate-100/90 text-slate-800',
        badgeClass: 'bg-slate-200 text-slate-700',
        borderClass: 'border-slate-200 hover:border-slate-400',
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & EXPORT ACTIONS                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>{isStudent ? 'My Class Timetable' : 'Class Timetable & Schedule'}</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-sky-light text-brand-sky-dark">
              Term 1 (2026–27)
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isStudent
              ? 'Your personalized weekly academic schedule with period timings, teacher rooms, and subject classrooms.'
              : 'Weekly class periods, lab sessions, and assigned subject teachers across all school sections.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Timetable</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Exporting Official CBSE Timetable PDF...')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ROLE-AWARE SECTION CONTROLLER                                         */}
      {/* ========================================================================= */}
      {isStudent ? (
        /* Dedicated Student Banner: Strictly locks timetable to student's enrolled section */
        <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50/50 p-5 rounded-3xl border border-sky-100 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-sky text-white flex items-center justify-center shadow-glow-sky shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-800">
                  Class 10 - Section A • My Schedule
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-mint-light text-brand-mint-dark">
                  Tagore House (Red)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-lilac-light text-brand-lilac-dark">
                  Roll No: 24
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Class Teacher: <strong className="text-slate-700">Amit Sharma Sir</strong> • Room 201 • 36 Periods / Week
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => navigate('/my-subjects')}
              className="px-4 py-2 rounded-2xl bg-white border border-sky-200 text-brand-sky-dark font-bold text-xs hover:bg-sky-50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-brand-sky" />
              <span>Go to My Subjects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Admin & Faculty Section Switcher */
        <div className="bg-surface p-4 rounded-3xl border border-slate-100 shadow-card flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 mr-1">Select Section:</span>
            {['Class 10 - Section A', 'Class 10 - Section B', 'Class 11 - Science A', 'Class 12 - Science A'].map((cls) => (
              <button
                type="button"
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  selectedClass === cls
                    ? 'bg-brand-sky text-white shadow-soft'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">Viewing 6 Daily Periods</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEEKLY TIMETABLE GRID                                                  */}
      {/* ========================================================================= */}
      <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr>
              <th className="py-3.5 px-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50/80 rounded-l-2xl w-36">
                Day / Period
              </th>
              {times.map((t, i) => (
                <th
                  key={i}
                  className={`py-3.5 px-3 text-xs font-extrabold uppercase tracking-wider text-slate-600 bg-slate-50/80 text-center ${
                    i === times.length - 1 ? 'rounded-r-2xl' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-brand-sky" />
                    <span>Period {i + 1}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{t}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {days.map((day) => {
              const isToday = day === todayName;

              return (
                <tr
                  key={day}
                  className={`transition-colors ${
                    isToday ? 'bg-sky-50/30 font-medium' : 'hover:bg-slate-50/40'
                  }`}
                >
                  {/* Day Column */}
                  <td className="py-4 px-4 font-bold text-sm text-slate-800 align-middle">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isToday ? 'text-brand-sky' : 'text-slate-400'}`} />
                      <span className={isToday ? 'text-brand-sky-dark font-extrabold' : ''}>{day}</span>
                    </div>
                    {isToday && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-sky-light text-brand-sky-dark">
                        TODAY
                      </span>
                    )}
                  </td>

                  {/* Period Slots */}
                  {schedule[day]?.map((period, idx) => {
                    const isLivePeriod = isToday && period.periodNum === 2;

                    return (
                      <td key={idx} className="p-2 align-top">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveSlot(period)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative shadow-sm hover:shadow-md ${period.colorClass} ${period.borderClass}`}
                        >
                          {/* Live pulse for current period */}
                          {isLivePeriod && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-brand-sky text-white shadow-sm animate-pulse flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> LIVE
                            </span>
                          )}

                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold opacity-75">{period.code}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${period.badgeClass}`}>
                              P{period.periodNum}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs leading-snug tracking-tight line-clamp-1">{period.subject}</h4>

                          <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] opacity-85">
                            <span className="truncate max-w-[85px] font-semibold">{period.teacher}</span>
                            <span className="font-bold px-1.5 py-0.5 rounded bg-white/60 text-[9px]">
                              {period.room}
                            </span>
                          </div>
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 4. PERIOD DETAILS MODAL DIALOG                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeSlot && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${activeSlot.colorClass}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {activeSlot.code} • Period {activeSlot.periodNum}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{activeSlot.subject}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSlot(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-brand-sky" />
                    <span className="font-medium">Period Timing:</span>
                  </div>
                  <span className="font-bold text-slate-800">{activeSlot.time} (45 mins)</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-brand-sky" />
                    <span className="font-medium">Faculty Instructor:</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 block">{activeSlot.teacher}</span>
                    <span className="text-[10px] text-slate-400">{activeSlot.teacherRole}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-brand-sky" />
                    <span className="font-medium">Classroom / Lab Location:</span>
                  </div>
                  <span className="font-bold text-slate-800">{activeSlot.room}</span>
                </div>

                {activeSlot.topic && (
                  <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-1">
                    <span className="text-[10px] font-bold text-brand-sky-dark uppercase tracking-wider block">
                      Current Chapter / Lesson Plan
                    </span>
                    <p className="font-semibold text-slate-800">{activeSlot.topic}</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSlot(null)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                {isStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      const subjectMap: Record<string, string> = {
                        'Mathematics': 'sub_math',
                        'Physics': 'sub_phy',
                        'Physics Lab': 'sub_phy',
                        'Chemistry': 'sub_chem',
                        'Chemistry Lab': 'sub_chem',
                        'Biology': 'sub_bio',
                        'English Lit': 'sub_eng',
                        'Computer Sci': 'sub_cs',
                      };
                      const targetId = subjectMap[activeSlot.subject] || 'sub_math';
                      setActiveSlot(null);
                      navigate(`/my-subjects/${targetId}`);
                    }}
                    className="px-6 py-2.5 rounded-full bg-brand-sky text-white font-bold text-xs shadow-soft hover:bg-brand-sky-dark transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open {activeSlot.subject} Classroom</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
