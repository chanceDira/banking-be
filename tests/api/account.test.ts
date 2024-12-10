import request from 'supertest';
import { app } from '../../src/server'; // Make sure this path is correct

describe('Account Creation API', () => {
  it('should create a new account', async () => {
    const response = await request(app)
      .post('/api/create_account')
      .send({ iban: 'IBAN123456789' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Account created successfully');
    expect(response.body.account).toHaveProperty('iban', 'IBAN123456789');
    expect(response.body.account).toHaveProperty('balance', 0);
  });

  it('should return error if IBAN is not provided', async () => {
    const response = await request(app)
      .post('/api/account/create')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('IBAN is required');
  });
});
