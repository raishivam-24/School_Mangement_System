/**
 * @file timetable.controller.ts
 * @description Controller for Timetable schedules.
 */

import { Request, Response, NextFunction } from 'express';
import { TimetableService } from './timetable.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class TimetableController {
  static async createEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await TimetableService.createEntry(req.schoolId!, req.body);
      return ApiResponse.created(res, entry, 'Timetable entry created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getTimetable(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId, sectionId, teacherId, academicYearId } = req.query as {
        classId?: string;
        sectionId?: string;
        teacherId?: string;
        academicYearId?: string;
      };

      const schedule = await TimetableService.getTimetable(req.schoolId!, {
        classId,
        sectionId,
        teacherId,
        academicYearId,
      });

      return ApiResponse.success(res, schedule);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TimetableService.deleteEntry(req.schoolId!, req.params.id);
      return ApiResponse.success(res, result, 'Timetable entry deleted');
    } catch (error) {
      next(error);
    }
  }
}
