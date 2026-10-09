/**
 * @file useStudents.ts
 * @description TanStack Query hooks for Students listing, details, and admissions.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services';
import type { AdmitStudentInput } from '../types';

export const STUDENT_KEYS = {
  all: ['students'] as const,
  lists: () => [...STUDENT_KEYS.all, 'list'] as const,
  list: (params?: { search?: string; classId?: string; sectionId?: string }) =>
    [...STUDENT_KEYS.lists(), params] as const,
  details: () => [...STUDENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...STUDENT_KEYS.details(), id] as const,
};

export const useStudents = (params?: { search?: string; classId?: string; sectionId?: string }) => {
  return useQuery({
    queryKey: STUDENT_KEYS.list(params),
    queryFn: () => studentService.getStudents(params),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
};

export const useStudentDetail = (studentId: string) => {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(studentId),
    queryFn: () => studentService.getStudentById(studentId),
    enabled: !!studentId,
  });
};

export const useAdmitStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdmitStudentInput) => studentService.admitStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
    },
  });
};
