const router = require('express').Router();
const {
  payment, callbackPayment, success, failed
} = require('../controller/payment');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/payment', authMiddleware, payment);
router.post('/callback', callbackPayment);
router.get('/success', success);
router.get('/failed', failed);

module.exports = router;
