const router = require('express').Router();
const { payment, callbackPayment, success } = require('../controller/payment');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/payment', authMiddleware, payment);
router.post('/callback', callbackPayment);
router.get('/success', success);

module.exports = router;
