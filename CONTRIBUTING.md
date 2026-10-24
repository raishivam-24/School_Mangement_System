# 🛠️ Contributor Onboarding & Local Setup Guide

Welcome! This guide gets you up and running with the **School Management System** in under **5 minutes**. 

You do **NOT** need AWS, Cloudflare, Razorpay, or Redis credentials to develop and test features locally.

---

## ⚡ Prerequisites

Make sure you have installed:
- **Node.js**: v20 or v22 LTS ([Download](https://nodejs.org/))
- **npm**: v10+ (comes bundled with Node)
- **PostgreSQL Database**: Either a local PostgreSQL instance or a free cloud database (see Step 1 below).

---

## 🚀 5-Minute Quick Setup

### Step 1: Get a PostgreSQL Database (Choose one)

- **Option A (Recommended — Free Cloud DB in 60s, No install)**:
  1. Go to [Neon.tech](https://neon.tech/) and create a free account.
  2. Create a project and copy the PostgreSQL connection string.
  
- **Option B (Docker)**:
  ```bash
  docker run --name school-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=school_db -p 5432:5432 -d postgres:15
  # Connection string: postgresql://postgres:postgres@localhost:5432/school_db?schema=public
  ```

- **Option C (Local Postgres)**:
  Ensure your local PostgreSQL server is running and create a database named `school_db`.

---

### Step 2: Configure Backend Minimal Environment

Navigate into the `backend/` folder and create your `.env` file:

```bash
cd backend
```

Create a file named `.env` and paste **only these 4 lines**:

```env
PORT=5000
DATABASE_URL="your_postgresql_connection_string_here"
JWT_ACCESS_SECRET="dev_secret_jwt_access_key_min_16_characters"
JWT_REFRESH_SECRET="dev_secret_jwt_refresh_key_min_16_characters"
```

> 💡 **Note**: Storage automatically defaults to local disk (`uploads/`), and optional services (payments, Redis, emails) run in safe sandbox mock mode.

---

### Step 3: Install Dependencies, Migrate & Seed Data

In the `backend/` directory, run:

```bash
# 1. Install packages
npm install

# 2. Generate Prisma type-safe client
npm run prisma:generate

# 3. Push schema to your database (creates all 22 tables)
npm run prisma:push

# 4. Seed sample CBSE classes, demo school, students, and teachers
npm run prisma:seed
```

---

### Step 4: Start Backend Server

```bash
npm run dev
```
Your backend API will be live at `http://localhost:5000/api/v1` (Health check: `http://localhost:5000/health`).

---

### Step 5: Start Frontend App

In a **new terminal tab/window**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **`http://localhost:5173`**.
*(Frontend connects to `http://localhost:5000/api/v1` by default — no frontend `.env` file is needed!)*

---

## 🔑 Demo Login Accounts

After running `npm run prisma:seed`, you can log in with any of these pre-configured accounts:

| Role | Email | Password | What You Can Access |
| :--- | :--- | :--- | :--- |
| **School Admin** | `admin@dpa.edu` | `Admin@Secure123!` | Full School Tenant Operations, Academics, Fees, Attendance |
| **Teacher** | `amit.sharma@dpa.edu` | `Teacher@Secure123!` | Teacher Dashboard, Class Subjects, Attendance roll call |
| **Student** | `rahul.sharma@dpa.edu` | `Student@Secure123!` | Student Dashboard, Homework submissions, Fee dues, Report cards |
| **Super Admin** | `superadmin@platform.com` | `SuperAdmin@Secure123!` | Platform SaaS metrics, School provisioning, Subscriptions |

---

## 🧪 Running Tests & Validating Your Code

Before submitting a Pull Request, run tests to ensure your changes didn't break anything:

```bash
# Backend unit & integration tests
cd backend && npm test

# Frontend component & utility tests
cd frontend && npm test
```

All Pull Requests trigger automated GitHub Actions to test your code.
