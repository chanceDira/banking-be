import { prisma } from '../../config/db';
import { RequestHandler } from 'express';

export const AccountStatement: RequestHandler = async (req, res) => {
  const { iban } = req.query;

  if (!iban) {
    res.status(400).json({ error: 'IBAN is required' });
    return;
  }

  try {
    const account = await prisma.account.findUnique({
      where: { iban: String(iban) },
      include: { transactions: true },
    });

    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    res.status(200).json({
      message: 'Account statement retrieved successfully',
      transactions: account.transactions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
