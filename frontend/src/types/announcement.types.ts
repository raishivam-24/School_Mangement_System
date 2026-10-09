/**
 * @file announcement.types.ts
 * @description Domain types for School Announcements, Notices, and Circulars.
 */

export type AudienceType = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS';
export type AnnouncementPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type NoticeCategory = 'ALL' | 'EXAM' | 'EVENT' | 'HOLIDAY' | 'GENERAL' | 'URGENT';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: AudienceType;
  targetClassId?: string;
  priority: AnnouncementPriority;
  category?: NoticeCategory;
  isPublished: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  updatedAt?: string;
  author?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  targetAudience: AudienceType;
  targetClassId?: string;
  priority: AnnouncementPriority;
  attachmentUrl?: string;
  attachmentName?: string;
}
