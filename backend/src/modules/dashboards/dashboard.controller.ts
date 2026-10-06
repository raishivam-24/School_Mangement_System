/**
 * @file dashboard.controller.ts
 * @description Controller for Super Admin and School Admin Dashboard aggregations.
 */

import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export class DashboardController {
  /**
   * Super Admin Platform Dashboard
   */
  static async getSuperAdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getSuperAdminDashboard();
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * School Admin Tenant Dashboard
   */
  static async getSchoolAdminDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getSchoolAdminDashboard(req.schoolId!);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}
