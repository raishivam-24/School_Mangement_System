/**
 * @file announcement.service.ts
 * @description API service for School Announcements and Circulars.
 */

import { api } from '../lib/api';
import type { Announcement, CreateAnnouncementInput } from '../types';

export const announcementService = {
  /** List announcements tailored for the viewing user's role */
  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await api.get('/announcements');
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];
    return raw.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      targetAudience: a.targetAudience,
      targetClassId: a.targetClassId,
      priority: a.priority,
      category: (a.priority === 'URGENT' ? 'URGENT' : a.category || 'GENERAL'),
      isPublished: a.isPublished,
      attachmentUrl: a.attachmentUrl,
      attachmentName: a.attachmentName,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      author: a.author,
    }));
  },

  /** Publish a new school announcement */
  createAnnouncement: async (data: CreateAnnouncementInput): Promise<Announcement> => {
    const res = await api.post('/announcements', data);
    return res.data?.data;
  },

  /** Delete an announcement */
  deleteAnnouncement: async (id: string): Promise<boolean> => {
    await api.delete(`/announcements/${id}`);
    return true;
  },
};
