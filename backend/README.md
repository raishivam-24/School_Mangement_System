# School Management System — Backend

A production-ready, modular-monolith multi-tenant School Management SaaS backend built with **Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL**.

---

## 🚀 Key Features

* **Multi-Tenancy & Isolation:** Shared database/shared schema with explicit tenant (`schoolId`) enforcement on all tenant-owned entities.
* **Authentication & RBAC:** Secure JWT authentication supporting both **HttpOnly Cookies** and **Authorization: Bearer** headers, token rotation, and role-based guards (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
* **Comprehensive Academic Structure:** Academic years, classes, sections, subjects, class-subject-teacher mappings, and historical enrollments.
* **Academic Operations:** Daily attendance roster & batch marking, class/teacher timetables, homework & assignment submissions with grading, exams & student report card generation.
* **Dual Finance System:** Itemized fee structures, bulk invoice generation, partial payments, receipts, outstanding ledger, and platform SaaS subscription tracking.
* **Aggregated Dashboards:** Purpose-built aggregation endpoints for Super Admin and School Admin matching the UI wireframe specifications.
* **Postman Collection Included:** Full Postman v2.1 collection with automatic token extraction and environment variables.

---

## 🛠️ Quick Start

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and configure your local PostgreSQL database URL:
```bash
cp .env.example .env
```

Ensure `DATABASE_URL` in `.env` points to your running PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/school_management_db?schema=public"
```

### 2. Run Database Migrations & Seed Data
```bash
# Push schema to PostgreSQL database
npm run prisma:push

# Seed initial Super Admin, demo school, classes, demo teacher, student, and invoices
npm run prisma:seed
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start at: `http://localhost:5000/api/v1`
Health check: `http://localhost:5000/health`

---

## 🔑 Demo Seed Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@platform.com` | `SuperAdmin@Secure123!` |
| **School Admin** | `admin@dpa.edu` | `Admin@Secure123!` |
| **Teacher** | `amit.sharma@dpa.edu` | `Teacher@Secure123!` |
| **Student** | `rahul.sharma@dpa.edu` | `Student@Secure123!` |

---

## 📬 Postman Setup

1. Open Postman.
2. Click **Import** and select:
   * Collection: `postman/School_Management_SaaS.postman_collection.json`
   * Environment: `postman/School_Management_Local.postman_environment.json`
3. Select the **School Management Local Dev** environment in the top right.
4. Run `1. Authentication -> Login - Super Admin` or `Login - School Admin`. The token and school ID will be saved automatically for all subsequent requests!

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/          # Zod typed environment configs
│   ├── db/              # Prisma singleton instance
│   ├── middleware/      # Auth (Cookies + Bearer), Tenant isolation, RBAC, Validation, Error Handler
│   ├── modules/
│   │   ├── auth/         # Login, Refresh, Logout, Me, Password
│   │   ├── schools/      # Super Admin school tenant management
│   │   ├── academics/    # Years, Classes, Sections, Subjects
│   │   ├── students/     # Student admissions, profiles & summaries
│   │   ├── teachers/     # Teacher profiles & subject assignments
│   │   ├── attendance/   # Daily attendance rosters & submissions
│   │   ├── finance/      # Fee structures, invoices, payment collection
│   │   ├── examinations/ # Exams, subject schedules, marks & report cards
│   │   ├── timetable/    # Weekly class & teacher schedules
│   │   ├── assignments/  # Homework tasks, submissions, grading
│   │   ├── announcements/# School notices with role-targeting
│   │   ├── dashboards/   # Aggregated analytics for platform & school
│   │   └── reports/      # Attendance & fee collection reports
│   ├── utils/           # ApiResponse, AppError, JWT, Password, Pagination
│   ├── app.ts           # Express application configuration
│   └── server.ts        # Server entry point with graceful shutdown
├── prisma/
│   ├── schema.prisma    # Multi-tenant Prisma schema with composite indexes
│   └── seed.ts          # Comprehensive database seeder
├── postman/             # Postman Collection & Environment JSON
├── package.json
└── tsconfig.json
```
