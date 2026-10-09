/**
 * @file useAttendance.ts
 * @description TanStack Query hooks for Attendance sheets, daily submissions, and student punch logs.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services';
import type { SubmitAttendanceInput } from '../types';

export const ATTENDANCE_KEYS = {
  all: ['attendance'] as const,
  sheet: (date: string, classId: string, sectionId: string) =>
    [...ATTENDANCE_KEYS.all, 'sheet', date, classId, sectionId] as const,
  student: (studentId: string) => [...ATTENDANCE_KEYS.all, 'student', studentId] as const,
};

export const useAttendanceSheet = (date: string, classId: string, sectionId: string) => {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.sheet(date, classId, sectionId),
    queryFn: () => attendanceService.getSheet({ date, classId, sectionId }),
    enabled: !!date && !!classId && !!sectionId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useStudentAttendance = (studentId: string) => {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.student(studentId),
    queryFn: () => attendanceService.getStudentAttendance(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmitAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitAttendanceInput) => attendanceService.submitAttendance(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_KEYS.sheet(variables.date, variables.classId, variables.sectionId),
      });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
