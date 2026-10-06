/**
 * @file express.d.ts
 * @description Global Express Request interface augmentations for authenticated user and tenant context.
 */

import { UserRole } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      schoolId?: string; // Resolved tenant ID for current request
    }
  }
}
