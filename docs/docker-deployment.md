# Docker Deployment Guide — SchoolHub SaaS

This guide explains how to build, run, and manage the containerized multi-tenant School Management System using Docker and Docker Compose.

---

## 🏛️ Architecture Overview

The system is configured as a multi-container stack connected via an internal bridge network (`schoolhub_network`):

| Service | Technology | Port (Host:Container) | Description |
| :--- | :--- | :--- | :--- |
| **`postgres`** | PostgreSQL 16 (Alpine) | `5432:5432` | Relational database with persistent storage volume (`schoolhub_postgres_data`) and health check. |
| **`backend`** | Node.js 22, Express, Prisma 7, TypeScript | `5000:5000` | REST API service. Runs Prisma schema migration on startup. |
| **`frontend`** | React 19, Vite, Tailwind CSS, Nginx (Alpine) | `80:80` & `5173:80` | High-performance Nginx web server serving SPA bundles and proxying `/api/` to the backend. |

---

## 🚀 Quick Start (Single Command)

### 1. Ensure Docker Desktop is Running
Make sure Docker Desktop is launched on your machine.

### 2. Configure Environment (Optional)
The `docker-compose.yml` includes sensible defaults for all services. To override any settings, copy the example file:
```bash
cp .env.example .env
```

### 3. Build & Start the Containers
Run the following command from the project root:
```bash
docker compose up -d --build
```

Docker Compose will:
1. Initialize the PostgreSQL container and verify its health check (`pg_isready`).
2. Build the backend image, generate the Prisma client, and start the Express server.
3. Build the frontend production bundle and serve it via Nginx.

---

## 🌐 Access Endpoints

Once the containers are up, access the services:

* **Web Application (Frontend):**
  * `http://localhost` (Standard HTTP)
  * `http://localhost:5173` (Vite compatibility port)
* **API Documentation & Endpoints:**
  * Base API: `http://localhost:5000/api/v1`
  * Backend Health Check: `http://localhost:5000/health`
  * Frontend Health Check: `http://localhost/health`
* **PostgreSQL Database:**
  * Host: `localhost`
  * Port: `5432`
  * Database: `school_management_db`
  * User: `postgres`
  * Password: `postgres`

---

## 🌱 Seeding Initial Demo Data

To populate the database with the Platform Super Admin, Demo School Tenant (Delhi Public Academy), classes, teachers, students, and sample timetable/attendance data, run:

```bash
docker compose exec backend npm run seed
```

### Default Login Credentials:
* **Super Admin:** `superadmin@platform.com` / `SuperAdmin@Secure123!`
* **School Admin:** `admin@dpa.edu` / `Admin@123456`
* **Teacher:** `amit.sharma@dpa.edu` / `Teacher@123456`
* **Student:** `rahul.sharma@student.dpa.edu` / `Student@123456`

---

## 🛠️ Useful Management Commands

### View Live Container Logs
```bash
# View logs from all services
docker compose logs -f

# View logs from a specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Check Container Status
```bash
docker compose ps
```

### Open an Interactive Shell Inside a Container
```bash
# Backend shell
docker compose exec -it backend sh

# Database shell (psql)
docker compose exec -it postgres psql -U postgres -d school_management_db
```

### Stop the Containers
```bash
# Stop containers without deleting data
docker compose down

# Stop containers and remove persistent volumes (fresh reset)
docker compose down -v
```

---

## 💡 Troubleshooting

* **Docker daemon not running:**
  * If you see `failed to connect to the docker API at npipe`, start **Docker Desktop** from the Windows Start menu and wait for the engine to initialize.
* **Port conflicts:**
  * If port `5432` or `5000` is already in use by a local service, modify `POSTGRES_PORT` or `BACKEND_PORT` in your `.env` file.
