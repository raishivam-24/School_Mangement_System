# School Management System — Project Architecture & Product Specification

## 1. Project Overview

The project is a **multi-tenant School Management SaaS platform**.

The platform is intended to serve multiple independent schools from one application. A platform-level Super Admin manages schools, subscriptions, platform usage, and overall system data. Each school operates within its own tenant boundary and has its own administrators, teachers, students, academic data, financial data, documents, and settings.

The system should be built with a strong backend/domain foundation first. The initial implementation should favor a **modular monolith** over premature microservices. The architecture should leave clear domain boundaries so individual modules can later be extracted or scaled independently if real usage justifies it.

### Core technology direction

- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Frontend: React + TypeScript (to be specified separately in the future)
- Initial architecture: Modular monolith
- Deployment: Container-friendly and cloud-ready
- Multi-tenancy: Shared PostgreSQL database/schema with explicit tenant (`schoolId`) isolation initially
- Background jobs, caching, and queues: Introduce when they provide actual value rather than as mandatory initial infrastructure

The system should be designed as a serious production-oriented application, but development should remain pragmatic. Avoid spending weeks building infrastructure that is not yet needed.

---

# 2. Product Vision

The platform should eventually allow a school to manage most of its day-to-day operations from one system:

- School administration
- Student management
- Teacher management
- Parent management
- Classes and sections
- Subjects
- Academic years
- Student enrollment/history
- Attendance
- Timetables
- Assignments
- Examinations
- Results and grades
- Fees and payments
- Announcements
- Notifications
- Documents
- Reports and analytics
- Library
- Transport
- Hostel
- Inventory
- Staff/leave/payroll-related modules
- Certificates and ID cards
- Parent-facing functionality

Not all modules need to be implemented in the first release. The architecture should accommodate them without forcing them into the initial build.

---

# 3. Multi-Tenant SaaS Model

A school is the primary tenant.

Conceptually:

```text
Platform
│
├── School A
│   ├── Users
│   ├── Students
│   ├── Teachers
│   ├── Classes
│   ├── Attendance
│   ├── Exams
│   ├── Fees
│   └── ...
│
├── School B
│   ├── Users
│   ├── Students
│   ├── Teachers
│   ├── Classes
│   └── ...
│
└── School C
```

The initial database strategy should be:

```text
One PostgreSQL database
        ↓
Shared schema
        ↓
schoolId / tenant identifier on tenant-owned data
```

This is intentionally simpler than database-per-school or schema-per-school tenancy.

The system must never allow a school user to access another school's tenant-owned records.

Tenant isolation should be enforced primarily at the backend service/query layer. PostgreSQL Row-Level Security can be considered later as an additional defense if the platform reaches a level where it is justified.

---

# 4. Roles

The initial role model:

## Super Admin

Platform-level role.

Responsibilities include:

- Manage schools
- Create/suspend/activate schools
- View school information
- Manage platform subscriptions/plans
- View platform revenue
- View pending school subscription payments
- View platform usage
- View system-level analytics
- Manage platform configuration
- Manage feature availability
- View audit/system activity where appropriate

A Super Admin is **not automatically a normal school user**.

## School Admin

Tenant-level administrator.

Responsibilities include:

- Manage school settings
- Manage students
- Manage teachers
- Manage parents
- Manage classes and sections
- Manage subjects
- Configure academic years
- Manage enrollments
- Manage attendance settings
- Manage examinations
- Manage fees
- Manage announcements
- View reports
- Manage school documents/settings

## Teacher

Teacher-level role.

Typical capabilities:

- View assigned classes
- View assigned subjects
- View students
- Mark attendance
- Update attendance where permitted
- Create assignments
- Review submissions
- Enter marks/results where permitted
- View timetable
- Publish or participate in announcements depending on permissions

## Student

Student-level role.

Typical capabilities:

- View profile
- View timetable
- View attendance
- View assignments
- Submit assignments
- View examination schedule
- View results
- View fee information
- View announcements
- Access permitted documents

## Parent

Parent functionality should be included in the architecture even if it is implemented later.

Typical capabilities:

- View linked children
- View attendance
- View timetable
- View assignments
- View results
- View fees
- Make/view payments where supported
- Receive notifications
- View announcements

---

# 5. Authorization Model

The project should support both roles and permissions.

A role can provide a set of permissions.

Examples:

```text
student.read
student.create
student.update
student.delete

teacher.read
teacher.create
teacher.update

attendance.read
attendance.mark
attendance.update

fee.read
fee.create
fee.collect
fee.refund

exam.read
exam.create
exam.grade
```

Do not unnecessarily hard-code authorization logic throughout controllers.

The implementation can choose the exact RBAC representation, but it should be possible to add or modify permissions without rewriting every module.

Authorization must consider:

1. Who is the user?
2. What role/permissions do they have?
3. Which school/tenant are they operating in?
4. Does the requested resource belong to that tenant?
5. Is the user allowed to perform this operation?

---

# 6. Major Domain Areas

The application should be organized around business domains rather than only technical layers.

Core domains:

```text
Authentication
Schools
Users
Roles & Permissions
Students
Teachers
Parents
Academic Years
Classes
Sections
Subjects
Enrollments
Attendance
Timetable
Assignments
Examinations
Results
Fees
Payments
Subscriptions
Notifications
Announcements
Documents
Reports
Audit Logs
```

Future/advanced domains:

```text
Library
Transport
Hostel
Inventory
Staff Management
Leave Management
Payroll
Events
Certificates
ID Cards
Mobile APIs
```

---

# 7. Core Domain Relationships

## School

A school owns or contains most tenant-level resources.

```text
School
├── Users
├── Students
├── Teachers
├── Parents
├── AcademicYears
├── Classes
├── Sections
├── Subjects
├── Enrollments
├── Attendance
├── Exams
├── Fees
├── Documents
└── Settings
```

## Academic Year

Academic data should be associated with an academic year.

Example:

```text
2025-26
2026-27
2027-28
```

The system should preserve historical academic information.

## Enrollment

Do not model a student's class membership only as a permanent `student.classId`.

Prefer an enrollment/history concept:

```text
Student
   ↓
Enrollment
   ↓
Academic Year
   ↓
Class
   ↓
Section
```

This allows:

```text
2024-25 → Class 7 A
2025-26 → Class 8 A
2026-27 → Class 9 B
```

to coexist historically.

---

# 8. Finance Model

There are two separate financial domains.

## School → Student finance

```text
Fee Structure
      ↓
Fee Invoice
      ↓
Payment
```

This should support, where required:

- Tuition fees
- Other fee types
- Installments
- Partial payments
- Discounts
- Scholarships
- Late fees
- Refunds
- Payment history
- Receipts
- Outstanding balances
- Payment methods
- Online payment gateway integration

Avoid simplistic fields such as:

```text
student.feePaid = true
```

because real financial records require history and transactions.

## Platform → School billing

Separate from student fees:

```text
School
   ↓
Subscription Plan
   ↓
Subscription
   ↓
Platform Invoice
   ↓
Platform Payment
```

The platform should eventually support:

- Subscription plans
- Trial periods
- Active/inactive subscriptions
- Subscription renewal
- Pending payments
- Payment history
- Usage limits
- Feature availability

These two financial systems should remain separate in the domain model.

---

# 9. Files and Documents

Files should not normally be stored directly inside PostgreSQL.

Recommended conceptual design:

```text
PostgreSQL
    ↓
File metadata

Object Storage
    ↓
Actual file
```

Potential documents:

- Student documents
- Certificates
- Teacher documents
- School documents
- Assignment attachments
- Receipts
- ID cards
- Reports

Storage can initially use an S3-compatible provider or another suitable object-storage service.

---

# 10. Notifications

The system should eventually support:

- In-app notifications
- Email
- Push notifications
- SMS
- Potential WhatsApp integration

Initially, synchronous notification handling can be acceptable for simple operations.

As the platform grows:

```text
Application
    ↓
Queue
    ↓
Worker
    ├── Email
    ├── SMS
    ├── Push
    └── Other providers
```

Redis/BullMQ or another queue mechanism can be introduced when background processing becomes useful.

---

# 11. Auditability

Important administrative operations should eventually produce audit records.

Examples:

```text
School created
User created
Student deleted
Fee modified
Payment refunded
Permission changed
School suspended
Result modified
```

Audit records should ideally contain:

- Actor
- School/tenant if applicable
- Action
- Entity/resource
- Resource ID
- Timestamp
- Relevant metadata
- Request/context information where appropriate

The exact audit implementation can evolve.

---

# 12. Reporting and Analytics

Reports should be exposed through backend APIs rather than being tightly coupled to any particular frontend chart library.

Potential reports:

### School Admin

- Student count
- Teacher count
- Attendance statistics
- Class performance
- Examination performance
- Fee collection
- Outstanding fees
- Payment history
- Enrollment trends

### Super Admin

- Number of schools
- Active schools
- Suspended schools
- Student count across platform
- Teacher count
- Platform revenue
- Subscription status
- Usage metrics
- School growth
- Storage/usage statistics

The backend should return structured data. The eventual frontend can decide whether to display it as tables, cards, line charts, bar charts, etc.

---

# 13. Architecture Philosophy

Use a **modular monolith** initially.

Conceptually:

```text
                React Frontend
                      │
                   REST API
                      │
                 Express App
                      │
        ┌─────────────┼─────────────┐
        │             │             │
      Auth         Schools        Students
        │             │             │
      Fees       Academics      Attendance
        │             │             │
        └─────────────┼─────────────┘
                      │
                    Prisma
                      │
                 PostgreSQL
```

Internally, domains should be separated clearly enough that a heavily used module could eventually be extracted.

Do not begin with microservices unless a concrete requirement appears.

---

# 14. Scalability Strategy

The project should be **scalable by design, not over-engineered from day one**.

### Start with

```text
React
   ↓
Express
   ↓
Prisma
   ↓
PostgreSQL
```

### Introduce later as needed

```text
Redis
Object Storage
Background Workers
Queues
CDN
Observability
Read replicas
Caching
```

### Consider service extraction only when justified

Potential future services:

```text
Authentication
Notifications
Finance
Reporting/Analytics
File Processing
```

The codebase should have domain boundaries that make this possible, but no assumption should be made that microservices are required.

---

# 15. Development Phases

## Phase 0 — Architecture

Goal: establish the domain model before large-scale implementation.

Deliverables:

- ER/domain model
- Role/permission model
- Tenant model
- API conventions
- Module boundaries
- Initial Prisma schema
- Basic deployment approach

---

## Phase 1 — Foundation

Goal: make the project runnable and maintainable.

Set up:

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Environment configuration
- Docker/local database
- Logging
- Error handling
- Validation
- Basic testing setup
- Code quality tooling

---

## Phase 2 — Authentication and Authorization

Goal:

> Correctly identify users and enforce access.

Implement:

- Registration where applicable
- Login
- Logout
- Password hashing
- Session/token handling
- Refresh mechanism if needed
- Password reset
- Email verification if required
- Roles
- Permissions
- Authorization middleware

---

## Phase 3 — Multi-Tenancy and Schools

Goal:

> Super Admin can manage schools and school users operate only within their tenant.

Implement:

- School creation
- School configuration
- School status
- School admin creation
- Tenant resolution
- Tenant-aware queries
- Subscription foundation
- Super Admin APIs

---

## Phase 4 — People and Academic Structure

Implement:

- Students
- Teachers
- Parents
- Classes
- Sections
- Subjects
- Academic years
- Enrollments
- Student history

---

## Phase 5 — Academic Operations

Implement:

- Attendance
- Timetable
- Assignments
- Assignment submissions
- Examinations
- Exam subjects
- Marks
- Grades
- Results
- Academic announcements

---

## Phase 6 — Finance

Implement:

- Fee structures
- Fee invoices
- Installments
- Discounts
- Scholarships
- Payments
- Refunds
- Receipts
- Outstanding balances
- Payment history
- School subscription billing

---

## Phase 7 — Communication and Files

Implement:

- Announcements
- In-app notifications
- Email integration
- File/document metadata
- Object storage integration
- Background jobs where useful

---

## Phase 8 — Reports and Analytics

Implement APIs for:

- Attendance reports
- Fee reports
- Academic performance
- Enrollment
- Teacher/class reports
- Platform metrics
- Subscription/revenue metrics

---

## Phase 9 — Hardening

Goal: prepare the backend for frontend integration and realistic deployment.

Review:

- Authorization
- Tenant isolation
- Input validation
- Rate limiting
- Pagination
- Filtering
- Sorting
- Database indexes
- Transactions
- Error handling
- Logging
- Audit logs
- Tests
- API documentation
- Security
- Performance

---

## Phase 10 — Advanced Features

Only after the core platform is stable:

- Library
- Transport
- Hostel
- Inventory
- Leave management
- Payroll
- Events
- Certificates
- ID cards
- Parent portal improvements
- Mobile API
- Advanced analytics

---

# 16. Backend Completion Target Before Frontend

The project intentionally follows a **backend-first strategy**.

The backend should reach roughly 70–80% maturity before serious frontend development begins.

That does not mean every endpoint must exist.

The desired milestone is:

```text
Authentication             ██████████
Authorization              ██████████
Multi-tenancy              ██████████
School management          ██████████
Student management         ██████████
Teacher management         ██████████
Academic structure         ██████████
Attendance                 ██████████
Examinations               ████████
Fees                       ████████
Notifications              ██████
Documents                  ██████
Reports                    ██████
Advanced modules           ██
```

At that point the frontend can be treated primarily as a client of an already-defined product API.

---

# 17. Implementation Freedom

This document defines **architecture, product intent, domains, and important constraints**, not every line of implementation.

Coding agents/developers may choose reasonable implementation details.

For example, they may choose between suitable:

- Validation libraries
- Logging libraries
- Testing frameworks
- JWT vs secure session approaches
- REST implementation patterns
- Repository abstractions
- Queue providers
- Object storage providers
- Deployment providers

as long as the resulting implementation preserves the core architectural goals.

Do not introduce complexity solely because it is theoretically scalable.

Prefer:

> Simple now + clear boundaries + easy future evolution.

---

# 18. Definition of a Good Implementation

A good implementation should be:

- Multi-tenant
- Secure
- Maintainable
- Modular
- Testable
- Type-safe
- Database-conscious
- API-oriented
- Production-aware
- Easy to extend

It should also remain understandable to a small engineering team.

The objective is not to demonstrate the maximum number of technologies.

The objective is to build a real school-management platform that can grow into a larger SaaS system.

---

# 19. Future Frontend Specification

A separate document should eventually define the frontend.

It should cover:

- React architecture
- Routing
- Authentication state
- API integration
- TanStack Query strategy
- State management
- Design system
- Responsive layouts
- Role-based navigation
- Dashboards
- Tables
- Forms
- Charts
- Loading/error/empty states
- Accessibility
- File uploads
- Notifications
- Frontend folder structure

This document intentionally does not prescribe those details yet so frontend decisions do not distract from backend/domain development.
