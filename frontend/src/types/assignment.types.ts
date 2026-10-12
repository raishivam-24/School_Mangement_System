/**
 * @file assignment.types.ts
 * @description Types for Homework, Assignments, and Student Submissions.
 */

export interface Assignment {
  id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  sectionId?: string | null;
  subjectId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  attachmentUrl?: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  class?: { id?: string; name: string };
  section?: { id?: string; name: string };
  subject?: { id?: string; name: string; code?: string };
  teacher?: { id?: string; user?: { name: string; email?: string } };
  submissions?: AssignmentSubmission[];
  _count?: { submissions: number };
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content?: string;
  attachmentUrl?: string | null;
  marksObtained?: number | null;
  feedback?: string | null;
  status?: string;
  student?: {
    id: string;
    admissionNo: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateAssignmentPayload {
  academicYearId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks?: number;
  attachmentUrl?: string;
}

export interface SubmitAssignmentPayload {
  content?: string;
  attachmentUrl?: string;
}

export interface GradeSubmissionPayload {
  marksObtained: number;
  feedback?: string;
}
