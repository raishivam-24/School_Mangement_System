/**
 * @file app.ts
 * @description Central Express Application Setup.
 * Configures security headers, CORS with credentials, cookie parsing, route mounting, and global error handling.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { AppError } from './utils/apiError.js';

// Route imports
import { authRoutes } from './modules/auth/auth.routes.js';
import { schoolRoutes } from './modules/schools/schools.routes.js';
import { academicRoutes } from './modules/academics/academics.routes.js';
import { parentRoutes } from './modules/parents/parent.routes.js';
import { studentRoutes } from './modules/students/students.routes.js';
import { teacherRoutes } from './modules/teachers/teachers.routes.js';
import { attendanceRoutes } from './modules/attendance/attendance.routes.js';
import { financeRoutes } from './modules/finance/finance.routes.js';
import { examRoutes } from './modules/examinations/exams.routes.js';
import { timetableRoutes } from './modules/timetable/timetable.routes.js';
import { assignmentRoutes } from './modules/assignments/assignments.routes.js';
import { announcementRoutes } from './modules/announcements/announcements.routes.js';
import { dashboardRoutes } from './modules/dashboards/dashboard.routes.js';
import { reportRoutes } from './modules/reports/reports.routes.js';
import path from 'path';
import { subscriptionRoutes } from './modules/subscriptions/subscriptions.routes.js';
import { uploadRoutes } from './modules/uploads/uploads.routes.js';
import { notificationRoutes } from './modules/notifications/notifications.routes.js';

export const createApp = (): Express => {
  const app = express();

  // 1. Core Security & Parsing Middleware
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true, // Required for HttpOnly Cookies
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-school-id'],
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(requestLogger);

  // Serve static uploaded files
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR || 'uploads')));

  // 2. Health check & Root ping
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      name: 'School Management SaaS API',
      version: '1.0.0',
      apiPrefix: env.API_PREFIX,
      status: 'running',
    });
  });

  // 3. Mount Versioned API Modules
  const apiPrefix = env.API_PREFIX;
  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/schools`, schoolRoutes);
  app.use(`${apiPrefix}/academics`, academicRoutes);
  app.use(`${apiPrefix}/parent`, parentRoutes);
  app.use(`${apiPrefix}/students`, studentRoutes);
  app.use(`${apiPrefix}/teachers`, teacherRoutes);
  app.use(`${apiPrefix}/attendance`, attendanceRoutes);
  app.use(`${apiPrefix}/finance`, financeRoutes);
  app.use(`${apiPrefix}/exams`, examRoutes);
  app.use(`${apiPrefix}/timetable`, timetableRoutes);
  app.use(`${apiPrefix}/assignments`, assignmentRoutes);
  app.use(`${apiPrefix}/announcements`, announcementRoutes);
  app.use(`${apiPrefix}/reports`, reportRoutes);
  app.use(`${apiPrefix}/subscriptions`, subscriptionRoutes);
  app.use(`${apiPrefix}/uploads`, uploadRoutes);
  app.use(`${apiPrefix}/notifications`, notificationRoutes);
  app.use(`${apiPrefix}`, dashboardRoutes); // mounts /admin/dashboard and /dashboard

  // 4. Catch-all for undefined routes
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(AppError.notFound(`Cannot find route ${req.method} ${req.originalUrl}`));
  });

  // 5. Global Centralized Error Handler
  app.use(errorHandler);

  return app;
};
