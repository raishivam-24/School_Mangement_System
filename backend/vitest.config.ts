import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'tests/**/*.spec.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/school_test_db?schema=public',
      JWT_ACCESS_SECRET: 'test_super_secret_jwt_access_key_min_16_chars_secure',
      JWT_REFRESH_SECRET: 'test_super_secret_jwt_refresh_key_min_16_chars_secure',
    },
  },
});
