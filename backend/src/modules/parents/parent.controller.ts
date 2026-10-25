
import { Request, Response, NextFunction } from 'express';
import { ParentService } from './parent.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class ParentController {
  static async getChildren(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const children = await ParentService.getChildren(
        req.schoolId!,
        req.user!.userId
      );

      return ApiResponse.success(
        res,
        children,
        'Children retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }
  
  static async getAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await ParentService.getAttendance(
        req.schoolId!,
        req.user!.userId,
        req.params.studentId
      );

      return ApiResponse.success(
        res,
        data,
        'Attendance retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getFees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await ParentService.getFees(
        req.schoolId!,
        req.user!.userId,
        req.params.studentId
      );

      return ApiResponse.success(
        res,
        data,
        'Fee records retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const studentId = req.query.studentId;

      if (typeof studentId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'studentId is required',
        });
      }

      const data = await ParentService.getDashboard(
        req.schoolId!,
        req.user!.userId,
        studentId
      );

      return ApiResponse.success(
        res,
        data,
        'Parent dashboard retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

}
