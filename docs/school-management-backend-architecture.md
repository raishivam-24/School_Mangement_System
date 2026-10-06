# School Management System — Backend Architecture & Implementation Guide

## 1. Purpose

This document is the implementation-oriented backend specification for the School Management System.

The backend is the primary development focus during the first major part of the project.

The target is to build approximately 70–80% of the meaningful backend before investing heavily in the frontend.

The backend should expose a clean API that a future React frontend can consume without requiring the backend to know anything about the frontend's visual implementation.

---

# 2. Backend Stack

Primary direction:

```text
Node.js
TypeScript
Express
Prisma
PostgreSQL
```

Supporting technologies can be introduced when useful:

```text
Zod or equivalent validation
Redis
BullMQ or equivalent queue
S3-compatible object storage
OpenAPI/Swagger
Docker
```

The exact library choices are not rigid. Favor mature, well-maintained tools and avoid unnecessary dependencies.

---

# 3. Backend Architecture

Use a **modular monolith**.

The application runs as one backend process initially, but business domains are separated internally.

Recommended conceptual flow:

```text
HTTP Request
     │
     ▼
Global Middleware
     │
     ├── Request ID / logging
     ├── Rate limiting
     ├── Authentication
     ├── Tenant resolution
     ├── Authorization
     └── Validation
     │
     ▼
Controller
     │
     ▼
Service / Business Logic
     │
     ▼
Prisma / Data Access
     │
     ▼
PostgreSQL
```

Not every operation needs an artificial abstraction layer. Keep the implementation practical.

---

# 4. Recommended Backend Structure

A reasonable starting structure:

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── ...
│   │
│   ├── db/
│   │   └── prisma.ts
│   │
│   ├── lib/
│   │   ├── logger.ts
│   │   ├── storage.ts
│   │   └── ...
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   ├── authorization.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── ...
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   ├── users/
│   │   ├── schools/
│   │   ├── roles/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── parents/
│   │   ├── academics/
│   │   ├── enrollments/
│   │   ├── attendance/
│   │   ├── timetable/
│   │   ├── assignments/
│   │   ├── examinations/
│   │   ├── results/
│   │   ├── finance/
│   │   ├── subscriptions/
│   │   ├── notifications/
│   │   ├── announcements/
│   │   ├── documents/
│   │   ├── reports/
│   │   └── audit/
│   │
│   ├── utils/
│   │   ├── pagination.ts
│   │   ├── errors.ts
│   │   └── ...
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── tests/
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── .env.example
```

The exact structure may evolve.

---

# 5. Module Structure

Each major domain can follow a structure such as:

```text
students/
├── student.routes.ts
├── student.controller.ts
├── student.service.ts
├── student.schema.ts
├── student.types.ts
└── ...
```

For larger modules:

```text
finance/
├── routes/
├── controllers/
├── services/
├── schemas/
├── types/
└── ...
```

The important principle is that related business logic stays together.

Avoid one giant global:

```text
controllers/
services/
models/
```

directory containing unrelated functionality.

---

# 6. API Design

Use versioned APIs.

Example:

```text
/api/v1/auth
/api/v1/schools
/api/v1/users
/api/v1/students
/api/v1/teachers
/api/v1/academics
/api/v1/attendance
/api/v1/exams
/api/v1/results
/api/v1/fees
/api/v1/payments
/api/v1/notifications
```

Use conventional HTTP semantics where appropriate:

```text
GET     /students
GET     /students/:id
POST    /students
PATCH   /students/:id
DELETE  /students/:id
```

For actions that are genuinely commands rather than CRUD updates, action-style endpoints may be appropriate.

Example:

```text
POST /attendance/records/submit
POST /payments/:id/refund
```

Do not force everything into one pattern if it makes the domain less clear.

---

# 7. Response and Error Conventions

Use a consistent response/error approach.

Successful responses should be predictable.

Example:

```json
{
  "data": {},
  "meta": {}
}
```

List endpoints may include:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 245
  }
}
```

Errors should expose useful machine-readable information without leaking internal details.

Example:

```json
{
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student was not found."
  }
}
```

Exact response format can be adapted consistently across the project.

---

# 8. Authentication

Implement secure authentication before business modules.

Requirements:

- Password hashing
- Login
- Logout
- Authentication state
- Token/session expiry
- Refresh mechanism where applicable
- Password reset
- Email verification if required
- Account status
- Basic brute-force/rate-limit protection

The implementation may use secure HTTP-only cookies/sessions or a carefully designed token system.

Do not store sensitive authentication secrets in frontend-accessible storage if avoidable.

---

# 9. Authorization

Authorization has two dimensions:

```text
Role/Permission
+
Tenant Ownership
```

For example:

```text
School Admin
    ↓
Can update students
    ↓
But only students belonging to their school
```

A request must not become authorized simply because a resource ID is known.

Avoid:

```typescript
prisma.student.findUnique({
  where: { id: studentId }
});
```

for tenant-scoped access when the request originates from a school user.

Prefer a tenant-aware query such as:

```typescript
where: {
  id: studentId,
  schoolId: currentSchoolId
}
```

The exact implementation can vary.

---

# 10. Multi-Tenancy

The initial approach is shared database/schema with explicit tenant ownership.

Most tenant-owned models should have:

```text
schoolId
```

or an equivalent relationship.

Examples:

```text
Student → schoolId
Teacher → schoolId
Class → schoolId
Subject → schoolId
Attendance → schoolId
FeeInvoice → schoolId
Announcement → schoolId
Document → schoolId
```

Some globally scoped models may not need it.

Examples:

```text
PlatformUser
Permission
SystemConfiguration
```

Do not add `schoolId` mechanically to everything.

The important requirement is that every tenant-owned resource has a reliable way to determine its tenant.

---

# 11. Prisma and Database Principles

Use Prisma as the primary ORM/data access layer.

Database design should prioritize:

- Referential integrity
- Appropriate indexes
- Unique constraints
- Foreign keys
- Transactions
- Historical data
- Tenant isolation
- Query performance

Do not blindly create an index on every column.

Index fields commonly used for:

- Tenant filtering
- Foreign keys
- Unique lookups
- Frequently queried combinations
- Sorting/filtering when justified

Composite indexes may be useful, for example:

```text
(schoolId, classId)
(schoolId, academicYearId)
(schoolId, studentId)
```

depending on actual query patterns.

---

# 12. Core Prisma Domain Models

The exact Prisma schema should be refined during implementation, but the system is expected to contain concepts similar to:

```text
School
User
Role
Permission
RolePermission

Student
Teacher
Parent

AcademicYear
Class
Section
Subject
Enrollment

Attendance
AttendanceRecord

Timetable
TimetableEntry

Assignment
AssignmentSubmission

Exam
ExamSubject
ExamResult

FeeStructure
FeeItem
FeeInvoice
FeeInvoiceItem
Payment
Refund

SubscriptionPlan
SchoolSubscription
PlatformInvoice
PlatformPayment

Announcement
Notification

Document

AuditLog
```

Additional models can be introduced where they make the domain clearer.

Do not force all models into one huge schema before understanding the relationships.

---

# 13. Students

Student functionality should support:

- Create student
- Update student
- View student
- Archive/deactivate student
- Student profile
- Student identifiers/admission number
- Contact information
- Parent/guardian relationships
- Documents
- Enrollment history
- Academic information

Avoid deleting historical student information unless there is a strong reason.

Soft deletion/archive may be appropriate for many administrative records.

---

# 14. Teachers

Teacher functionality:

- Teacher profile
- Employment/basic staff information
- Subjects taught
- Classes/sections taught
- Timetable
- Attendance responsibilities
- Assignments
- Examination/marks responsibilities

Future expansion may add:

- Leave
- Payroll
- Staff documents

---

# 15. Academic Structure

Core hierarchy:

```text
School
  ↓
Academic Year
  ↓
Class
  ↓
Section
  ↓
Students through Enrollment
```

Subjects can be associated with classes/academic years as required.

Do not assume a student's current class is enough to represent their complete academic history.

---

# 16. Enrollment

Enrollment is a key historical entity.

Example:

```text
Student A
│
├── 2024-25 → Class 7 → Section A
├── 2025-26 → Class 8 → Section B
└── 2026-27 → Class 9 → Section B
```

Enrollment should provide the basis for determining academic context.

This will also help reports and historical result/attendance access.

---

# 17. Attendance

Attendance should support:

- Daily attendance
- Student-level records
- Class/section attendance
- Teacher marking
- Status values such as present/absent/late/leave where appropriate
- Attendance history
- Attendance reports
- Corrections with appropriate authorization
- Audit trail for sensitive changes

Avoid allowing duplicate attendance records for the same student/date/context unless the domain explicitly permits multiple sessions.

Transactions/unique constraints should help enforce consistency.

---

# 18. Timetable

Support:

- Class timetable
- Teacher timetable
- Subject
- Room/location where applicable
- Day/time
- Academic year context

The implementation should prevent obvious scheduling conflicts where feasible.

---

# 19. Assignments

Support:

```text
Teacher
   ↓
Assignment
   ↓
Class/Section
   ↓
Students
   ↓
Submission
   ↓
Evaluation
```

Potential functionality:

- Create assignment
- Due date
- Attachments
- Student submission
- Submission timestamp
- Evaluation/marks
- Feedback
- Status

---

# 20. Examinations and Results

Potential hierarchy:

```text
Exam
 ├── Mathematics
 ├── Physics
 └── English
```

Support:

- Exam creation
- Exam schedule
- Exam subjects
- Marks
- Grades
- Results
- Result publication
- Result history
- Class/student reports

The data model should distinguish raw marks from derived grades where useful.

---

# 21. Fees and Payments

School financial flow:

```text
Fee Structure
     ↓
Fee Invoice
     ↓
Payment
```

Support:

- Fee categories
- Fee structures
- Installments
- Invoices
- Discounts
- Scholarships
- Late fees
- Partial payments
- Outstanding amounts
- Payment history
- Receipts
- Refunds
- Payment methods

Financial operations should use transactions and should be designed so historical records remain reliable.

Do not mutate historical payment information casually.

---

# 22. Platform Subscriptions

Separate school/student fees from SaaS billing.

```text
School
   ↓
Subscription Plan
   ↓
School Subscription
   ↓
Platform Invoice
   ↓
Platform Payment
```

Support:

- Plans
- Trial
- Active subscription
- Expiration
- Renewal
- Payment status
- Usage/limits
- Feature availability

---

# 23. Notifications

Notification domain should support:

- Notification creation
- Read/unread state
- Recipient
- Notification type
- Related entity
- Delivery channel

Possible channels:

```text
In-app
Email
Push
SMS
```

Start simply.

If notification volume grows:

```text
API
 ↓
Queue
 ↓
Worker
 ↓
Provider
```

---

# 24. Documents and Storage

The database should store metadata while actual files live in object storage.

Example:

```text
Document
├── id
├── schoolId
├── owner/entity reference
├── fileName
├── mimeType
├── size
└── storageKey
```

Potential functionality:

- Upload
- Download/access
- Delete/archive
- Metadata
- Authorization
- Signed URLs where appropriate

Never allow a user to access a document merely by guessing its storage key.

---

# 25. Announcements

Announcements should support:

- School-wide announcements
- Class/section announcements
- Teacher announcements where authorized
- Scheduled publication if needed
- Attachments
- Read status if required

---

# 26. Reports

Reports should be implemented as backend queries/services that return structured data.

Examples:

```text
GET /reports/attendance
GET /reports/fees
GET /reports/results
GET /reports/enrollment
GET /reports/platform
```

Reports may become expensive.

Initially optimize queries and indexes.

Later, if necessary, introduce:

- Cached reports
- Materialized views
- Background report generation
- Analytics database/read model

Do not build these prematurely.

---

# 27. Audit Logs

Audit important operations such as:

- Authentication/security events
- School status changes
- Permission changes
- Student modifications
- Fee/payment operations
- Result modifications
- Administrative changes

Audit logging should not expose passwords, secrets, or sensitive credentials.

---

# 28. Pagination, Filtering and Search

List endpoints should be designed for growth.

Support pagination for potentially large datasets.

Typical capabilities:

```text
?page=1&pageSize=20
```

plus suitable filters:

```text
?classId=
?sectionId=
?academicYearId=
?status=
?search=
```

Do not return thousands of records by default.

Search can initially use PostgreSQL capabilities.

A dedicated search engine is not required initially.

---

# 29. Transactions

Use database transactions when multiple changes must succeed or fail together.

Examples:

```text
Creating a school + initial admin
Creating an invoice + invoice items
Recording a payment + updating financial state
Publishing results + related records
```

Do not put every database operation into a transaction automatically.

Use transactions where atomicity matters.

---

# 30. Validation

Validate all external input.

Validation should cover:

- Request body
- Query parameters
- Route parameters
- File metadata
- Important business constraints

TypeScript types alone do not validate runtime HTTP input.

---

# 31. Security

At minimum consider:

- Password hashing
- Secure session/token handling
- HTTP security headers
- CORS configuration
- Rate limiting
- Request validation
- Authorization
- Tenant isolation
- SQL/ORM safety
- File access control
- Secret management
- Secure error responses
- Audit logging
- Dependency updates

Never trust:

```text
schoolId
userId
role
```

sent by a normal client as proof of authorization.

Determine authoritative identity/tenant context from the authenticated server-side context.

---

# 32. Testing Strategy

Testing should focus on business-critical behavior.

Important areas:

### Unit tests

- Business rules
- Fee calculations
- Permission checks
- Enrollment rules
- Grade calculations

### Integration tests

- Authentication
- Tenant isolation
- Student CRUD
- Attendance
- Fees
- Payments
- Exams/results

### Security tests

Especially:

```text
School A user
    ↓
attempts to access
    ↓
School B resource
```

This must consistently fail.

Do not chase arbitrary test coverage percentages. Prioritize important behavior.

---

# 33. API Documentation

Provide API documentation as the backend becomes stable.

OpenAPI/Swagger or another appropriate approach is recommended.

Document:

- Authentication
- Endpoints
- Request schemas
- Response schemas
- Error responses
- Permissions
- Pagination
- Example requests

This will later make frontend development significantly easier.

---

# 34. Logging and Observability

Start with useful structured logs.

Useful information includes:

- Request ID
- Method
- Path
- Status
- Duration
- Error code
- User/tenant context where safe

Never log:

- Passwords
- Tokens
- Secrets
- Sensitive payment credentials

Later, production observability can evolve into:

```text
Logs
Metrics
Tracing
Error monitoring
```

---

# 35. Background Processing

Do not add queues simply because queues are scalable.

Start synchronously where appropriate.

Introduce background workers for tasks such as:

- Bulk emails
- Notifications
- Report generation
- File processing
- Large imports/exports
- Scheduled jobs

Possible architecture:

```text
Express
  ↓
Queue
  ↓
Worker
  ↓
Job processor
```

---

# 36. Caching

PostgreSQL should remain the initial source of truth.

Do not introduce Redis caching everywhere.

When real performance requirements appear, cache suitable read-heavy data such as:

- School configuration
- Permissions
- Frequently accessed reference data
- Expensive reports

Always define cache invalidation behavior.

---

# 37. Database Performance

Before reaching for microservices, investigate:

1. Query design
2. Missing indexes
3. N+1 queries
4. Unnecessary data loading
5. Pagination
6. Transaction scope
7. Connection pooling
8. Caching

Use actual measurements rather than assumptions.

---

# 38. Deployment Direction

The backend should be container-friendly.

A reasonable initial deployment:

```text
Internet
   ↓
Reverse Proxy / Platform
   ↓
Node.js API
   ↓
PostgreSQL
```

Potential supporting services:

```text
Object Storage
Redis
Worker
```

Later infrastructure can move toward:

```text
Load Balancer
     ↓
Multiple API instances
     ↓
PostgreSQL
Redis
Workers
Object Storage
```

Do not require Kubernetes for the first production version.

---

# 39. Backend Development Phases

## Phase 1 — Foundation

Implement:

- Project setup
- TypeScript
- Express
- Prisma
- PostgreSQL
- Environment management
- Docker/local database
- Error handling
- Logging
- Validation

### Goal

A clean, runnable backend foundation.

---

## Phase 2 — Database and Domain Foundation

Implement/refine:

- School
- User
- Roles
- Permissions
- Student
- Teacher
- Parent
- Academic Year
- Class
- Section
- Subject
- Enrollment

### Goal

The core domain model exists and can represent multiple schools and academic history.

---

## Phase 3 — Authentication

Implement:

- Login
- Logout
- Password hashing
- Session/token handling
- Password reset
- Account status
- Authentication middleware

### Goal

Users can securely authenticate.

---

## Phase 4 — RBAC and Tenant Isolation

Implement:

- Role permissions
- Authorization middleware
- Tenant resolution
- Tenant-aware queries
- Super Admin access
- School Admin access
- Teacher access
- Student access

### Goal

A School A user cannot access School B data.

This phase is critical and should receive strong testing.

---

## Phase 5 — School Administration

Implement:

- School CRUD
- School configuration
- School status
- School Admin management
- Academic year management
- Class/section management
- Subject management

### Goal

A school can configure its academic structure.

---

## Phase 6 — Student/Teacher/Parent Management

Implement:

- Student CRUD
- Teacher CRUD
- Parent relationships
- Enrollment
- Academic history
- Search/filter/pagination
- Documents where applicable

### Goal

The people-management layer is operational.

---

## Phase 7 — Academic Operations

Implement:

- Attendance
- Timetable
- Assignments
- Submissions
- Examinations
- Marks
- Grades
- Results

### Goal

The school can run its core academic workflow.

---

## Phase 8 — Finance

Implement:

- Fee structures
- Invoices
- Payments
- Discounts
- Scholarships
- Refunds
- Receipts
- Outstanding fees
- Payment history
- Platform subscriptions

### Goal

Both school-level and platform-level finance work independently.

---

## Phase 9 — Communication and Documents

Implement:

- Announcements
- Notifications
- Email
- Document metadata
- Object storage
- Background jobs where justified

### Goal

The platform supports communication and files.

---

## Phase 10 — Reports

Implement:

- Attendance reports
- Fee reports
- Result reports
- Enrollment reports
- School analytics
- Super Admin analytics

### Goal

The backend can supply the future dashboard with structured analytics.

---

## Phase 11 — Backend Hardening

Review:

- Security
- Authorization
- Tenant isolation
- Validation
- Pagination
- Indexes
- Transactions
- Error handling
- Logging
- Tests
- API documentation
- Performance

### Goal

Backend is mature enough for serious frontend development.

---

# 40. Suggested Implementation Order Inside Each Module

For a typical module:

```text
1. Understand domain requirement
2. Define/refine Prisma models
3. Add migration
4. Add validation schemas
5. Implement service/business logic
6. Implement controller
7. Implement routes
8. Add authorization
9. Add pagination/filtering if applicable
10. Add tests
11. Document API
```

This is a guideline, not a rigid rule.

If a module requires a different order, use good engineering judgment.

---

# 41. What the Coding Agent Should Optimize For

The agent should prioritize:

### Correctness

Business rules and tenant isolation matter more than speed of implementation.

### Simplicity

Do not introduce a technology simply because it is popular.

### Maintainability

Keep domains understandable and reasonably independent.

### Extensibility

New modules should be possible without rewriting the entire backend.

### Security

Authorization and tenant isolation are first-class requirements.

### Performance

Avoid obvious inefficient database access, but do not prematurely optimize.

### Developer Experience

The project should be easy to run locally and easy for another developer to understand.

---

# 42. What the Coding Agent Should Avoid

Avoid unnecessary:

- Microservices
- Kubernetes
- Event-driven architecture everywhere
- Multiple databases without a real requirement
- Complex caching
- Premature CQRS
- Premature event sourcing
- Dedicated search infrastructure
- Over-abstraction
- Huge generic repository frameworks
- Frontend-specific backend decisions

The system should be capable of evolving into these patterns if real requirements emerge, but the initial implementation should remain pragmatic.

---

# 43. Backend Completion Definition

The backend can be considered ready for major frontend development when:

- Authentication works
- RBAC works
- Multi-tenancy works
- Tenant isolation is tested
- Super Admin flows work
- School Admin flows work
- Teacher/student authorization works
- Core student/teacher management works
- Academic structure works
- Enrollment history works
- Attendance works
- Exams/results work
- Fees/payments work
- Notifications/documents have a usable foundation
- Reports expose structured data
- API validation is consistent
- Pagination/filtering is implemented where needed
- Important business logic has tests
- API documentation exists
- Database indexes have been reviewed
- Error handling/logging are usable

Advanced modules do not need to be complete before moving to frontend.

---

# 44. Frontend Boundary

The backend must not assume a particular visual implementation.

For example, the backend should provide:

```json
[
  {
    "month": "January",
    "collected": 450000,
    "pending": 80000
  }
]
```

The frontend may choose to render this as:

- A line chart
- A bar chart
- A table
- A dashboard card
- Another suitable visualization

The backend's responsibility is the domain data and business logic.

---

# 45. Final Engineering Principle

The system should follow:

```text
Strong domain model
        +
Clear module boundaries
        +
Secure tenant isolation
        +
Simple initial infrastructure
        +
Measured scaling
```

The goal is not to make the first version look like a giant enterprise architecture diagram.

The goal is to create a solid backend that can start simple and **grow without requiring a rewrite**.
