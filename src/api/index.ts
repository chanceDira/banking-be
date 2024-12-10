import express from 'express';
import { DepositMoney } from './deposit/depositController';
import { CreateAccount } from './account/accountController';
import { WithdrawMoney } from './withdraw/withdrawController';
import { TransferMoney } from './transfer/transferController';
import { AccountStatement } from './statement/statementController';

const router = express.Router();

router.post('/deposit', DepositMoney);
router.post('/create_account', CreateAccount);
router.post('/withdraw', WithdrawMoney);
router.post('/transfer', TransferMoney);
router.get('/statement', AccountStatement);

export default router;
