# 🏫 SchoolHub — Multi-Tenant School Management SaaS Platform

> **SchoolHub** is a production-ready, cloud-native, multi-tenant Software-as-a-Service (SaaS) platform built for modern K-12 educational institutions, schools, and CBSE/ICSE academy chains. It features complete data isolation per school tenant, role-based dashboards, automated fee collection, examination management, student digital almanacs, interactive teacher homework broadcasting, and live attendance tracking.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Feature Matrix by User Role](#-feature-matrix-by-user-role)
- [Technology Stack](#-technology-stack)
- [Database Schema & Multi-Tenancy](#-database-schema--multi-tenancy)
- [Directory Structure](#-directory-structure)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Environment Configuration](#-environment-configuration)
- [Core API Endpoints](#-core-api-endpoints)
- [Production Deployment Guide](#-production-deployment-guide)
- [License](#-license)

---

## 🏛️ Architectural Overview

SchoolHub follows a **Modular Monolith** pattern designed for high cohesion, strict domain separation, and rapid operational scalability without premature microservice complexity.

### Multi-Tenancy Isolation
- **Tenant Hierarchy**: Every school registered on the platform acts as an isolated tenant.
- **Data Boundary**: Implements a shared database + shared schema model with mandatory `schoolId` indexing on all tenant-scoped tables (`Student`, `Teacher`, `Class`, `Attendance`, `FeeInvoice`, `Assignment`, `Exam`, etc.).
- **Security & Authorization**: The centralized `requireTenant` middleware validates incoming request context and prevents Insecure Direct Object Reference (IDOR) attacks across school tenants.
- **Super Admin Boundary**: Platform owners have cross-tenant governance rights for subscription provisioning, tenant suspension, and platform analytics.

---

## 📊 System Architecture Diagram

```mermaid
graph TD
    Client["Web Browser / Mobile Viewport"] --> |"HTTPS / JSON / Cookies"| CDN["Cloudflare CDN & Edge Network"]
    CDN --> Frontend["React 19 + Vite Frontend SPA"]
    Frontend --> |"API Requests /api/v1"| ReverseProxy["Render / Nginx Web Service"]
    
    subgraph BackendEngine ["Express + TypeScript Modular Monolith"]
        ReverseProxy --> AuthMiddleware["JWT & Auth Middleware"]
        AuthMiddleware --> TenantMiddleware["Tenant Isolation Middleware (schoolId)"]
        TenantMiddleware --> RBAC["Role-Based Access Control"]
        
        RBAC --> ModuleAuth["Auth & User Module"]
        RBAC --> ModuleAcademic["Academics & CBSE Setup"]
        RBAC --> ModuleStudents["Student & Teacher Portals"]
        RBAC --> ModuleAttendance["Roll Call & Punch Engine"]
        RBAC --> ModuleAssignments["Homework & Assignment Engine"]
        RBAC --> ModuleFinance["Fee Invoicing & Payments"]
        RBAC --> ModuleExams["Exams & Grade Books"]
        RBAC --> ModuleUploads["Upload Service"]
    end

    subgraph DataCloudServices ["Data & Cloud Services"]
        BackendEngine --> |"Connection Pooling / TLS"| NeonDB[("Neon Serverless PostgreSQL")]
        ModuleUploads --> |"S3 Compatible API"| CloudflareR2[("Cloudflare R2 Object Storage")]
        ModuleFinance --> |"Webhooks & UPI"| Razorpay["Razorpay Payment Gateway"]
        BackendEngine --> |"Transactional SMTP"| Resend["Resend / SMTP Mailer"]
    end
```

---

## 🎯 Feature Matrix by User Role

### 👑 Platform Super Admin
- **Tenant Directory**: Real-time listing of all schools, subscription plans (`FREE`, `BASIC`, `PRO`, `ENTERPRISE`), domain identifiers, and account statuses.
- **Platform Analytics**: Monthly Recurring Revenue (MRR), total student enrollments across campuses, and system utilization metrics.
- **Tenant Lifecycle**: Instantly provision, suspend, or renew school tenant subscriptions.

### 🏫 School Administrator
- **1-Click CBSE Starter Pack**: Instantly populates standard CBSE Class 1 to Class 10 structures with core subject curriculums (Mathematics, Science, English, Hindi, Social Science).
- **Faculty & Student Admissions**: Comprehensive CRUD directories, admission numbers (`ADM-2026-XXXX`), section assignments, and contact records.
- **Fee Management & Invoicing**:
  - Itemized fee structures (Tuition, Computer Lab, Examination, Sports).
  - Bulk invoice generation per academic term.
  - Receipt generation (`REC-2026-XXXX`) with balance calculations.
- **Timetable Scheduler**: Configure weekly period slots (Monday through Saturday) with rooms, teachers, and timings.
- **Notice Board & Circulars**: Publish priority announcements (`URGENT`, `HIGH`, `NORMAL`) with PDF attachments.
- **Analytics & Report Generation**: One-click CSV exports for attendance defaulters, fee dues, and GPA rankings.

### 👨‍🏫 Teacher Portal
- **Daily Lecture Agenda**: Visual breakdown of assigned periods, classroom locations, and lecture times.
- **Interactive Roll Call**: 1-click attendance puncher with bulk "Mark All Present", absent reasons, and holiday flags.
- **Homework & Assignment Engine**:
  - Broadcast homework with class, section, and subject targeting.
  - Set submission deadlines and maximum grading scores.
  - Attach worksheets and question papers via Cloudflare R2 storage.
  - View "Recent Broadcasts" with live student submission counts.
- **Evaluation & Grading**: Review submitted student copies, input marks, and record teacher remarks.

### 🎓 Student & Parent Digital Almanac
- **Personal Academic Dashboard**:
  - Real-time attendance compliance gauge (minimum 75% CBSE requirement tracking).
  - Daily period timetable and room indicators.
  - Active homework checklist with urgency countdowns.
- **Classroom Portal ("My Subjects")**:
  - Subject-wise syllabus coverage, chapter notes, and teacher contact cards.
  - **Homework Submission Dialog**: Upload completed homework documents (PDF, DOCX, JPG, PNG) directly to Cloudflare R2.
- **Fee Ledger & Payments**:
  - Outstanding dues, installment schedules, and breakdown of tuition items.
  - Instant online UPI QR-code payment flow.
  - Download verified payment receipts with transaction IDs.
- **Exams & Report Cards**:
  - Examination schedules, downloadable admit cards, and CBSE term report cards with GPA calculation.

### 📚 Additional Integrated Utilities
- **Library Catalog & Circulation**:
  - Inventory search by Title, Author, Category, and ISBN.
  - Interactive "Add Book" modal.
  - "Issue Book" modal with borrowing periods (7, 14, 30 days) and automated stock decrement.
  - Issued Books Register with one-click "Return Book" restoration.
- **In-App Messaging & Department Chat**:
  - Real-time conversation threads between faculty leads, administrative desks, and parents.
  - Contact search, delivery timestamps, and online status indicators.
- **Daylight / Night Owl Theme System**:
  - Instant Dark Mode contrast switcher powered by semantic CSS custom properties and `localStorage` persistence.

---

## 🛠️ Technology Stack

### Frontend
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) | Modern reactive user interface with sub-second HMR |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type checking and interface contracts |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Semantic CSS variable tokens, daylight/dark mode themes |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) | Fluid micro-interactions, layout transitions, and entrance effects |
| **State & Data** | [TanStack React Query](https://tanstack.com/query) | Server state synchronization, caching, and mutation handling |
| **Icons & Visuals**| [Lucide React](https://lucide.dev/) + [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Accessible feather icons & delight celebrations |
| **Analytics** | [Recharts](https://recharts.org/) | Interactive bar, area, and pie charts |

### Backend
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | [Node.js 22 LTS](https://nodejs.org/) | High-performance asynchronous JavaScript engine |
| **Framework** | [Express 4](https://expressjs.com/) | RESTful HTTP routing architecture |
| **ORM & DB** | [Prisma 7](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) | Type-safe schema migrations, queries, and pooling |
| **Database Host**| [Neon](https://neon.tech/) | Serverless PostgreSQL with auto-scaling connection pooling |
| **Authentication**| [JWT](https://jwt.io/) + [bcryptjs](https://www.npmjs.com/package/bcryptjs) | HttpOnly cookie storage (`SameSite=None`, `Secure`) |
| **Validation** | [Zod 3](https://zod.dev/) | Runtime request body and parameter validation schemas |
| **Storage** | [Cloudflare R2](https://www.cloudflare.com/products/r2/) via AWS S3 SDK | S3-compatible, zero-egress cloud object storage |
| **Security** | [Helmet](https://helmetjs.github.io/) + [CORS](https://www.npmjs.com/package/cors) | Security headers, CSRF mitigations, cross-origin white-listing |

---

## 🗄️ Database Schema & Multi-Tenancy

The PostgreSQL database contains **22 normalized models** designed for relational integrity:

```text
Platform & Tenancy:
├── School               (Tenant master, status, domain, trial dates)
├── User                 (System credentials, role, schoolId)
├── SubscriptionPlan     (Platform pricing tiers & feature flags)

Academic Structure:
├── AcademicYear         (Sessions, e.g., 2026-2027, isCurrent flag)
├── Class                (Grade levels 1 through 12)
├── Section              (A, B, C batches with capacity limits)
├── Subject              (Theory & Practical subject codes)
├── ClassSubject         (Class-Subject-Teacher mapping)

People:
├── Student              (Admission details, roll numbers, guardian metadata)
├── Teacher              (Faculty profiles, designations, joining dates)
├── Parent               (Guardian relationships and contact details)

Daily Operations:
├── Attendance           (Section-level roll call container)
├── AttendanceRecord     (Per-student PRESENT, ABSENT, LATE, EXCUSED status)
├── Timetable            (Day-wise period schedules with room numbers)
├── Assignment           (Homework, title, due dates, max marks, worksheets)
├── AssignmentSubmission (Student answer files, grades, feedback)

Examinations:
├── Exam                 (Term examinations, date sheets, academic year)
├── ExamSubject          (Subject maximum & passing thresholds)
├── ExamResult           (Student marks obtained, letter grades, remarks)

Finance:
├── FeeStructure         (Itemized annual fees per class)
├── FeeInvoice           (Student term fee statements, dues, discounts)
├── FeePayment           (Verified UPI/Cash transaction receipts)

Communications & Media:
├── Announcement         (Notice board circulars with audience filters)
├── Notification         (In-app alerts)
├── Document             (Cloudflare R2 metadata and file URLs)
```

---

## 📁 Directory Structure

```text
School_Mangement_System/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema models & enums
│   │   └── seed.ts             # Comprehensive CBSE seed dataset
│   ├── src/
│   │   ├── config/             # Zod environment configuration & validation
│   │   ├── db/                 # Prisma client instance with pg adapter
│   │   ├── middleware/         # Auth, Tenant isolation, RBAC, Error, Logging
│   │   ├── modules/            # Domain modules (auth, schools, academics,
│   │   │                       # students, teachers, attendance, assignments,
│   │   │                       # finance, exams, timetable, uploads, reports)
│   │   ├── utils/              # JWT helpers, API responses, passwords
│   │   ├── app.ts              # Express configuration & route mounting
│   │   └── server.ts           # HTTP server bootstrap & graceful shutdown
│   └── package.json
│
├── frontend/
│   ├── public/                 # Static assets, SVG favicons, icons
│   ├── src/
│   │   ├── components/         # Reusable UI & feature components
│   │   │   ├── common/         # Buttons, Badges, Modals, Loaders
│   │   │   ├── features/       # Attendance, Finance, Dashboard views
│   │   │   └── layout/         # Sidebar, Header, AppLayout
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Landing, Login, Dashboard, Subjects,
│   │   │                       # Attendance, Finance, Timetable, Exams,
│   │   │                       # Announcements, Calendar, OtherPages
│   │   ├── services/           # Typed Axios API services
│   │   ├── types/              # Domain TypeScript interfaces
│   │   ├── App.tsx             # Route declarations & auth guards
│   │   └── index.css           # Tailwind v4 theme tokens
│   └── package.json
│
├── docs/                       # Architecture specifications & wireframes
├── docker-compose.yml          # Containerized local environment
└── README.md
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v20 or v22 LTS
- **npm**: v10+
- **PostgreSQL**: Local PostgreSQL 15+ or a free [Neon](https://neon.tech/) cloud instance

### 1. Clone the Repository
```bash
git clone https://github.com/somcpp/School_Mangement_System.git
cd School_Mangement_System
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
```
Update `.env` with your PostgreSQL database URL and JWT secrets (see [Environment Configuration](#-environment-configuration)).

### 3. Install Backend Dependencies & Seed Database
```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 4. Start the Backend Development Server
```bash
npm run dev
# Server listening on http://localhost:5000/api/v1
```

### 5. Install Frontend Dependencies & Start App
In a new terminal window:
```bash
cd ../frontend
npm install
npm run dev
# Frontend live at http://localhost:5173
```

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)

```env
# Server
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# PostgreSQL Connection String (Neon / Supabase / Local)
DATABASE_URL="postgresql://user:password@host.neon.tech/neondb?sslmode=require"

# JWT Secrets (Minimum 16 characters each)
JWT_ACCESS_SECRET="your_super_secret_jwt_access_key_min_16_chars"
JWT_REFRESH_SECRET="your_super_secret_jwt_refresh_key_min_16_chars"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
COOKIE_DOMAIN="localhost"

# Super Admin Seed
SUPER_ADMIN_EMAIL="superadmin@platform.com"
SUPER_ADMIN_PASSWORD="SuperAdmin@Secure123!"
SUPER_ADMIN_NAME="Platform Super Admin"

# Cloudflare R2 / AWS S3 Object Storage
STORAGE_DRIVER=s3
AWS_ACCESS_KEY_ID="your_r2_access_key_id"
AWS_SECRET_ACCESS_KEY="your_r2_secret_access_key"
AWS_REGION="auto"
AWS_S3_BUCKET="school-management-files"
AWS_S3_ENDPOINT="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
AWS_S3_PUBLIC_URL="https://pub-xxxxxxxx.r2.dev"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID="rzp_test_xxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Transactional Email (Resend / SMTP)
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASS="re_xxxxxxxxxxxx"
SMTP_FROM="SchoolHub <notifications@schoolhub.edu>"
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```
*(In production, set `VITE_API_BASE_URL` to your live Render backend URL, e.g. `https://schoolhub-backend.onrender.com/api/v1`)*.

---

## 📡 Core API Endpoints

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & receive HttpOnly cookies |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clear session tokens |
| `GET`  | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile |
| `GET`  | `/api/v1/schools` | Super Admin | List all school tenants |
| `POST` | `/api/v1/schools` | Super Admin | Provision a new school tenant |
| `POST` | `/api/v1/academics/starter-pack` | School Admin | 1-Click setup of Classes 1-10 & CBSE subjects |
| `GET`  | `/api/v1/students` | Admin / Teacher | Directory of enrolled students |
| `GET`  | `/api/v1/attendance` | Admin / Teacher | Roll call records by class & section |
| `POST` | `/api/v1/attendance/punch` | Admin / Teacher | Bulk punch daily student attendance |
| `GET`  | `/api/v1/assignments` | All Authenticated | Filter assignments by class/subject |
| `POST` | `/api/v1/assignments` | Teacher / Admin | Broadcast class homework with deadline |
| `POST` | `/api/v1/assignments/:id/submit`| Student | Submit completed homework copy |
| `GET`  | `/api/v1/finance/invoices` | Admin / Student | Fee invoices and balance statements |
| `POST` | `/api/v1/finance/payments` | Admin / Student | Record payment transaction receipt |
| `GET`  | `/api/v1/exams` | All Authenticated | Examination schedules & mark entry |
| `POST` | `/api/v1/uploads` | Authenticated | Upload document/worksheet to Cloudflare R2 |
| `GET`  | `/api/v1/reports/attendance` | Admin | Attendance analytics & defaulters report |

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Cloudflare Pages)
1. In Cloudflare Dashboard, go to **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ Connect GitHub repository.
2. Configure Build Settings:
   - **Framework preset**: `Vite`
   - **Root directory**: `frontend`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://<YOUR_RENDER_BACKEND>.onrender.com/api/v1`
4. Click **Save and Deploy**. Cloudflare automatically handles global edge caching and SPA routing.

### Backend Deployment (Render)
1. In [Render](https://dashboard.render.com/), click **New** $\rightarrow$ **Web Service** $\rightarrow$ Select repository.
2. Configure Service Settings:
   - **Name**: `schoolhub-backend`
   - **Region**: `Ohio (US East)` *(Matches Neon US-East DB for low latency)*
   - **Root directory**: `backend`
   - **Runtime**: `Node`
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
3. Add Environment Variables (from your backend `.env`):
   - Set `NODE_ENV=production`
   - Set `DATABASE_URL` to your Neon PostgreSQL connection string
   - Set `CORS_ORIGIN` to your Cloudflare Pages domain (e.g. `https://schoolhub.pages.dev`)
   - Set `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and Cloudflare R2 credentials.
4. Deploy the service.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE). Built for educational excellence.
