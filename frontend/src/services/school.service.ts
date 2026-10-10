/**
 * @file school.service.ts
 * @description API service for Super Admin School Tenant Management.
 */

import { api } from '../lib/api';

export interface SchoolTenant {
  id: string;
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  maxStudents: number;
  createdAt: string;
  _count?: {
    students: number;
    teachers: number;
    classes: number;
  };
  subscriptions?: Array<{
    plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
    status: string;
    amount: number;
    currentPeriodEnd: string;
  }>;
}

export interface CreateSchoolDto {
  name: string;
  code: string;
  email: string;
  phone?: string;
  address?: string;
  maxStudents?: number;
  plan?: 'BASIC' | 'PRO' | 'ENTERPRISE';
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface UpdateSchoolDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  maxStudents?: number;
}

export const schoolService = {
  /** List all schools with search and status filter */
  listSchools: async (params?: { search?: string; status?: string; page?: number }): Promise<{ schools: SchoolTenant[]; total: number }> => {
    const res = await api.get('/schools', { params });
    const data = res.data?.data;
    if (Array.isArray(data)) {
      return { schools: data, total: data.length };
    }
    return {
      schools: data?.schools || data?.items || [],
      total: data?.total || (data?.schools || []).length,
    };
  },

  /** Get single school details */
  getSchool: async (id: string): Promise<SchoolTenant> => {
    const res = await api.get(`/schools/${id}`);
    return res.data?.data;
  },

  /** Provision new school tenant */
  createSchool: async (data: CreateSchoolDto): Promise<SchoolTenant> => {
    const res = await api.post('/schools', data);
    return res.data?.data;
  },

  /** Update school metadata or suspend/activate */
  updateSchool: async (id: string, data: UpdateSchoolDto): Promise<SchoolTenant> => {
    const res = await api.patch(`/schools/${id}`, data);
    return res.data?.data;
  },
};
