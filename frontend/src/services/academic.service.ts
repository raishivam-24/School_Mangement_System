/**
 * @file academic.service.ts
 * @description API service for Academic Years, Classes, Sections, and Subjects.
 */

import { api } from '../lib/api';
import type { AcademicYear, ClassItem, SectionItem, SubjectItem } from '../types';

export const academicService = {
  /** List all academic years */
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const res = await api.get('/academics/years');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  /** List all classes with sections & counts */
  getClasses: async (): Promise<ClassItem[]> => {
    const res = await api.get('/academics/classes');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  /** Get class details by ID */
  getClassById: async (classId: string): Promise<ClassItem> => {
    const res = await api.get(`/academics/classes/${classId}`);
    return res.data.data;
  },

  /** Create class with initial sections */
  createClass: async (data: { name: string; numericOrder?: number; sections?: string[] }): Promise<ClassItem> => {
    const res = await api.post('/academics/classes', data);
    return res.data.data;
  },

  /** Create section in an existing class */
  createSection: async (data: { classId: string; name: string; capacity?: number }): Promise<SectionItem> => {
    const res = await api.post('/academics/sections', data);
    return res.data.data;
  },

  /** List all subjects */
  getSubjects: async (): Promise<SubjectItem[]> => {
    const res = await api.get('/academics/subjects');
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  /** Assign a subject and teacher to a class */
  assignSubject: async (data: { classId: string; subjectId: string; teacherId?: string }): Promise<any> => {
    const res = await api.post('/academics/classes/assign-subject', data);
    return res.data.data;
  },
};
