"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositMoney = void 0;
const db_1 = require("../../config/db");
const DepositMoney = async (req, res) => {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid input' });
        return; // Explicitly end the function
    }
    try {
        const account = await db_1.prisma.account.findUnique({ where: { id: accountId } });
        if (!account) {
            res.status(404).json({ error: 'Account not found' });
            return; // Explicitly end the function
        }
        const updatedAccount = await db_1.prisma.account.update({
            where: { id: accountId },
            data: { balance: { increment: amount } },
        });
        await db_1.prisma.transaction.create({
            data: {
                type: 'deposit',
                amount,
                accountId,
            },
        });
        res.status(200).json({ message: 'Deposit successful', updatedAccount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.DepositMoney = DepositMoney;
