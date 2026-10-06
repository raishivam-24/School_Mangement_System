/**
 * @file apiResponse.ts
 * @description Standardized API Response formatter for consistent JSON responses across all endpoints.
 * Response shape:
 * {
 *   success: true,
 *   message?: string,
 *   data?: T,
 *   meta?: { page, pageSize, total, totalPages }
 * }
 */

import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  /**
   * Send a successful 200/201 JSON response
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: PaginationMeta
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  /**
   * Send a 201 Created response
   */
  static created<T>(res: Response, data: T, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * Send a 204 No Content response
   */
  static noContent(res: Response) {
    return res.status(204).send();
  }
}
