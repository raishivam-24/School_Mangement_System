/**
 * @file assignment.service.ts
 * @description API service for Homework, Assignments, Submissions, and Grading.
 */

import { api } from '../lib/api';
import type {
  Assignment,
  CreateAssignmentPayload,
  SubmitAssignmentPayload,
  GradeSubmissionPayload,
} from '../types';

export const assignmentService = {
  /**
   * List assignments with optional class, section, or subject filters
   */
  getAssignments: async (filters?: {
    classId?: string;
    sectionId?: string;
    subjectId?: string;
  }): Promise<Assignment[]> => {
    const res = await api.get('/assignments', { params: filters });
    return Array.isArray(res.data?.data) ? res.data.data : [];
  },

  /**
   * Fetch single assignment details with submissions list
   */
  getAssignmentById: async (id: string): Promise<Assignment> => {
    const res = await api.get(`/assignments/${id}`);
    return res.data?.data;
  },

  /**
   * Broadcast / Create a new assignment (Teachers & Admins)
   */
  createAssignment: async (payload: CreateAssignmentPayload): Promise<Assignment> => {
    const res = await api.post('/assignments', payload);
    return res.data?.data;
  },

  /**
   * Submit homework assignment (Students)
   */
  submitAssignment: async (
    assignmentId: string,
    payload: SubmitAssignmentPayload
  ): Promise<any> => {
    const res = await api.post(`/assignments/${assignmentId}/submit`, payload);
    return res.data?.data;
  },

  /**
   * Grade student submission (Teachers & Admins)
   */
  gradeSubmission: async (
    submissionId: string,
    payload: GradeSubmissionPayload
  ): Promise<any> => {
    const res = await api.post(`/assignments/submissions/${submissionId}/grade`, payload);
    return res.data?.data;
  },
};
