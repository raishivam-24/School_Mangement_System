/**
 * @file attendance.types.ts
 * @description Domain types for Class Attendance, Rosters, and Student Records.
 */

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'EXCUSED';

export interface StudentRosterItem {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  gender: 'MALE' | 'FEMALE';
  status: AttendanceStatus;
  reason?: string;
}

export interface AttendanceSheetResponse {
  attendanceId: string | null;
  date: string;
  isMarked: boolean;
  summary: {
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
  };
  roster: Array<{
    studentId: string;
    admissionNo: string;
    name: string;
    rollNumber: number;
    status: AttendanceStatus;
    reason: string | null;
  }>;
}

export interface SubmitAttendanceInput {
  date: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  remarks?: string;
  records: Array<{
    studentId: string;
    status: AttendanceStatus;
    reason?: string;
  }>;
}

export interface StudentAttendanceSummary {
  studentId: string;
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    percentage: number;
  };
  records: Array<{
    id: string;
    date: string;
    status: AttendanceStatus;
    reason?: string | null;
  }>;
}
