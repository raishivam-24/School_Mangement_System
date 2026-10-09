/**
 * @file academic.types.ts
 * @description Domain types for Academic Years, Classes, Sections, and Subjects.
 */

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  _count?: {
    enrollments: number;
    exams: number;
  };
}

export interface SectionItem {
  id: string;
  name: string;
  capacity?: number;
  classId: string;
  classTeacher?: string;
  studentsCount?: number;
  _count?: {
    enrollments: number;
  };
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  type?: 'THEORY' | 'PRACTICAL' | 'BOTH';
}

export interface ClassItem {
  id: string;
  name: string;
  numericOrder?: number;
  order?: number;
  code?: string;
  subjectsCount?: number;
  totalStudents?: number;
  sections: SectionItem[];
  classSubjects?: Array<{
    id: string;
    subject: SubjectItem;
    teacher?: {
      user: { name: string };
    };
  }>;
  _count?: {
    enrollments: number;
  };
}
