/**
 * @file report.service.ts
 * @description Frontend API service for Compliance, Attendance, and Financial Institutional Reports.
 */

import { api } from '../lib/api';

export interface AttendanceReportData {
  totalRecords: number;
  overallPresentPercentage: number;
  classBreakdown?: Array<{
    className: string;
    sectionName: string;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
  }>;
  defaulters?: Array<{
    studentId: string;
    studentName: string;
    className: string;
    attendanceRate: number;
  }>;
}

export interface FeeReportData {
  totalInvoiced: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
  paymentModeBreakdown?: Record<string, number>;
}

export const reportService = {
  /**
   * Fetch institutional attendance report & defaulter analytics
   */
  async getAttendanceReport(academicYearId?: string): Promise<AttendanceReportData> {
    const params = academicYearId ? { academicYearId } : {};
    const response = await api.get<{ data: AttendanceReportData }>('/reports/attendance', { params });
    return response.data.data;
  },

  /**
   * Fetch institutional fee collection report
   */
  async getFeeReport(academicYearId?: string): Promise<FeeReportData> {
    const params = academicYearId ? { academicYearId } : {};
    const response = await api.get<{ data: FeeReportData }>('/reports/fees', { params });
    return response.data.data;
  },
};
