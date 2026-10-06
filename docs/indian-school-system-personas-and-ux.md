# Indian K-12 School Management System — Persona Research & UX Architecture

> **Purpose:** Comprehensive analysis of Indian schooling dynamics (CBSE, ICSE, State Boards), stakeholder personas, strict role-based data boundaries, and bespoke dashboard specifications.
> **Date:** October 2026

---

## 🇮🇳 1. Indian Schooling Ecosystem & Operational Realities

Indian schools operate on distinct regulatory frameworks, calendar cycles, and cultural workflows that differ fundamentally from Western K-12 software models.

### Key Characteristics of Indian Schools:
1. **Board Affiliations:**
   - **CBSE (Central Board of Secondary Education):** Emphasizes Continuous and Comprehensive Evaluation (CCE), Periodic Assessments (PA-1, PA-2, Half Yearly, Pre-Boards, Board Exams), and the strict **75% minimum attendance rule** for Board exam admit card eligibility.
   - **CISCE / ICSE:** Extensive subject-wise practicals, internal assessment weightages, and project files.
   - **State Boards:** Vernacular language mediums, state scholarship registers, and specific fee concession schemes.
2. **Student Identity in Indian Classrooms:**
   - **Roll Number:** Daily classroom identifier (1 to 45).
   - **Admission No. / Scholar Register No. (SRN / GR No.):** Permanent institutional ID.
   - **APAAR ID / DigiLocker Integration:** One Nation One Student ID mandated by the Ministry of Education.
   - **Class & Section:** e.g., *Class 10-A*, *Class 11-PCM*, *Class 12-Commerce*.
   - **House System:** Inter-house cultural/sports divisions (e.g., *Tagore House (Red)*, *Ashoka House (Blue)*, *Shivaji House (Yellow)*, *Raman House (Green)*).
3. **Academic & Financial Cycles:**
   - **Academic Year:** Starts in **April** and concludes in **March** (or June–May in parts of South India).
   - **Quarterly Fee Installments (₹ INR):**
     - **Q1 (Apr–Jun):** Annual charges + Tuition fee + Lab fee + Transport fee.
     - **Q2 (Jul–Sep):** Tuition fee + Term 1 Examination fee.
     - **Q3 (Oct–Dec):** Tuition fee + Winter activity fee.
     - **Q4 (Jan–Mar):** Tuition fee + Final Board/Annual exam fee.
   - **Payment Modes:** UPI (PhonePe, Google Pay, Paytm), NetBanking, Cash at School Counter, or Cheque/Challan.
4. **Day-to-Day Communication Patterns:**
   - **School Almanac / Digital Diary:** Class teachers note daily homework, remarks on discipline, uniform violations, or absent notes.
   - **PTM (Parent-Teacher Meeting):** Quarterly mandatory parent visits to sign report cards.
   - **Circulars / Notice Board:** Holiday notices (Diwali break, Summer vacation, Winter break), examination date sheets, and urgent weather alerts.

---

## 👥 2. Persona Breakdown & UX Visibility Matrix

| Feature / Data Point | 👑 Super Admin | 🏫 School Admin (Principal) | 👨‍🏫 Teacher | 🎓 Student | 👨‍👩‍👧 Parent |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **SaaS MRR / Platform ARR** | ✅ Full Access | ❌ No | ❌ No | ❌ No | ❌ No |
| **All Schools Tenant List** | ✅ Full Access | ❌ No | ❌ No | ❌ No | ❌ No |
| **School Revenue & Total Ledger (₹)** | ❌ No | ✅ Full Access | ❌ No | ❌ No | ❌ No |
| **School Fee Collection & Dues** | ❌ No | ✅ Full Access | ❌ No | ❌ (Own only if allowed) | ✅ Child's Due Only |
| **Staff Payroll & Teacher Salaries** | ❌ No | ✅ Full Access | ❌ (Own Slip only) | ❌ No | ❌ No |
| **Student Admission & TC Issuance** | ❌ No | ✅ Full Access | ❌ No | ❌ No | ❌ No |
| **Mark Class Attendance** | ❌ No | ✅ Full Access | ✅ Assigned Classes | ❌ No | ❌ No |
| **Personal Attendance % & 75% Badge**| ❌ No | ❌ Summary % | ❌ Own Attendance | ✅ My Attendance % | ✅ Child's Attendance % |
| **Daily Homework & Classwork** | ❌ No | ❌ View Only | ✅ Create / Grade | ✅ View & Submit | ✅ View & Monitor |
| **Timetable & Daily Schedule** | ❌ No | ✅ Master Grid | ✅ Teacher Timetable | ✅ Class Timetable | ✅ Child's Schedule |
| **Exam Marks Entry** | ❌ No | ✅ Approve / Publish | ✅ Subject Teacher Entry | ❌ No | ❌ No |
| **Report Card & Grades** | ❌ No | ✅ Full School | ✅ Class Section | ✅ My Report Card | ✅ Child's Report Card |
| **Digital Diary & Teacher Remarks** | ❌ No | ✅ Audit Log | ✅ Write Remarks | ✅ Read Remarks | ✅ Read & Acknowledge |

---

## 🎨 3. Detailed Dashboard Specifications by Role

### 🎓 Persona 1: The Student (`STUDENT`)
**Real-World Context:** Rahul Sharma is a Class 10-A student preparing for CBSE board examinations. He needs to know today's lectures, pending homework, whether his attendance is safely above 75%, and upcoming unit tests.

#### 🚫 What Students Must NEVER See:
- Total school revenue or tuition collected from the entire student body ($1.6M / ₹2.5 Cr).
- Total hours taught by school staff or teacher salary lists.
- Other students' private fee arrears or disciplinary audit logs.

#### ✅ What the Student Dashboard MUST Contain:
1. **Hero Banner:**
   - Greeting: `"Namaste, Rahul Sharma! 📚 Class 10-A | Roll No: 24 | Tagore House"`
   - Sub-badges: `CBSE Board Candidate` • `Class Teacher: Amit Sharma Sir`
2. **4 Student-Centric Stat Cards:**
   - **Card 1 (Attendance %):** `88.4%` (Pill: `Safe >75% CBSE Threshold` in Mint Green)
   - **Card 2 (Pending Homework):** `3 Due` (Pill: `2 Due Tomorrow` in Soft Yellow)
   - **Card 3 (Next Examination):** `Math Mock Test` (Pill: `In 8 Days (Apr 18)` in Soft Lilac)
   - **Card 4 (Class Performance / GPA):** `91.2% Aggregate` (Pill: `Grade A1 • Rank 4th` in Sky Blue)
3. **Primary Visualizations & Widgets:**
   - **Today's Class Schedule (Period 1 to 6):** Time, Subject, Teacher Name, Room/Lab number, and Current Period Highlight.
   - **Subject-wise Performance Radar/Bar:** Physics (88%), Chemistry (82%), Math (95%), English (90%), CS (96%).
   - **Homework & Project Deadlines List:** Actionable checklist with submission upload button.
   - **Almanac / Teacher Remarks:** Positive remarks and reminders from class teachers.
   - **Recent Test Scores & Downloadable Report Cards.**

---

### 👨‍🏫 Persona 2: The Teacher / Class Teacher (`TEACHER`)
**Real-World Context:** Amit Sharma is a Senior PGT Mathematics teacher and Class Teacher for Class 10-A. His day revolves around taking morning roll call, conducting 4 lectures across Class 10 and 11, assigning homework, and grading mock test papers.

#### 🚫 What Teachers Must NEVER See:
- School-wide financial balance sheets, profit margins, or tuition revenue collections.
- Super Admin platform infrastructure or other schools' data.

#### ✅ What the Teacher Dashboard MUST Contain:
1. **Hero Banner:**
   - Greeting: `"Good Morning, Amit Sir! 👨‍🏫 Class Teacher: Class 10-A | Senior PGT Math"`
   - Sub-badges: `4 Lectures Scheduled Today` • `Next: Period 2 (Physics Lab at 09:15 AM)`
2. **4 Teacher-Centric Stat Cards:**
   - **Card 1 (Today's Attendance Status):** `Class 10-A: Marked (39/42 Present)`
   - **Card 2 (Classes Today):** `4 Periods` (Pill: `1 Lab Session` in Sky Blue)
   - **Card 3 (Pending Grading):** `28 Homeworks` (Pill: `Calculus Assignment #3` in Soft Yellow)
   - **Card 4 (Syllabus Progress):** `68% Covered` (Pill: `On Track for Term 1` in Mint Green)
3. **Primary Visualizations & Widgets:**
   - **Quick Roll Call / Attendance Puncher:** 1-click button to take Class 10-A morning attendance.
   - **Teacher's Daily Lecture Agenda:** Ordered timeline of today's periods with room and topic tags.
   - **Weekly Teaching Hours Spline Curve:** Visualizing lecture hours vs target.
   - **Quick Homework Publisher:** Modal to assign homework with file attachments and due date.
   - **Defaulter Alerts:** Students with attendance <75% or unsubmitted assignments.

---

### 🏫 Persona 3: School Admin / Principal (`SCHOOL_ADMIN`)
**Real-World Context:** Principal Dr. Sunita Mehra manages Delhi Public Academy (3,250 students, 140 faculty). She oversees campus discipline, academic syllabus completion, fee collection targets for Q1, staff presence, and CBSE board compliance.

#### ✅ What the School Admin Dashboard MUST Contain:
1. **Hero Banner:**
   - Greeting: `"Delhi Public Academy • Operational Dashboard"`
   - Sub-badges: `Affiliation: CBSE #1930482` • `Academic Year: 2026-27 (Term 1)`
2. **4 Institutional Stat Cards (in ₹ INR):**
   - **Card 1 (Total Student Strength):** `3,250 Students` (Pill: `+120 New Admissions`)
   - **Card 2 (Today's Campus Attendance):** `94.2% Present` (Pill: `3,061 / 3,250 Students`)
   - **Card 3 (Staff on Duty):** `134 / 140 Teachers` (Pill: `6 on Approved Leave`)
   - **Card 4 (Q1 Fee Collection):** `₹1,42,80,000` (Pill: `78% Target Achieved` in Mint Green)
3. **Primary Visualizations & Widgets:**
   - **Class-wise Attendance & Discipline Donut:** Campus-wide average breakdown.
   - **Monthly Fee Collection vs Outstanding Ledger:** Bar chart of collected fees vs pending dues by class.
   - **Academic Syllabus Health:** Department-wise completion rates (Math, Science, Humanities).
   - **Critical Action Items:** Pending admission approvals, staff leave requests, fee reminder broadcast button.

---

### 👨‍👩‍👧 Persona 4: The Parent / Guardian (`PARENT`)
**Real-World Context:** Mr. Ramesh Sharma (Rahul's father) uses the school app to track his son's daily attendance, pay quarterly school fees via UPI, see report cards, and communicate with the class teacher.

#### ✅ What the Parent Dashboard MUST Contain:
1. **Hero Banner:**
   - Greeting: `"Welcome, Parent of Rahul Sharma 🎓 Class 10-A"`
   - Sub-badges: `Delhi Public Academy` • `Roll No: 24` • `House: Tagore`
2. **4 Parent-Centric Stat Cards:**
   - **Card 1 (Child's Attendance):** `88.4%` (Pill: `4 Days Absent This Term`)
   - **Card 2 (Fee Due for Q1):** `₹14,500 Due` (Pill: `Due by 30 April 2026` in Rose)
   - **Card 3 (Recent Exam Percentage):** `91.2%` (Pill: `Term 1 Mock Test`)
   - **Card 4 (Next PTM / Event):** `Saturday, Apr 28` (Pill: `Slot: 10:30 AM`)
3. **Primary Visualizations & Widgets:**
   - **Instant Fee Payment Card:** 1-Click `"Pay via UPI / NetBanking"` button with instant fee receipt PDF download.
   - **Monthly Attendance Heatmap:** Green/Red calendar dots showing Rahul's presence.
   - **Teacher's Digital Diary:** Remarks and notes from teachers regarding class performance or homework.
   - **Bus / Transport Status:** Route details and driver contact.
   - **Apply Student Leave:** Form to submit medical or casual leave with attachment to the Class Teacher.

---

### 👑 Persona 5: Super Admin (SaaS Platform Owner) (`SUPER_ADMIN`)
**Real-World Context:** SaaS Platform Owner managing multiple school subscriptions across India (Delhi Public Academy, Ryan International, St. Xavier's, etc.).

#### ✅ What the Super Admin Dashboard MUST Contain:
1. **Hero Banner:**
   - Greeting: `"SchoolHub SaaS Platform Control Center"`
   - Sub-badges: `Production Cluster` • `PostgreSQL 17 • Multi-Tenant Isolated`
2. **4 SaaS Business Metric Cards (in ₹ INR):**
   - **Card 1 (Active School Tenants):** `14 Schools` (Pill: `+3 Onboarding`)
   - **Card 2 (Total Platform MRR):** `₹24,50,000 / mo` (Pill: `+18% MoM Growth`)
   - **Card 3 (Total Active Platform Users):** `42,800 Users` (Students, Staff, Parents)
   - **Card 4 (System Uptime & DB Health):** `99.98%` (Pill: `0 Critical Alerts`)
3. **Primary Visualizations & Widgets:**
   - **Tenant School Onboarding Table:** School Name, City, Affiliation (CBSE/ICSE), Student Count, Plan Tier (Growth/Enterprise), MRR, Status.
   - **Monthly SaaS Revenue Trend:** MRR/ARR growth graph.
   - **Subscription Plan Distribution:** Starter vs Growth vs Enterprise breakdown.

---

## 🛠️ 4. Technical Implementation & UI Refactoring Plan

### Phase 1: Create Role-Specific Dashboard Views
Refactor `DashboardPage.tsx` into a smart container that renders the exact bespoke dashboard matching `user.role`:
- `StudentDashboardView` (Roll No, Class, 75% Attendance Pill, Homework, Test Scores)
- `TeacherDashboardView` (Today's Lecture Agenda, Quick Roll Call, Grading queue, Syllabus tracker)
- `ParentDashboardView` (Child's profile, Instant UPI Fee payment, Attendance heatmap, Diary remarks)
- `SchoolAdminDashboardView` (Total Student Strength, Campus Attendance, ₹ INR Fee collection, Staff presence)
- `SuperAdminDashboardView` (Multi-tenant SaaS metrics, MRR in ₹, Active schools)

### Phase 2: Currency & Formatting Localization
- Replace all generic dollar symbols (`$`) with Indian Rupee (`₹`).
- Implement Indian numbering formatter (`₹1,42,80,000` instead of `$1,428,000`).
- Use standard Indian school terminology (*Class 10-A*, *Roll No*, *Admission No*, *PTM*, *Term 1 / Pre-Boards*, *House*).
