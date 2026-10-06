/**
 * @file reports.controller.ts
 * @description Controller for structured reports (attendance, fees, academics).
 */

import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ReportsController {
  static async getAttendanceReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId, sectionId, startDate, endDate } = req.query as {
        classId: string;
        sectionId?: string;
        startDate: string;
        endDate: string;
      };

      const report = await ReportsService.getAttendanceReport(req.schoolId!, {
        classId,
        sectionId,
        startDate,
        endDate,
      });

      return ApiResponse.success(res, report);
    } catch (error) {
      next(error);
    }
  }

  static async getFeeReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ReportsService.getFeeReport(
        req.schoolId!,
        req.query.academicYearId as string
      );
      return ApiResponse.success(res, report);
    } catch (error) {
      next(error);
    }
  }
}
