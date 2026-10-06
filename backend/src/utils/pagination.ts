/**
 * @file pagination.ts
 * @description Standard query pagination helper to parse page/pageSize and build response metadata.
 */

import { Request } from 'express';
import { PaginationMeta } from './apiResponse.js';

export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export const getPaginationParams = (req: Request, defaultPageSize = 20): PaginationParams => {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const rawPageSize = parseInt(req.query.pageSize as string, 10) || defaultPageSize;
  const pageSize = Math.min(100, Math.max(1, rawPageSize)); // Cap between 1 and 100

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
};

export const buildPaginationMeta = (
  total: number,
  params: PaginationParams
): PaginationMeta => {
  return {
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages: Math.ceil(total / params.pageSize) || 1,
  };
};
