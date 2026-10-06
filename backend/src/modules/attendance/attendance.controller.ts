/**
 * @file attendance.controller.ts
 * @description Controller for managing daily class attendance sheets and student records.
 */

import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from './attendance.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AttendanceController {
  static async getAttendanceSheet(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, classId, sectionId } = req.query as {
        date: string;
        classId: string;
        sectionId: string;
      };

      const sheet = await AttendanceService.getAttendanceSheet(req.schoolId!, {
        date,
        classId,
        sectionId,
      });

      return ApiResponse.success(res, sheet);
    } catch (error) {
      next(error);
    }
  }

  static async submitAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AttendanceService.submitAttendance(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, result, 'Attendance submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
      const history = await AttendanceService.getStudentAttendance(
        req.schoolId!,
        req.params.studentId,
        { startDate, endDate }
      );
      return ApiResponse.success(res, history);
    } catch (error) {
      next(error);
    }
  }
}
