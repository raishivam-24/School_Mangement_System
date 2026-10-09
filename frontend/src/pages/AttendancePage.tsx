/**
 * @file AttendancePage.tsx
 * @description Role-Aware Attendance Page Orchestrator.
 * - Students / Parents: Read-only personal compliance dashboard, visual punch log, leave application.
 * - Teachers & Admins: Interactive class roll call puncher & institutional dot matrix.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  StudentAttendanceDashboard,
  TeacherClassAttendanceView,
} from '../components/features/attendance';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();

  // If user is a Student or Parent, strictly render the read-only personal attendance dashboard
  if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
    return <StudentAttendanceDashboard user={user} />;
  }

  // Teachers, School Admins, and Super Admins see the interactive class roll call puncher
  return <TeacherClassAttendanceView />;
};

export default AttendancePage;
