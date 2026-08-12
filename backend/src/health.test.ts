import request from 'supertest';
import { app } from './server';

describe('GET /health', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe responder con estado 200 y status ok', async () => {
    const response = await request(app.server).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});