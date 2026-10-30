import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Routes', () => {
  it('GET /api/express/health returns 200 with status ok', async () => {
    const res = await request(app).get('/api/express/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
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

