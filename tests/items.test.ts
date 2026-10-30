import request from 'supertest';
import { createApp } from '../src/app';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockItem = {
    id: 'test-id-1',
    title: 'Test Item',
    description: 'Test description',
    status: 'ACTIVE',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockItems = [mockItem];

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      item: {
        findMany: jest.fn().mockResolvedValue(mockItems),
        findUnique: jest.fn().mockImplementation(({ where }) =>
          where.id === 'test-id-1' ? Promise.resolve(mockItem) : Promise.resolve(null)
        ),
        create: jest.fn().mockResolvedValue({ ...mockItem, id: 'new-id' }),
        update: jest.fn().mockResolvedValue({ ...mockItem, title: 'Updated' }),
        count: jest.fn().mockResolvedValue(1),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      $disconnect: jest.fn(),
    })),
    Prisma: {},
    Status: { ACTIVE: 'ACTIVE', ARCHIVED: 'ARCHIVED' },
  };
});

const app = createApp();

describe('Items API', () => {
  it('GET /v1/api/items returns 200 with data and meta', async () => {
    const res = await request(app).get('/v1/api/items');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.page).toBe(1);
  });

  it('POST /v1/api/items with valid body returns 201', async () => {
    const res = await request(app)
      .post('/v1/api/items')
      .send({ title: 'New Item', description: 'A test item' });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /v1/api/items missing title returns 400', async () => {
    const res = await request(app)
      .post('/v1/api/items')
      .send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('GET /v1/api/items/:id returns 200 for existing item', async () => {
    const res = await request(app).get('/v1/api/items/test-id-1');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe('test-id-1');
  });

  it('GET /v1/api/items/:id returns 404 for nonexistent id', async () => {
    const res = await request(app).get('/v1/api/items/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('PUT /v1/api/items/:id updates item', async () => {
    const res = await request(app)
      .put('/v1/api/items/test-id-1')
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('DELETE /v1/api/items/:id archives item', async () => {
    const res = await request(app).delete('/v1/api/items/test-id-1');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('archived');
  });
});

