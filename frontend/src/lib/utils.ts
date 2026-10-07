/**
 * @file utils.ts
 * @description Production utility functions for the design system.
 * cn() merges conditional class names with Tailwind conflict resolution.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx (conditional class joining) with tailwind-merge (conflict resolution).
 * Usage: cn('px-4 py-2', isActive && 'bg-primary text-white', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
