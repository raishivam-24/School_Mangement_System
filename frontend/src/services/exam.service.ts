/**
 * @file exam.service.ts
 * @description Frontend API service for Examinations, Date Sheets, Marks Entry, and CBSE Report Cards.
 */

import { api } from '../lib/api';

export interface ExamSubject {
  id: string;
  examId: string;
  classId: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  roomNumber?: string;
  class?: { name: string };
  subject?: { name: string; code: string };
  _count?: { results: number };
}

export interface ExamItem {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;
  term?: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  academicYear?: { name: string };
  subjects?: ExamSubject[];
  _count?: { subjects: number };
}

export interface CreateExamDto {
  academicYearId: string;
  name: string;
  term?: string;
  startDate: string;
  endDate: string;
}

export interface AddExamSubjectDto {
  classId: string;
  subjectId: string;
  examDate: string;
  startTime: string;
  endTime: string;
  maxMarks?: number;
  passMarks?: number;
  roomNumber?: string;
}

export interface SubmitMarksDto {
  examSubjectId: string;
  marks: Array<{
    studentId: string;
    marksObtained: number;
    remarks?: string;
  }>;
}

export interface ReportCardResponse {
  school: {
    name: string;
    code: string;
    affiliationNo?: string;
    board: string;
    address?: string;
  };
  student: {
    id: string;
    admissionNo: string;
    name: string;
    className: string;
    sectionName: string;
    rollNumber?: number;
    avatarUrl?: string;
  };
  exam: {
    id: string;
    name: string;
    academicYear: string;
  };
  results: Array<{
    subjectName: string;
    subjectCode: string;
    maxMarks: number;
    passMarks: number;
    marksObtained: number;
    percentage: number;
    grade: string;
    status: 'PASSED' | 'FAILED';
    remarks?: string;
  }>;
  summary: {
    totalMaxMarks: number;
    totalMarksObtained: number;
    overallPercentage: number;
    overallGrade: string;
    status: 'PASSED' | 'FAILED';
  };
}

export const examService = {
  /**
   * Fetch all exams for current school
   */
  async listExams(academicYearId?: string): Promise<ExamItem[]> {
    const params = academicYearId ? { academicYearId } : {};
    const response = await api.get<{ data: ExamItem[] }>('/exams', { params });
    return response.data.data;
  },

  /**
   * Fetch complete exam details with scheduled subjects and result counts
   */
  async getExamDetails(id: string): Promise<ExamItem> {
    const response = await api.get<{ data: ExamItem }>(`/exams/${id}`);
    return response.data.data;
  },

  /**
   * Create a new Exam term
   */
  async createExam(data: CreateExamDto): Promise<ExamItem> {
    const response = await api.post<{ data: ExamItem }>('/exams', data);
    return response.data.data;
  },

  /**
   * Add a scheduled subject / datesheet slot to an Exam
   */
  async addExamSubject(examId: string, data: AddExamSubjectDto): Promise<ExamSubject> {
    const response = await api.post<{ data: ExamSubject }>(`/exams/${examId}/subjects`, data);
    return response.data.data;
  },

  /**
   * Submit marks for students in an exam subject
   */
  async submitMarks(data: SubmitMarksDto): Promise<{ success: boolean; count: number }> {
    const response = await api.post<{ data: { success: boolean; count: number } }>('/exams/marks', data);
    return response.data.data;
  },

  /**
   * Fetch official CBSE-format Student Report Card
   */
  async getStudentReportCard(examId: string, studentId: string): Promise<ReportCardResponse> {
    const response = await api.get<{ data: ReportCardResponse }>(`/exams/${examId}/report-card/${studentId}`);
    return response.data.data;
  },
};
