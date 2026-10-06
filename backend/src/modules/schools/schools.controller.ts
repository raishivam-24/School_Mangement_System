/**
 * @file schools.controller.ts
 * @description Super Admin School Tenant Controller.
 */

import { Request, Response, NextFunction } from 'express';
import { SchoolsService } from './schools.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { getPaginationParams, buildPaginationMeta } from '../../utils/pagination.js';
import { SchoolStatus } from '@prisma/client';

export class SchoolsController {
  /**
   * Create new school tenant
   */
  static async createSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SchoolsService.createSchool(req.body, req.user!.userId);
      return ApiResponse.created(res, result, 'School tenant created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all schools with pagination and search
   */
  static async listSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationParams(req);
      const search = req.query.search as string;
      const status = req.query.status as SchoolStatus;

      const { total, schools } = await SchoolsService.listSchools(pagination, {
        search,
        status,
      });

      const meta = buildPaginationMeta(total, pagination);
      return ApiResponse.success(res, schools, 'Schools fetched successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single school details
   */
  static async getSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const school = await SchoolsService.getSchoolById(req.params.id);
      return ApiResponse.success(res, school);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update school status or configuration
   */
  static async updateSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await SchoolsService.updateSchool(
        req.params.id,
        req.body,
        req.user!.userId
      );
      return ApiResponse.success(res, updated, 'School updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Public endpoint for searching active schools during login
   */
  static async listPublicSchools(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const schools = await SchoolsService.listPublicSchools(search);
      return ApiResponse.success(res, schools, 'Active schools fetched');
    } catch (error) {
      next(error);
    }
  }
}
