/**
 * @file auth.service.spec.ts
 * @description Unit and contract tests for Authentication utilities, JWT tokens, and Zod schemas.
 */

import { describe, it, expect } from 'vitest';
import { signAccessToken, verifyAccessToken, TokenPayload } from '../../utils/jwt.js';
import { loginSchema } from './auth.schema.js';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

describe('Authentication Module & Security Utilities', () => {
  describe('JWT Token Engine', () => {
    const mockPayload: TokenPayload = {
      userId: 'user-uuid-1234',
      email: 'teacher@school.org',
      role: UserRole.TEACHER,
      schoolId: 'school-uuid-5678',
    };

    it('should generate a valid JWT access token and verify its payload', () => {
      const token = signAccessToken(mockPayload);
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // Standard header.payload.signature

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
      expect(decoded.schoolId).toBe(mockPayload.schoolId);
    });

    it('should throw an error when verifying a tampered or invalid token', () => {
      expect(() => verifyAccessToken('invalid.garbage.token')).toThrow();
    });
  });

  describe('Password Hashing Integrity', () => {
    it('should securely hash passwords and verify bcrypt match correctly', async () => {
      const rawPassword = 'SecurePassword@2026';
      const hash = await bcrypt.hash(rawPassword, 10);

      expect(hash).not.toBe(rawPassword);
      expect(await bcrypt.compare(rawPassword, hash)).toBe(true);
      expect(await bcrypt.compare('WrongPassword@123', hash)).toBe(false);
    });
  });

  describe('Login Input Validation Schema (loginSchema)', () => {
    it('should accept valid email and password format', () => {
      const validPayload = {
        body: {
          email: 'admin@schoolhub.edu',
          password: 'Password123!',
        },
      };

      const result = loginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject malformed email addresses', () => {
      const invalidPayload = {
        body: {
          email: 'not-an-email',
          password: 'Password123!',
        },
      };

      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('email');
      }
    });

    it('should reject passwords shorter than 6 characters', () => {
      const invalidPayload = {
        body: {
          email: 'admin@schoolhub.edu',
          password: '123',
        },
      };

      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 6');
      }
    });
  });
});
