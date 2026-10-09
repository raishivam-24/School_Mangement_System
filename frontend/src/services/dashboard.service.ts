/**
 * @file dashboard.service.ts
 * @description API service for Dashboard aggregations and KPIs.
 */

import { api } from '../lib/api';

export interface SchoolAdminKpi {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  todayAttendance: {
    rate: number;
    present: number;
    absent: number;
    total: number;
  };
  fees: {
    totalBilled: number;
    totalCollected: number;
    totalPending: number;
    collectionRate: number;
  };
}

export interface SchoolAdminDashboardData {
  kpi: SchoolAdminKpi;
  recentAnnouncements: any[];
  upcomingExams: any[];
}

export const dashboardService = {
  /** Get School Admin Dashboard aggregations */
  getSchoolAdminDashboard: async (): Promise<SchoolAdminDashboardData> => {
    const res = await api.get('/dashboard');
    return res.data?.data;
  },

  /** Get Super Admin Platform Dashboard */
  getSuperAdminDashboard: async (): Promise<any> => {
    const res = await api.get('/admin/dashboard');
    return res.data?.data;
  },
};
