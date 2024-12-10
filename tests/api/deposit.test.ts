import request from 'supertest';
import { app } from '../../src/server';

describe('Deposit API', () => {
  it('should deposit money successfully', async () => {
    const response = await request(app)
      .post('/api/deposit')
      .send({ iban: '4002', amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Deposit successful');
  });
});
