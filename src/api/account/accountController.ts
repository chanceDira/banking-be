import { prisma } from '../../config/db';
import { RequestHandler } from 'express';

export const CreateAccount: RequestHandler = async (req, res) => {
  const { iban } = req.body;

  if (!iban) {
    res.status(400).json({ error: 'IBAN is required' });
    return;
  }

  try {
    const newAccount = await prisma.account.create({
      data: {
        iban,
        balance: 0, // Default balance
      },
    });

    res.status(201).json({
      message: 'Account created successfully',
      account: newAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
