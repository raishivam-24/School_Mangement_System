/**
 * @file useAnnouncements.ts
 * @description TanStack Query hooks for Announcements, Circulars, and Notices.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../services';
import type { CreateAnnouncementInput } from '../types';

export const ANNOUNCEMENT_KEYS = {
  all: ['announcements'] as const,
};

export const useAnnouncements = () => {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.all,
    queryFn: announcementService.getAnnouncements,
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementInput) => announcementService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.all });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.all });
    },
  });
};
