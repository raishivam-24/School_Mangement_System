/**
 * @file env.ts
 * @description Centralized environment configuration and validation using Zod.
 * Ensures the application fails fast on startup if any critical environment variable is missing or invalid.
 */

import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),

  // Database
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL is required for PostgreSQL connection',
  }),

  // JWT Auth Configuration
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().default('localhost'),

  // Storage Provider Configuration
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  UPLOAD_DIR: z.string().default('uploads'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),

  // Platform Super Admin Defaults for initial seed
  SUPER_ADMIN_EMAIL: z.string().email().default('superadmin@platform.com'),
  SUPER_ADMIN_PASSWORD: z.string().min(8).default('SuperAdmin@Secure123!'),
  SUPER_ADMIN_NAME: z.string().default('Platform Super Admin'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables in .env:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
