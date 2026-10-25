
import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  StudentAttendanceDashboard,
  TeacherClassAttendanceView,
  ParentAttendanceView,
} from '../components/features/attendance';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'PARENT') {
    return <ParentAttendanceView user={user} />;
  }

  if (user?.role === 'STUDENT') {
    return <StudentAttendanceDashboard user={user} />;
  }

  return <TeacherClassAttendanceView />;
};
