import { prisma } from '../../config/db';
import { RequestHandler } from 'express';

export const TransferMoney: RequestHandler = async (req, res) => {
  const { fromIban, toIban, amount } = req.body;

  if (!fromIban || !toIban || amount <= 0) {
    res.status(400).json({ error: 'Sender IBAN, recipient IBAN, and a valid amount are required' });
    return;
  }

  try {
    const sender = await prisma.account.findUnique({ where: { iban: fromIban } });
    const recipient = await prisma.account.findUnique({ where: { iban: toIban } });

    if (!sender || !recipient) {
      res.status(404).json({ error: 'Sender or recipient account not found' });
      return;
    }

    if (sender.balance < amount) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    // Update sender's balance
    await prisma.account.update({
      where: { iban: fromIban },
      data: { balance: { decrement: amount } },
    });

    // Update recipient's balance
    await prisma.account.update({
      where: { iban: toIban },
      data: { balance: { increment: amount } },
    });

    // Create transactions for sender and recipient
    await prisma.transaction.create({
      data: {
        type: 'transfer-out',
        amount,
        accountId: sender.id,
      },
    });

    await prisma.transaction.create({
      data: {
        type: 'transfer-in',
        amount,
        accountId: recipient.id,
      },
    });

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
