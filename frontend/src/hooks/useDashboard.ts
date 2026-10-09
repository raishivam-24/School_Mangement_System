/**
 * @file useDashboard.ts
 * @description TanStack Query hooks for Dashboard KPIs and aggregations.
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services';

export const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  schoolAdmin: () => [...DASHBOARD_KEYS.all, 'schoolAdmin'] as const,
  superAdmin: () => [...DASHBOARD_KEYS.all, 'superAdmin'] as const,
};

export const useSchoolAdminDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.schoolAdmin(),
    queryFn: dashboardService.getSchoolAdminDashboard,
    staleTime: 1000 * 60 * 2,
  });
};

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.superAdmin(),
    queryFn: dashboardService.getSuperAdminDashboard,
    staleTime: 1000 * 60 * 5,
  });
};
