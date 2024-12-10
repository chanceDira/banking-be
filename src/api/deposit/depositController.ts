import { prisma } from '../../config/db';
import { RequestHandler } from 'express';

export const DepositMoney: RequestHandler = async (req, res) => {
  const { iban, amount } = req.body;

  if (!iban || amount <= 0) {
    res.status(400).json({ error: 'IBAN and a valid deposit amount are required' });
    return;
  }

  try {
    // Find the account by IBAN
    const account = await prisma.account.findUnique({
      where: { iban },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    // Update the account balance
    const updatedAccount = await prisma.account.update({
      where: { iban },
      data: { balance: { increment: amount } },
    });

    // Create a transaction record
    await prisma.transaction.create({
      data: {
        type: 'deposit',
        amount,
        accountId: account.id,
      },
    });

    res.status(200).json({ message: 'Deposit successful', updatedAccount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
