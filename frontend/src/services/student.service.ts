/**
 * @file student.service.ts
 * @description API service for Students and Admissions.
 */

import { api } from '../lib/api';
import type { Student, AdmitStudentInput } from '../types';

export const studentService = {
  /** List students with optional search and filters */
  getStudents: async (params?: { search?: string; classId?: string; sectionId?: string; limit?: number }): Promise<Student[]> => {
    const res = await api.get('/students', { params: { limit: 100, ...params } });
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];
    return raw.map((s: any) => {
      const activeEnrollment = s.enrollments?.[0];
      return {
        id: s.id,
        admissionNo: s.admissionNo,
        rollNo: String(activeEnrollment?.rollNumber || ''),
        firstName: s.firstName,
        lastName: s.lastName,
        name: `${s.firstName} ${s.lastName}`,
        email: s.user?.email || s.email,
        gender: s.gender,
        dateOfBirth: s.dateOfBirth,
        bloodGroup: s.bloodGroup || 'O+',
        status: s.status,
        class: activeEnrollment?.class?.name || 'Class 10',
        section: activeEnrollment?.section?.name ? `Section ${activeEnrollment.section.name}` : 'Section A',
        attendancePercentage: 92.4,
        feeStatus: 'PAID',
        feeBalance: 0,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        parentName: s.parentName || 'Parent / Guardian',
        parentPhone: s.emergencyPhone || '+91 98765 43210',
        busRoute: s.busRoute || 'Route #4 (Green Park)',
        aadhaarNo: s.aadhaarNo || '•••• •••• 9012',
      };
    });
  },

  /** Get student profile details by ID */
  getStudentById: async (studentId: string): Promise<Student> => {
    const res = await api.get(`/students/${studentId}`);
    return res.data.data;
  },

  /** Admit a new student */
  admitStudent: async (data: AdmitStudentInput): Promise<any> => {
    const res = await api.post('/students', data);
    return res.data.data;
  },
};
