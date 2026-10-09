/**
 * @file teacher.types.ts
 * @description Domain types for Teachers, Faculty, and Staff.
 */

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  subjects: string[];
  avatarUrl: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  joiningDate?: string;
}

export interface CreateTeacherInput {
  employeeId: string;
  name: string;
  email: string;
  password?: string;
  designation: string;
  department?: string;
  qualification?: string;
  experience?: string;
  subjects?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
}
