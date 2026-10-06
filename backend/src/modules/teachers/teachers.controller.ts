/**
 * @file teachers.controller.ts
 * @description Controller for Teacher management operations.
 */

import { Request, Response, NextFunction } from 'express';
import { TeachersService } from './teachers.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';

export class TeachersController {
  static async createTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await TeachersService.createTeacher(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.created(res, teacher, 'Teacher created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationParams(req);
      const search = req.query.search as string;

      const { total, teachers } = await TeachersService.listTeachers(
        req.schoolId!,
        pagination,
        { search }
      );

      const meta = buildPaginationMeta(total, pagination);
      return ApiResponse.success(res, teachers, 'Teachers fetched successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getTeacherById(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await TeachersService.getTeacherById(req.schoolId!, req.params.id);
      return ApiResponse.success(res, teacher);
    } catch (error) {
      next(error);
    }
  }

  static async updateTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await TeachersService.updateTeacher(
        req.schoolId!,
        req.params.id,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, updated, 'Teacher updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
