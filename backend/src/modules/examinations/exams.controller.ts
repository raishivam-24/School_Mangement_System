/**
 * @file exams.controller.ts
 * @description Controller for Examinations, schedules, marks entry, and report cards.
 */

import { Request, Response, NextFunction } from 'express';
import { ExamsService } from './exams.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ExamsController {
  static async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await ExamsService.createExam(req.schoolId!, req.body);
      return ApiResponse.created(res, exam, 'Exam created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listExams(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await ExamsService.listExams(
        req.schoolId!,
        req.query.academicYearId as string
      );
      return ApiResponse.success(res, exams);
    } catch (error) {
      next(error);
    }
  }

  static async getExamDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await ExamsService.getExamDetails(req.schoolId!, req.params.id);
      return ApiResponse.success(res, exam);
    } catch (error) {
      next(error);
    }
  }

  static async addExamSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ExamsService.addExamSubject(
        req.schoolId!,
        req.params.examId,
        req.body
      );
      return ApiResponse.created(res, schedule, 'Exam subject schedule added successfully');
    } catch (error) {
      next(error);
    }
  }

  static async submitMarks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ExamsService.submitMarks(
        req.schoolId!,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, result, 'Exam marks recorded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getStudentReportCard(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ExamsService.getStudentReportCard(
        req.schoolId!,
        req.params.examId,
        req.params.studentId
      );
      return ApiResponse.success(res, report);
    } catch (error) {
      next(error);
    }
  }
}
