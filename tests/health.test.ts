import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Routes', () => {
  it('GET /v1/api/health returns 200 with status okay', async () => {
    const res = await request(app).get('/v1/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('okay');
    expect(res.body.uptime).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.service).toBe('express-app');
  });

  it('GET /unknown returns 404', async () => {
    const res = await request(app).get('/unknown-path');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

