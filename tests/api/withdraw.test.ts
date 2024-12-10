import request from 'supertest';
import { app } from '../../src/server'; // Make sure this path is correct

describe('Withdraw API', () => {
  let accountId: string;

  beforeAll(async () => {
    // Create an account first for withdrawal
    const response = await request(app)
      .post('/api/create_account')
      .send({ iban: '4009' });
    accountId = response.body.account.id;
  });

  it('should withdraw money successfully', async () => {
    // Deposit some money first
    await request(app)
      .post('/api/deposit')
      .send({ iban: '4006', amount: 100 });

    const response = await request(app)
      .post('/api/withdraw')
      .send({ iban: '4001', amount: 50 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Withdrawal successful');
    expect(response.body.updatedAccount.balance).toBe(50);
  });

  it('should return error for insufficient balance', async () => {
    const response = await request(app)
      .post('/api/withdraw')
      .send({ iban: '4006', amount: 200 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Insufficient balance');
  });

  it('should return error for account not found', async () => {
    const response = await request(app)
      .post('/api/withdraw')
      .send({ iban: '4002', amount: 50 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Account not found');
  });
});
