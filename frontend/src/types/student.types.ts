/**
 * @file student.types.ts
 * @description Domain types for Students, Admissions, and Enrollments.
 */

export interface Student {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  dob?: string;
  bloodGroup?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'GRADUATED';
  class: string;
  section: string;
  attendancePercentage?: number;
  attendanceRate?: number;
  feeStatus?: 'PAID' | 'PARTIAL' | 'OVERDUE';
  feeBalance?: number;
  avatarUrl?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  address?: string;
  busRoute?: string;
  aadhaarNo?: string;
}

export interface AdmitStudentInput {
  admissionNo?: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  rollNumber?: string | number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  email?: string;
  password?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyPhone?: string;
  emergencyContact?: string;
  address?: string;
  busRoute?: string;
  aadhaarNo?: string;
  createLoginAccount?: boolean;
}
