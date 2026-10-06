/**
 * @file finance.controller.ts
 * @description Controller for Fee Structures, Invoices, and Payment collections.
 */

import { Request, Response, NextFunction } from 'express';
import { FinanceService } from './finance.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';
import { InvoiceStatus } from '@prisma/client';

export class FinanceController {
  static async createFeeStructure(req: Request, res: Response, next: NextFunction) {
    try {
      const feeStructure = await FinanceService.createFeeStructure(req.schoolId!, req.body);
      return ApiResponse.created(res, feeStructure, 'Fee structure created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listFeeStructures(req: Request, res: Response, next: NextFunction) {
    try {
      const structures = await FinanceService.listFeeStructures(
        req.schoolId!,
        req.query.academicYearId as string
      );
      return ApiResponse.success(res, structures);
    } catch (error) {
      next(error);
    }
  }

  static async generateInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.generateInvoices(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, result, 'Invoices generated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationParams(req);
      const { studentId, status, search, academicYearId } = req.query as {
        studentId?: string;
        status?: InvoiceStatus;
        search?: string;
        academicYearId?: string;
      };

      const { total, invoices } = await FinanceService.listInvoices(req.schoolId!, pagination, {
        studentId,
        status,
        search,
        academicYearId,
      });

      const meta = buildPaginationMeta(total, pagination);
      return ApiResponse.success(res, invoices, 'Invoices fetched successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async collectPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FinanceService.collectPayment(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, result, 'Payment recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getFeeSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await FinanceService.getFeeSummary(
        req.schoolId!,
        req.query.academicYearId as string
      );
      return ApiResponse.success(res, summary);
    } catch (error) {
      next(error);
    }
  }
}
