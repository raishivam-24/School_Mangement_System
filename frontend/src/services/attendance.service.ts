/**
 * @file attendance.service.ts
 * @description API service for Class Attendance rosters, submit batch, and student history.
 */

import { api } from '../lib/api';
import type {
  AttendanceSheetResponse,
  SubmitAttendanceInput,
  StudentAttendanceSummary,
} from '../types';

export const attendanceService = {
  /** Get attendance sheet for class, section, and date */
  getSheet: async (params: { date: string; classId: string; sectionId: string }): Promise<AttendanceSheetResponse> => {
    const res = await api.get('/attendance', { params });
    return res.data?.data;
  },

  /** Submit or update attendance records */
  submitAttendance: async (data: SubmitAttendanceInput): Promise<any> => {
    const res = await api.post('/attendance', data);
    return res.data.data;
  },

  /** Get individual student attendance history and percentage */
  getStudentAttendance: async (studentId: string, params?: { startDate?: string; endDate?: string }): Promise<StudentAttendanceSummary> => {
    const res = await api.get(`/attendance/student/${studentId}`, { params });
    return res.data?.data;
  },
};
