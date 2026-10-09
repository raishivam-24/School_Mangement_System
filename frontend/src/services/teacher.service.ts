/**
 * @file teacher.service.ts
 * @description API service for Teachers and Faculty.
 */

import { api } from '../lib/api';
import type { Teacher, CreateTeacherInput } from '../types';

export const teacherService = {
  /** List teachers with assigned subjects */
  getTeachers: async (): Promise<Teacher[]> => {
    const res = await api.get('/teachers');
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];
    return raw.map((t: any) => ({
      id: t.id,
      employeeId: t.employeeId,
      name: t.name || t.user?.name || 'Faculty Member',
      designation: t.designation || 'Senior Faculty',
      department: t.department || 'Academics',
      email: t.user?.email || t.email || '',
      phone: t.user?.phone || t.phone || '+91 98765 43210',
      qualification: t.qualification || 'M.Sc, B.Ed',
      experience: t.experience || '5+ Years',
      subjects: t.assignedSubjects?.map((as: any) => `${as.class} ${as.subject}`) ||
        (Array.isArray(t.subjects) ? t.subjects : [t.designation || 'General Studies']),
      avatarUrl:
        t.avatarUrl ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      status: (t.status === 'ON_LEAVE' ? 'ON_LEAVE' : 'ACTIVE') as 'ACTIVE' | 'ON_LEAVE',
      joiningDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Active',
    }));
  },

  /** Create teacher profile + user login */
  createTeacher: async (data: CreateTeacherInput): Promise<any> => {
    const res = await api.post('/teachers', data);
    return res.data.data;
  },
};
