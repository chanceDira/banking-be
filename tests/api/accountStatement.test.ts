import request from 'supertest';
import { app } from '../../src/server'; // Make sure this path is correct

describe('Account Statement API', () => {
  let accountId: string;

  beforeAll(async () => {
    // Create an account and make some transactions
    const response = await request(app)
      .post('/api/create_account')
      .send({ iban: '7002' });
    accountId = response.body.account.id;

    await request(app)
      .post('/api/deposit')
      .send({ iban: '7002', amount: 100 });

    await request(app)
      .post('/api/withdraw')
      .send({ iban: '7002', amount: 50 });
  });

  it('should return account statement successfully', async () => {
    const response = await request(app)
      .get('/api/statement')
      .query({ iban: '7002' });

    expect(response.status).toBe(200);
    expect(response.body.transactions.length).toBeGreaterThan(0);
    expect(response.body.transactions[0]).toHaveProperty('amount');
    expect(response.body.transactions[0]).toHaveProperty('createdAt');
  });

  it('should return error if account not found', async () => {
    const response = await request(app)
      .get('/api/statement')
      .query({ iban: 'NONEXISTENTIBAN' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Account not found');
  });
});
