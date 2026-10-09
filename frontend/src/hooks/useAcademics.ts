/**
 * @file useAcademics.ts
 * @description TanStack Query hooks for Classes, Sections, Subjects, and Academic Years.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicService } from '../services';

export const ACADEMIC_KEYS = {
  all: ['academics'] as const,
  years: () => [...ACADEMIC_KEYS.all, 'years'] as const,
  classes: () => [...ACADEMIC_KEYS.all, 'classes'] as const,
  subjects: () => [...ACADEMIC_KEYS.all, 'subjects'] as const,
};

export const useAcademicYears = () => {
  return useQuery({
    queryKey: ACADEMIC_KEYS.years(),
    queryFn: academicService.getAcademicYears,
    staleTime: 1000 * 60 * 10,
  });
};

export const useClasses = () => {
  return useQuery({
    queryKey: ACADEMIC_KEYS.classes(),
    queryFn: academicService.getClasses,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ACADEMIC_KEYS.subjects(),
    queryFn: academicService.getSubjects,
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academicService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_KEYS.classes() });
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: academicService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_KEYS.classes() });
    },
  });
};
