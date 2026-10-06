/**
 * @file studentSubjectsData.ts
 * @description Comprehensive mock data model for Indian K-12 (CBSE/ICSE) Student Course Portals.
 * Contains chapter-wise notes, active and historical assignments with urgency indicators,
 * scheduled tests and detailed past assessment scorecards.
 */

export interface NoteMaterial {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  pages: number;
  uploadedDate: string;
  downloadUrl?: string;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  chapterName: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  description: string;
  notes: NoteMaterial[];
}

export interface Assignment {
  id: string;
  title: string;
  chapter: string;
  dueDate: string;
  dueCountdown: string;
  isUrgent: boolean;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  maxMarks: number;
  obtainedMarks?: number;
  submittedAt?: string;
  submissionFileName?: string;
  teacherFeedback?: string;
  description: string;
}

export interface TestItem {
  id: string;
  title: string;
  type: 'UNIT_TEST' | 'PERIODIC_ASSESSMENT' | 'CLASS_QUIZ' | 'MOCK_EXAM';
  date: string;
  time?: string;
  syllabus: string;
  totalMarks: number;
  obtainedMarks?: number;
  grade?: string;
  classAverage?: number;
  status: 'UPCOMING' | 'COMPLETED';
}

export interface TeacherInfo {
  name: string;
  role: string;
  email: string;
  room: string;
  doubtHours: string;
}

export interface StudentSubject {
  id: string;
  name: string;
  code: string;
  cbseCode: string;
  description: string;
  color: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
  weeklySessions: number;
  syllabusProgress: number;
  teacher: TeacherInfo;
  chapters: Chapter[];
  assignments: Assignment[];
  tests: TestItem[];
}

export const initialStudentSubjects: StudentSubject[] = [
  {
    id: 'sub_math',
    name: 'Mathematics',
    code: 'MATH-10',
    cbseCode: 'CBSE 041',
    description: 'Covers Algebra, Quadratic Equations, Coordinate Geometry, Trigonometry, and Statistics as per NCERT curriculum.',
    color: '#38BDF8',
    gradient: 'from-sky-400 to-sky-600',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    weeklySessions: 6,
    syllabusProgress: 75,
    teacher: {
      name: 'Amit Sharma Sir',
      role: 'Senior PGT Mathematics & Class Teacher',
      email: 'amit.sharma@dpa.edu',
      room: 'Room 201 (Science Block 2nd Floor)',
      doubtHours: 'Every Saturday, 08:30 AM – 10:00 AM',
    },
    chapters: [
      {
        id: 'math_ch1',
        chapterNumber: 1,
        chapterName: 'Real Numbers & Fundamental Theorem of Arithmetic',
        status: 'COMPLETED',
        description: 'Prime factorization, irrationality proofs, and HCF/LCM relations.',
        notes: [
          {
            id: 'n_m1',
            title: 'Real Numbers & Euclid’s Lemma Handwritten Mindmap',
            fileType: 'Handwritten PDF',
            fileSize: '2.1 MB',
            pages: 6,
            uploadedDate: '28 Mar 2026',
          },
          {
            id: 'n_m2',
            title: 'CBSE 10-Year Previous Years Solved Questions (Real Numbers)',
            fileType: 'Question Bank PDF',
            fileSize: '3.4 MB',
            pages: 14,
            uploadedDate: '30 Mar 2026',
          },
        ],
      },
      {
        id: 'math_ch2',
        chapterNumber: 2,
        chapterName: 'Polynomials & Geometric Meaning of Zeros',
        status: 'COMPLETED',
        description: 'Relationship between zeros and coefficients of quadratic polynomials.',
        notes: [
          {
            id: 'n_m3',
            title: 'Polynomials Formula Sheet & Graphing Shortcuts',
            fileType: 'Formula Sheet PDF',
            fileSize: '1.4 MB',
            pages: 4,
            uploadedDate: '05 Apr 2026',
          },
        ],
      },
      {
        id: 'math_ch3',
        chapterNumber: 3,
        chapterName: 'Pair of Linear Equations in Two Variables',
        status: 'COMPLETED',
        description: 'Graphical, Substitution, and Elimination methods with word problem models.',
        notes: [
          {
            id: 'n_m4',
            title: 'Linear Equations in Two Variables Complete Solution Manual',
            fileType: 'NCERT Exemplar PDF',
            fileSize: '4.2 MB',
            pages: 18,
            uploadedDate: '10 Apr 2026',
          },
        ],
      },
      {
        id: 'math_ch4',
        chapterNumber: 4,
        chapterName: 'Quadratic Equations (Current Unit)',
        status: 'IN_PROGRESS',
        description: 'Standard form, factorization, quadratic formula, discriminant (D = b² - 4ac), and nature of roots.',
        notes: [
          {
            id: 'n_m5',
            title: 'Quadratic Equations Formula Sheet & Discriminant Table',
            fileType: 'Quick Revision PDF',
            fileSize: '1.8 MB',
            pages: 5,
            uploadedDate: '15 Apr 2026',
          },
          {
            id: 'n_m6',
            title: 'Exercise 4.2 Step-by-Step Solved Proofs & Word Problems',
            fileType: 'Class Lecture Notes',
            fileSize: '2.7 MB',
            pages: 9,
            uploadedDate: '18 Apr 2026',
          },
        ],
      },
      {
        id: 'math_ch5',
        chapterNumber: 5,
        chapterName: 'Arithmetic Progressions (Upcoming Unit)',
        status: 'UPCOMING',
        description: 'nth term formula (an = a + (n-1)d) and sum of first n terms (Sn).',
        notes: [
          {
            id: 'n_m7',
            title: 'Arithmetic Progressions Intro Slide Deck & Formulas',
            fileType: 'Lecture Slides PDF',
            fileSize: '2.3 MB',
            pages: 11,
            uploadedDate: '20 Apr 2026',
          },
        ],
      },
    ],
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
        description: 'Solve questions 1 through 10 from NCERT Ex 4.2 in your mathematics notebook. Show all discriminant calculations and upload clear PDF scans.',
      },
      {
        id: 'asg_m2',
        title: 'Discriminant & Nature of Real Roots Worksheet',
        chapter: 'Chapter 4: Quadratic Equations',
        dueDate: 'Friday, Apr 25, 11:59 PM',
        dueCountdown: 'Due in 4 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 15,
        description: 'Analyze 12 quadratic equations, determine whether roots are distinct, equal or imaginary, and solve for k.',
      },
      {
        id: 'asg_m3',
        title: 'Pair of Linear Equations Graphical Word Problems',
        chapter: 'Chapter 3: Linear Equations',
        dueDate: '10 Apr 2026',
        dueCountdown: 'Submitted',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 20,
        obtainedMarks: 19,
        submittedAt: '09 Apr 2026, 07:15 PM',
        submissionFileName: 'Rahul_Sharma_Linear_Eq_Ex3.pdf',
        teacherFeedback: 'Outstanding step-by-step graphical method explanation! Clean scale and neat intersection coordinates.',
        description: 'Draw graphs for boat upstream/downstream and age problem models.',
      },
      {
        id: 'asg_m4',
        title: 'Real Numbers & Fundamental Theorem of Arithmetic Sheet',
        chapter: 'Chapter 1: Real Numbers',
        dueDate: '28 Mar 2026',
        dueCountdown: 'Submitted',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 20,
        obtainedMarks: 20,
        submittedAt: '27 Mar 2026, 06:40 PM',
        submissionFileName: 'Rahul_Sharma_Real_Numbers_HW.pdf',
        teacherFeedback: 'Flawless proof of irrationality for √5 and √3 + 2. Full marks awarded.',
        description: 'Complete 10 subjective questions verifying HCF × LCM = a × b.',
      },
    ],
    tests: [
      {
        id: 'q_m1',
        title: 'Periodic Assessment 1: Quadratic Equations & AP',
        type: 'PERIODIC_ASSESSMENT',
        date: '28 Apr 2026 (Next Tuesday)',
        time: '09:15 AM - 10:15 AM',
        syllabus: 'Chapter 4 (Quadratic Equations) & Chapter 5 (Arithmetic Progressions)',
        totalMarks: 25,
        status: 'UPCOMING',
      },
      {
        id: 'q_m2',
        title: 'Class Mock Test: Real Numbers & Polynomials',
        type: 'MOCK_EXAM',
        date: '02 Apr 2026',
        syllabus: 'Chapters 1 & 2 Complete',
        totalMarks: 30,
        obtainedMarks: 29,
        grade: 'A1',
        classAverage: 23.4,
        status: 'COMPLETED',
      },
      {
        id: 'q_m3',
        title: 'Unit Diagnostic Test 1 (Term 1 Baseline)',
        type: 'UNIT_TEST',
        date: '15 Mar 2026',
        syllabus: 'Bridge Course & Real Numbers',
        totalMarks: 50,
        obtainedMarks: 48,
        grade: 'A1',
        classAverage: 39.2,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_phy',
    name: 'Physics',
    code: 'PHY-10',
    cbseCode: 'CBSE 086',
    description: 'Explores Electricity, Heating Effects, Magnetic Fields, and Optics with mandatory practical experiments.',
    color: '#A855F7',
    gradient: 'from-purple-400 to-purple-600',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    weeklySessions: 5,
    syllabusProgress: 68,
    teacher: {
      name: 'Dr. Priya Patel',
      role: 'Senior PGT Physics & Science Department In-charge',
      email: 'priya.patel@dpa.edu',
      room: 'Science Lab 1 (Physics Laboratory)',
      doubtHours: 'Every Wednesday, 02:00 PM – 03:00 PM',
    },
    chapters: [
      {
        id: 'phy_ch10',
        chapterNumber: 10,
        chapterName: 'Light: Reflection and Refraction',
        status: 'COMPLETED',
        description: 'Spherical mirrors, mirror formula, refractive index, lens formula, and magnification.',
        notes: [
          {
            id: 'n_p1',
            title: 'Ray Optics & Lens Formula Summary Chart',
            fileType: 'Ray Diagrams PDF',
            fileSize: '3.1 MB',
            pages: 8,
            uploadedDate: '10 Apr 2026',
          },
        ],
      },
      {
        id: 'phy_ch11',
        chapterNumber: 11,
        chapterName: 'The Human Eye and the Colorful World',
        status: 'COMPLETED',
        description: 'Refraction through a prism, dispersion of light, atmospheric refraction, and scattering.',
        notes: [
          {
            id: 'n_p2',
            title: 'Human Eye Defects & Atmospheric Refraction Notes',
            fileType: 'Study Guide PDF',
            fileSize: '2.4 MB',
            pages: 7,
            uploadedDate: '14 Apr 2026',
          },
        ],
      },
      {
        id: 'phy_ch12',
        chapterNumber: 12,
        chapterName: 'Electricity (Current Active Unit)',
        status: 'IN_PROGRESS',
        description: 'Ohm’s law, factors affecting resistance, series and parallel combination, and Joule’s heating law.',
        notes: [
          {
            id: 'n_p3',
            title: 'Ohm’s Law Laboratory Manual & Circuit Schematics',
            fileType: 'Lab Manual PDF',
            fileSize: '5.4 MB',
            pages: 12,
            uploadedDate: '17 Apr 2026',
          },
          {
            id: 'n_p4',
            title: 'Combination of Resistors (Series/Parallel) Solved Numericals',
            fileType: 'Numerical Sheet PDF',
            fileSize: '1.9 MB',
            pages: 6,
            uploadedDate: '19 Apr 2026',
          },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg_p1',
        title: 'Ohm’s Law Verification & V-I Graph Analysis',
        chapter: 'Chapter 12: Electricity',
        dueDate: 'Wednesday, Apr 23, 04:00 PM',
        dueCountdown: 'Due in 2 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 15,
        description: 'Complete the laboratory observations table, calculate mean resistance R from slope V/I, and attach graph scan.',
      },
      {
        id: 'asg_p2',
        title: 'Ray Optics Sign Convention & Numerical Problems',
        chapter: 'Chapter 10: Light',
        dueDate: '08 Apr 2026',
        dueCountdown: 'Submitted',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 15,
        obtainedMarks: 14,
        submittedAt: '07 Apr 2026, 05:20 PM',
        submissionFileName: 'Rahul_Sharma_RayOptics_HW.pdf',
        teacherFeedback: 'Very neat ray diagrams! Remember to put direction arrows on all reflected rays.',
        description: 'Solve 6 concave mirror and convex lens focal length numericals.',
      },
    ],
    tests: [
      {
        id: 'q_p1',
        title: 'Electricity & Resistance Numerical Quiz',
        type: 'CLASS_QUIZ',
        date: '30 Apr 2026',
        time: '11:00 AM - 11:45 AM',
        syllabus: 'Electric current, potential difference, Ohm’s law and series/parallel networks',
        totalMarks: 20,
        status: 'UPCOMING',
      },
      {
        id: 'q_p2',
        title: 'Light Reflection & Refraction Unit Assessment',
        type: 'UNIT_TEST',
        date: '05 Apr 2026',
        syllabus: 'Chapter 10 complete with numericals',
        totalMarks: 25,
        obtainedMarks: 24,
        grade: 'A1',
        classAverage: 19.8,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_chem',
    name: 'Chemistry',
    code: 'CHEM-10',
    cbseCode: 'CBSE 086',
    description: 'Chemical reactions, balancing redox equations, acids, bases, salts, and properties of metals.',
    color: '#F59E0B',
    gradient: 'from-amber-400 to-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    weeklySessions: 4,
    syllabusProgress: 72,
    teacher: {
      name: 'Dr. Priya Patel',
      role: 'PGT Chemistry',
      email: 'priya.patel@dpa.edu',
      room: 'Science Lab 2 (Chemistry Laboratory)',
      doubtHours: 'Every Thursday, 02:00 PM – 03:00 PM',
    },
    chapters: [
      {
        id: 'chem_ch1',
        chapterNumber: 1,
        chapterName: 'Chemical Reactions and Equations',
        status: 'COMPLETED',
        description: 'Writing chemical equations, balanced reactions, precipitation, and redox mechanisms.',
        notes: [
          {
            id: 'n_c1',
            title: 'Chemical Reactions & Equations Balancing Master Sheet',
            fileType: 'Cheat Sheet PDF',
            fileSize: '2.5 MB',
            pages: 6,
            uploadedDate: '02 Apr 2026',
          },
        ],
      },
      {
        id: 'chem_ch2',
        chapterNumber: 2,
        chapterName: 'Acids, Bases and Salts (Current Active Unit)',
        status: 'IN_PROGRESS',
        description: 'Indicators, pH scale, chemical properties of acids and bases, and common salts in daily life.',
        notes: [
          {
            id: 'n_c2',
            title: 'Acids, Bases & Salts Reaction Tables & pH Color Matrix',
            fileType: 'Summary Notes PDF',
            fileSize: '3.1 MB',
            pages: 8,
            uploadedDate: '15 Apr 2026',
          },
        ],
      },
    ],
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
        submittedAt: '07 Apr 2026, 09:10 PM',
        submissionFileName: 'Rahul_Balancing_50_Eqs.pdf',
        teacherFeedback: 'Very thorough balancing of redox reactions. Good attention to physical states (s, l, g, aq).',
        description: 'Balance all redox and precipitation reactions from NCERT and exemplar exercises.',
      },
    ],
    tests: [
      {
        id: 'q_c1',
        title: 'Periodic Assessment: Chemical Equations & Acids',
        type: 'PERIODIC_ASSESSMENT',
        date: '04 May 2026',
        syllabus: 'Chapter 1 and Chapter 2 (up to salts preparation)',
        totalMarks: 25,
        status: 'UPCOMING',
      },
      {
        id: 'q_c2',
        title: 'Class Diagnostic Test on Chemical Reactions',
        type: 'CLASS_QUIZ',
        date: '04 Apr 2026',
        syllabus: 'Chapter 1',
        totalMarks: 25,
        obtainedMarks: 23,
        grade: 'A1',
        classAverage: 18.5,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_bio',
    name: 'Biology',
    code: 'BIO-10',
    cbseCode: 'CBSE 086',
    description: 'Fundamental biological processes including Nutrition, Respiration, Transportation, and Excretion.',
    color: '#10B981',
    gradient: 'from-emerald-400 to-emerald-600',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    weeklySessions: 4,
    syllabusProgress: 80,
    teacher: {
      name: 'Dr. Meera Deshmukh',
      role: 'Senior PGT Biology',
      email: 'meera.deshmukh@dpa.edu',
      room: 'Biology Lab 3',
      doubtHours: 'Every Tuesday, 01:15 PM – 02:00 PM',
    },
    chapters: [
      {
        id: 'bio_ch6',
        chapterNumber: 6,
        chapterName: 'Life Processes (Current Active Unit)',
        status: 'IN_PROGRESS',
        description: 'Autotrophic and heterotrophic nutrition, human digestive system, respiration, heart and nephrons.',
        notes: [
          {
            id: 'n_b1',
            title: 'Life Processes Complete Diagrams & Physiological Flowcharts',
            fileType: 'Diagram Guide PDF',
            fileSize: '6.1 MB',
            pages: 14,
            uploadedDate: '14 Apr 2026',
          },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg_b1',
        title: 'Nephron & Human Excretory System Diagram & Mechanism',
        chapter: 'Chapter 6: Life Processes',
        dueDate: '12 Apr 2026',
        dueCountdown: 'Submitted',
        isUrgent: false,
        status: 'GRADED',
        maxMarks: 10,
        obtainedMarks: 10,
        submittedAt: '11 Apr 2026, 04:30 PM',
        submissionFileName: 'Rahul_Nephron_Diagram.pdf',
        teacherFeedback: 'Flawlessly labeled diagram! Glomerular filtration and tubular reabsorption clearly detailed.',
        description: 'Draw and label the nephron structure and explain the 3 steps of urine filtration.',
      },
    ],
    tests: [
      {
        id: 'q_b1',
        title: 'Life Processes Nutrition & Respiration Unit Quiz',
        type: 'CLASS_QUIZ',
        date: '12 Apr 2026',
        syllabus: 'Chapter 6 Nutrition & Respiration',
        totalMarks: 20,
        obtainedMarks: 19,
        grade: 'A1',
        classAverage: 16.2,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_eng',
    name: 'English Literature & Language',
    code: 'ENG-10',
    cbseCode: 'CBSE 184',
    description: 'First Flight prose and poetry, Footprints without Feet supplementary reader, and formal writing skills.',
    color: '#F43F5E',
    gradient: 'from-rose-400 to-rose-600',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    weeklySessions: 5,
    syllabusProgress: 82,
    teacher: {
      name: 'Sunita Rao Ma’am',
      role: 'TGT English Literature Coordinator',
      email: 'sunita.rao@dpa.edu',
      room: 'Room 201',
      doubtHours: 'Every Friday, 02:00 PM – 03:00 PM',
    },
    chapters: [
      {
        id: 'eng_u1',
        chapterNumber: 1,
        chapterName: 'First Flight: Prose & Poetry Unit 1 & 2',
        status: 'COMPLETED',
        description: 'A Letter to God, Dust of Snow, Fire and Ice, and Nelson Mandela: Long Walk to Freedom.',
        notes: [
          {
            id: 'n_e1',
            title: 'Character Sketches & Central Theme Notes (First Flight)',
            fileType: 'Literature Notes PDF',
            fileSize: '1.8 MB',
            pages: 9,
            uploadedDate: '04 Apr 2026',
          },
        ],
      },
      {
        id: 'eng_u2',
        chapterNumber: 2,
        chapterName: 'Writing Skills & Grammar (Current Active Unit)',
        status: 'IN_PROGRESS',
        description: 'Formal letter to the editor, analytical paragraphs, reported speech, and determiners.',
        notes: [
          {
            id: 'n_e2',
            title: 'Formal Letter Formats & Sample Exemplars for CBSE 10',
            fileType: 'Format Template PDF',
            fileSize: '1.2 MB',
            pages: 5,
            uploadedDate: '12 Apr 2026',
          },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg_e1',
        title: 'Analytical Essay: The Ball Poem & Metaphor of Loss',
        chapter: 'First Flight — Poetry Unit 3',
        dueDate: 'Friday, Apr 25, 11:59 PM',
        dueCountdown: 'Due in 4 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 15,
        description: 'Write a 250-word critical evaluation on John Berryman’s poem exploring childhood loss, epistemology, and emotional resilience.',
      },
    ],
    tests: [
      {
        id: 'q_e1',
        title: 'Prose Comprehension & Poetry Unit Assessment',
        type: 'UNIT_TEST',
        date: '10 Apr 2026',
        syllabus: 'A Letter to God & Nelson Mandela + Grammar',
        totalMarks: 30,
        obtainedMarks: 28,
        grade: 'A1',
        classAverage: 24.1,
        status: 'COMPLETED',
      },
    ],
  },
  {
    id: 'sub_cs',
    name: 'Computer Applications (IT)',
    code: 'CS-10',
    cbseCode: 'CBSE 165',
    description: 'Basics of Information Technology, Cyber Ethics, and Python Programming Fundamentals.',
    color: '#6366F1',
    gradient: 'from-indigo-400 to-indigo-600',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    weeklySessions: 4,
    syllabusProgress: 85,
    teacher: {
      name: 'Rajesh Nair Sir',
      role: 'Head of IT & Computer Applications',
      email: 'rajesh.nair@dpa.edu',
      room: 'Computer Lab 3 (Senior IT Lab)',
      doubtHours: 'Every Monday, 02:00 PM – 03:00 PM',
    },
    chapters: [
      {
        id: 'cs_ch1',
        chapterNumber: 1,
        chapterName: 'Networking Fundamentals & Cyber Ethics',
        status: 'COMPLETED',
        description: 'Internet services, web servers, IP addressing, cookies, and digital privacy.',
        notes: [
          {
            id: 'n_cs1',
            title: 'Networking Concepts, Topologies & Cyber Law Summary',
            fileType: 'IT Notes PDF',
            fileSize: '2.2 MB',
            pages: 10,
            uploadedDate: '08 Apr 2026',
          },
        ],
      },
      {
        id: 'cs_ch2',
        chapterNumber: 2,
        chapterName: 'Python Programming Basics (Current Active Unit)',
        status: 'IN_PROGRESS',
        description: 'Variables, conditional if-elif-else structures, for/while loops, and list manipulation.',
        notes: [
          {
            id: 'n_cs2',
            title: 'Python Functions, Loops & List Comprehension Cheat Sheet',
            fileType: 'Coding Reference PDF',
            fileSize: '1.5 MB',
            pages: 8,
            uploadedDate: '15 Apr 2026',
          },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg_cs1',
        title: 'Python Pattern Printing & Loops Lab Exercise',
        chapter: 'Unit 2: Python Programming',
        dueDate: 'Thursday, Apr 24, 05:00 PM',
        dueCountdown: 'Due in 3 Days',
        isUrgent: false,
        status: 'PENDING',
        maxMarks: 20,
        description: 'Write Python programs for triangle number patterns, prime number checks, and fibonacci series. Upload .py or PDF solutions.',
      },
    ],
    tests: [
      {
        id: 'q_cs1',
        title: 'Python Coding Lab Assessment on Conditionals & Loops',
        type: 'UNIT_TEST',
        date: '02 May 2026',
        time: '10:15 AM - 11:45 AM',
        syllabus: 'Python basic syntax, conditionals, nested loops, and lists',
        totalMarks: 20,
        status: 'UPCOMING',
      },
      {
        id: 'q_cs2',
        title: 'Networking & Cyber Ethics Quiz',
        type: 'CLASS_QUIZ',
        date: '01 Apr 2026',
        syllabus: 'Unit 1 complete',
        totalMarks: 25,
        obtainedMarks: 25,
        grade: 'A1',
        classAverage: 20.8,
        status: 'COMPLETED',
      },
    ],
  },
];
