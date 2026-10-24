/**
 * @file api.spec.ts
 * @description Integration tests for core Express application endpoints using Supertest.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Central Express API Gateway', () => {
  it('GET /health - should return 200 OK and server health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('GET / - should return root API metadata and running status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('School Management SaaS API');
    expect(res.body.status).toBe('running');
    expect(res.body.apiPrefix).toBe('/api/v1');
  });

  it('GET /api/v1/notifications - should return 401 when accessed without authentication', async () => {
    const res = await request(app).get('/api/v1/notifications');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/unknown-route-test - should return 404 for undefined endpoints', async () => {
    const res = await request(app).get('/api/v1/unknown-route-test');
    expect(res.status).toBe(404);
  });
});
