/**
 * @file timetable.service.ts
 * @description Frontend API service for Weekly Timetables, Room Schedules, and Period Slot Management.
 */

import { api } from '../lib/api';

export interface TimetableEntry {
  id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId?: string | null;
  dayOfWeek: number; // 1 = Monday, 6 = Saturday
  periodNumber: number;
  startTime: string;
  endTime: string;
  roomNumber?: string | null;
  subject?: { name: string; code: string };
  teacher?: { id: string; user: { name: string } };
  class?: { name: string };
  section?: { name: string };
}

export interface CreateTimetableEntryDto {
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId?: string;
  dayOfWeek: number;
  periodNumber: number;
  startTime: string;
  endTime: string;
  roomNumber?: string;
}

export interface TimetableFilters {
  classId?: string;
  sectionId?: string;
  teacherId?: string;
  academicYearId?: string;
}

export const timetableService = {
  /**
   * Fetch timetable entries matching filters
   */
  async getTimetable(filters?: TimetableFilters): Promise<TimetableEntry[]> {
    const response = await api.get<{ data: TimetableEntry[] }>('/timetable', { params: filters });
    return response.data.data;
  },

  /**
   * Create a new period slot in the timetable
   */
  async createEntry(data: CreateTimetableEntryDto): Promise<TimetableEntry> {
    const response = await api.post<{ data: TimetableEntry }>('/timetable', data);
    return response.data.data;
  },

  /**
   * Delete a period slot
   */
  async deleteEntry(id: string): Promise<void> {
    await api.delete(`/timetable/${id}`);
  },
};
