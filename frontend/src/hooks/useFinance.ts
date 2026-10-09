/**
 * @file useFinance.ts
 * @description TanStack Query hooks for Finance summary, invoices, payments, and fee structures.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService } from '../services';
import type {
  CollectPaymentInput,
  CreateFeeStructureInput,
  GenerateInvoicesInput,
} from '../types';

export const FINANCE_KEYS = {
  all: ['finance'] as const,
  summary: (academicYearId?: string) => [...FINANCE_KEYS.all, 'summary', academicYearId] as const,
  invoices: (params?: { studentId?: string; status?: string; search?: string }) =>
    [...FINANCE_KEYS.all, 'invoices', params] as const,
};

export const useFinanceSummary = (academicYearId?: string) => {
  return useQuery({
    queryKey: FINANCE_KEYS.summary(academicYearId),
    queryFn: () => financeService.getSummary(academicYearId),
    staleTime: 1000 * 60 * 3, // 3 mins fresh
  });
};

export const useInvoices = (params?: { studentId?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: FINANCE_KEYS.invoices(params),
    queryFn: () => financeService.getInvoices(params),
    staleTime: 1000 * 60 * 3,
  });
};

export const useCollectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CollectPaymentInput) => financeService.collectPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { structure: CreateFeeStructureInput; generateDueDate: string }) => {
      const created = await financeService.createFeeStructure(data.structure);
      if (created?.id) {
        await financeService.generateInvoices({
          academicYearId: data.structure.academicYearId,
          feeStructureId: created.id,
          classId: data.structure.classId,
          dueDate: data.generateDueDate,
        });
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FINANCE_KEYS.all });
    },
  });
};
