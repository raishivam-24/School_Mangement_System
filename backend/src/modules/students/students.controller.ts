/**
 * @file students.controller.ts
 * @description Controller for Student management operations.
 */

import { Request, Response, NextFunction } from 'express';
import { StudentsService } from './students.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';
import { UserStatus } from '@prisma/client';

export class StudentsController {
  static async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentsService.createStudent(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.created(res, student, 'Student admitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationParams(req);
      const { search, classId, sectionId, academicYearId, status } = req.query as {
        search?: string;
        classId?: string;
        sectionId?: string;
        academicYearId?: string;
        status?: UserStatus;
      };

      const { total, students } = await StudentsService.listStudents(req.schoolId!, pagination, {
        search,
        classId,
        sectionId,
        academicYearId,
        status,
      });

      const meta = buildPaginationMeta(total, pagination);
      return ApiResponse.success(res, students, 'Students fetched successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getStudentById(req: Request, res: Response, next: NextFunction) {
    try {
      const studentDetails = await StudentsService.getStudentById(req.schoolId!, req.params.id);
      return ApiResponse.success(res, studentDetails);
    } catch (error) {
      next(error);
    }
  }

  static async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await StudentsService.updateStudent(
        req.schoolId!,
        req.params.id,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, updated, 'Student updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
