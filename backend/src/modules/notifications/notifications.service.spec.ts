/**
 * @file notifications.service.spec.ts
 * @description Unit tests for Notification domain logic, schema validation, and broadcast audience rules.
 */

import { describe, it, expect, vi } from 'vitest';
import { createNotificationSchema, notificationQuerySchema } from './notifications.schema.js';

describe('Notifications Domain & Broadcast Validation', () => {
  describe('createNotificationSchema', () => {
    it('should validate complete notification payload with default type', () => {
      const payload = {
        body: {
          title: 'Science Fair Submissions Due',
          message: 'All Class 10 students must submit project synopses by Friday 5 PM.',
          type: 'ACADEMIC' as const,
          targetAudience: 'STUDENTS' as const,
          link: '/my-subjects',
        },
      };

      const result = createNotificationSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject titles shorter than 2 characters', () => {
      const payload = {
        body: {
          title: 'A',
          message: 'Valid message body here.',
        },
      };

      const result = createNotificationSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('should reject messages shorter than 3 characters', () => {
      const payload = {
        body: {
          title: 'Valid Title Here',
          message: 'Hi',
        },
      };

      const result = createNotificationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('notificationQuerySchema', () => {
    it('should accept valid query filter flags', () => {
      const validQuery = {
        query: {
          unreadOnly: 'true' as const,
          type: 'ACADEMIC',
          page: '1',
          limit: '20',
        },
      };

      const result = notificationQuerySchema.safeParse(validQuery);
      expect(result.success).toBe(true);
    });

    it('should reject non-numeric page values', () => {
      const invalidQuery = {
        query: {
          page: 'abc',
        },
      };

      const result = notificationQuerySchema.safeParse(invalidQuery);
      expect(result.success).toBe(false);
    });
  });
});
