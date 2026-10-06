/**
 * @file academics.controller.ts
 * @description Controller for academic configuration (years, classes, sections, subjects, assignments).
 */

import { Request, Response, NextFunction } from 'express';
import { AcademicsService } from './academics.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AcademicsController {
  // Academic Years
  static async listAcademicYears(req: Request, res: Response, next: NextFunction) {
    try {
      const years = await AcademicsService.listAcademicYears(req.schoolId!);
      return ApiResponse.success(res, years);
    } catch (error) {
      next(error);
    }
  }

  static async createAcademicYear(req: Request, res: Response, next: NextFunction) {
    try {
      const year = await AcademicsService.createAcademicYear(req.schoolId!, req.body);
      return ApiResponse.created(res, year, 'Academic year created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async setCurrentAcademicYear(req: Request, res: Response, next: NextFunction) {
    try {
      const year = await AcademicsService.setCurrentAcademicYear(req.schoolId!, req.params.id);
      return ApiResponse.success(res, year, 'Current academic year updated');
    } catch (error) {
      next(error);
    }
  }

  // Classes & Sections
  static async listClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await AcademicsService.listClasses(req.schoolId!);
      return ApiResponse.success(res, classes);
    } catch (error) {
      next(error);
    }
  }

  static async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const cls = await AcademicsService.getClassById(req.schoolId!, req.params.id);
      return ApiResponse.success(res, cls);
    } catch (error) {
      next(error);
    }
  }

  static async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const cls = await AcademicsService.createClass(req.schoolId!, req.body);
      return ApiResponse.created(res, cls, 'Class created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createSection(req: Request, res: Response, next: NextFunction) {
    try {
      const section = await AcademicsService.createSection(req.schoolId!, req.body);
      return ApiResponse.created(res, section, 'Section created successfully');
    } catch (error) {
      next(error);
    }
  }

  // Subjects & Assignments
  static async listSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const subjects = await AcademicsService.listSubjects(req.schoolId!);
      return ApiResponse.success(res, subjects);
    } catch (error) {
      next(error);
    }
  }

  static async createSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const subject = await AcademicsService.createSubject(req.schoolId!, req.body);
      return ApiResponse.created(res, subject, 'Subject created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async assignClassSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await AcademicsService.assignClassSubject(req.schoolId!, req.body);
      return ApiResponse.success(res, assignment, 'Subject assigned to class successfully');
    } catch (error) {
      next(error);
    }
  }
}
