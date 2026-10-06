/**
 * @file assignments.controller.ts
 * @description Controller for Assignments, Submissions, and Grading.
 */

import { Request, Response, NextFunction } from 'express';
import { AssignmentsService } from './assignments.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class AssignmentsController {
  static async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await AssignmentsService.createAssignment(
        req.schoolId!,
        req.user!.userId,
        req.body
      );
      return ApiResponse.created(res, assignment, 'Assignment created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId, sectionId, subjectId } = req.query as {
        classId?: string;
        sectionId?: string;
        subjectId?: string;
      };
      const assignments = await AssignmentsService.listAssignments(req.schoolId!, {
        classId,
        sectionId,
        subjectId,
      });
      return ApiResponse.success(res, assignments);
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await AssignmentsService.getAssignmentById(
        req.schoolId!,
        req.params.id
      );
      return ApiResponse.success(res, assignment);
    } catch (error) {
      next(error);
    }
  }

  static async submitAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const submission = await AssignmentsService.submitAssignment(
        req.schoolId!,
        req.user!.userId,
        req.params.assignmentId,
        req.body
      );
      return ApiResponse.success(res, submission, 'Assignment submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async gradeSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const graded = await AssignmentsService.gradeSubmission(
        req.schoolId!,
        req.params.submissionId,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, graded, 'Submission graded successfully');
    } catch (error) {
      next(error);
    }
  }
}
