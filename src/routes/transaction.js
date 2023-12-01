const router = require('express').Router();
const {
  getAllTransaction,
  getTransactionById,
  createIncomingTransaction,
  createOutgoingTransaction,
} = require('../controller/transaction');
const authMiddleware = require('../middleware/authMiddleware');
const valid = require('../middleware/validationMiddleware');
const { transactionSchema } = require('../request/transaction');

router.use(authMiddleware);
router.get('/', getAllTransaction);
router.get('/:id', getTransactionById);

router.post('/incoming', valid(transactionSchema), createIncomingTransaction);
router.post('/outgoing', valid(transactionSchema), createOutgoingTransaction);

module.exports = router;
