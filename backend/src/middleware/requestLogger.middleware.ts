/**
 * @file requestLogger.middleware.ts
 * @description Structured request logger to log method, path, response status, and duration in milliseconds.
 */

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `[HTTP] ${req.method} ${req.originalUrl || req.url} ${color}${status}${reset} - ${duration}ms`
    );
  });

  next();
};
