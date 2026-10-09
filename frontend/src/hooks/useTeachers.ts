/**
 * @file useTeachers.ts
 * @description TanStack Query hooks for Faculty listing and creation.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '../services';
import type { CreateTeacherInput } from '../types';

export const TEACHER_KEYS = {
  all: ['teachers'] as const,
  lists: () => [...TEACHER_KEYS.all, 'list'] as const,
};

export const useTeachers = () => {
  return useQuery({
    queryKey: TEACHER_KEYS.lists(),
    queryFn: teacherService.getTeachers,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherInput) => teacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
    },
  });
};
