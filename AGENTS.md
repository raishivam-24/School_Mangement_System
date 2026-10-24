# 🤖 AGENTS.md — AI Coding Assistant Guidelines & Architectural Manifesto

Welcome, AI Assistant! This document provides the critical architecture rules, codebase patterns, security boundaries, and design standards for **School Management System (SchoolHub)**. 

Follow these instructions strictly whenever you generate, refactor, or review code in this repository.

---

## 🏛️ 1. Project Architecture & Tenancy Model

- **Multi-Tenant SaaS Architecture**: Shared Database + Shared Schema with **strict row-level tenant isolation**.
- **The Golden Rule**: Every query on a tenant-owned entity (students, teachers, classes, attendance, exams, fees, announcements, documents) **MUST** include `where: { schoolId }`.
- **Tenant Context Extraction**:
  - `req.user.schoolId` is attached by `authenticateUser` and validated by `requireTenant` middleware.
  - Platform `SUPER_ADMIN` has `schoolId = null` and operates across schools.
  - All school users (`SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`) belong to a single `schoolId`.
- **Security Check**: Never perform updates or deletes using only an `id` parameter without verifying `schoolId` ownership (`where: { id, schoolId }`).

---

## ⚙️ 2. Technology Stack & Tooling

### Backend
- **Runtime**: Node.js 22 LTS with TypeScript 5
- **Framework**: Express 4
- **ORM**: Prisma 7 with PostgreSQL (Neon serverless or local Postgres)
- **Validation**: Zod 3 schemas for all request bodies (`req.body`), queries (`req.query`), and route parameters (`req.params`)
- **Authentication**: JWT access & refresh tokens stored in secure, HttpOnly cookies (`SameSite=None`, `Secure`)
- **Passwords**: `bcryptjs` with minimum salt rounds of 12
- **Testing**: Vitest + Supertest

### Frontend
- **Framework**: React 19 + Vite 8 (TypeScript)
- **Styling**: Tailwind CSS v4 using semantic design tokens (`bg-surface`, `bg-canvas`, `text-primary`, `text-muted`, `accent-blue`, `border-border`, `shadow-card`)
- **Animations**: Framer Motion for fluid layout transitions, micro-interactions, and modals
- **Icons**: Lucide React (`lucide-react`)
- **State & Data**: TanStack React Query (`@tanstack/react-query`) for server state, custom React Context for global session (`AuthContext`, `ThemeContext`, `NotificationContext`, `SocketContext`)
- **Testing**: Vitest + `@testing-library/react` + `jsdom`

---

## 🎨 3. Frontend Aesthetics & Design Quality Bar

- **Zero Low-Effort UI**: Never generate plain HTML tables, bare unstyled buttons, or generic form controls. All UI components must feel **modern, premium, and polished**.
- **Dark/Light Theme Respect**:
  - Do NOT hardcode background colors like `bg-white` or `bg-black` or raw text colors like `text-black` / `text-white` on container cards.
  - Use semantic design tokens: `bg-surface`, `bg-canvas`, `text-primary`, `text-muted`, `border-border`, and `shadow-card`.
- **Interactive Feedback**:
  - Always include hover states (`hover:bg-surface/80`, `hover:scale-[1.02]`), transitions (`transition-all duration-200`), and active feedback (`active:scale-95`).
  - Use accessible loading skeletons or spinners while asynchronous queries are in flight.
- **Empty States**: Never leave an empty list blank. Provide a helpful icon, a clear description, and a primary action button when data is absent.

---

## 🧪 4. Testing & Continuous Integration (CI) Guidelines

1. **Test Co-location**:
   - Unit and module tests must be co-located with their source files (e.g. `service.ts` $\rightarrow$ `service.spec.ts`, `Component.tsx` $\rightarrow$ `Component.spec.tsx`).
   - Integration / gateway tests live in `backend/tests/` (e.g. `backend/tests/api.spec.ts`).
2. **Zero Database / External Dependencies in Unit Tests**:
   - Always mock the Prisma client in unit tests (`vi.mock('../db/prisma.js')` or `vi.mock('../../db/prisma.js')`).
   - Mock external network calls (e.g. AWS S3, Razorpay, SMTP).
3. **TypeScript `dist` Hygiene**:
   - `backend/tsconfig.json` explicitly excludes `**/*.spec.ts` and `**/*.test.ts` so test files are never compiled into the production bundle.
4. **Pre-flight Checks**:
   - Before completing any task, ensure:
     ```bash
     cd backend && npm test && npm run build
     cd frontend && npm test && npm run build
     ```
   - Automated GitHub Actions CI (`.github/workflows/ci.yml`) triggers on every Pull Request and will fail if types or tests break.

---

## 🚫 5. Anti-Patterns & Prohibitions

- ❌ **DO NOT** use `process.exit(1)` in library modules or config without considering the `test` environment (`NODE_ENV === 'test'`).
- ❌ **DO NOT** hardcode database URLs, secrets, or API keys in code. Use `backend/src/config/env.ts` with Zod validation.
- ❌ **DO NOT** bypass multi-tenancy: never write `prisma.student.findMany()` without specifying `{ where: { schoolId } }`.
- ❌ **DO NOT** install TailwindCSS v3 utilities or `@apply` directives that conflict with Tailwind v4 CSS variables.
- ❌ **DO NOT** create monolithic 1,000+ line components; break complex pages down into reusable feature sub-components.
- ❌ **DO NOT** push directly to the remote repository. Always ask for permission or instruct the user to verify their PR first.

---

## 📁 6. Standard Module Structure

When implementing a new domain module (e.g. `parents/`, `inventory/`, `transport/`):

```text
backend/src/modules/<module-name>/
├── <module>.routes.ts        # Express Router declarations with middleware guards
├── <module>.controller.ts    # Request/Response handlers, parsing & status codes
├── <module>.service.ts       # Core business logic & Prisma database interactions
├── <module>.schema.ts        # Zod validation schemas for incoming requests
└── <module>.service.spec.ts  # Vitest unit test suite covering success & error branches
```

When creating a new frontend feature:
```text
frontend/src/
├── components/features/<feature>/ # Domain-specific sub-components & views
├── pages/<Feature>Page.tsx        # Top-level route component
└── services/<feature>.service.ts  # Typed API calls using axios client
```
