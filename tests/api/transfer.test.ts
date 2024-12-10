import request from 'supertest';
import { app } from '../../src/server'; // Make sure this path is correct

describe('Transfer API', () => {
  let senderIban: string;
  let recipientIban: string;

  beforeAll(async () => {
    // Create sender and recipient accounts
    const senderResponse = await request(app)
      .post('/api/create_account')
      .send({ iban: '6001' });
    senderIban = senderResponse.body.account.iban;

    const recipientResponse = await request(app)
      .post('/api/create_account')
      .send({ iban: '6002' });
    recipientIban = recipientResponse.body.account.iban;

    // Deposit some money into the sender's account
    await request(app)
      .post('/api/deposit')
      .send({ iban: senderIban, amount: 200 });
  });

  it('should transfer money successfully', async () => {
    const response = await request(app)
      .post('/api/transfer')
      .send({ fromIban: senderIban, toIban: recipientIban, amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Transfer successful');
  });

  it('should return error for insufficient balance in sender account', async () => {
    const response = await request(app)
      .post('/api/transfer')
      .send({ fromIban: senderIban, toIban: recipientIban, amount: 500 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Insufficient balance');
  });

  it('should return error for account not found', async () => {
    const response = await request(app)
      .post('/api/transfer')
      .send({ fromIban: 'NONEXISTENTIBAN', toIban: recipientIban, amount: 100 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Sender or recipient account not found');
  });
});
