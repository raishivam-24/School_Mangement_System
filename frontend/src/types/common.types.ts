/**
 * @file common.types.ts
 * @description Standard API and pagination types across SchoolHub SaaS.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
