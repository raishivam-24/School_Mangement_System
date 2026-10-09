/**
 * @file DashboardPage.tsx
 * @description Role-Aware Operational Dashboard Orchestrator.
 * Dynamically routes to dedicated, domain-isolated dashboard views for:
 * - 🎓 Student (CBSE roll metrics, timetable, performance bar chart, and tasks)
 * - 👨‍🏫 Teacher (Period agenda, homework publisher, attendance quick links)
 * - 🏫 School Admin (Institutional metrics, ₹ INR fee collections, campus attendance)
 * - 👨‍👩‍👧 Parent (Child progress, instant UPI fee payment, digital almanac)
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  StudentDashboardView,
  TeacherDashboardView,
  SchoolAdminDashboardView,
  ParentDashboardView,
} from '../components/features/dashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'STUDENT':
      return <StudentDashboardView user={user} />;
    case 'TEACHER':
      return <TeacherDashboardView user={user} />;
    case 'PARENT':
      return <ParentDashboardView user={user} />;
    case 'SUPER_ADMIN':
    case 'SCHOOL_ADMIN':
    default:
      return <SchoolAdminDashboardView user={user} />;
  }
};

export default DashboardPage;
