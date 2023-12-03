const router = require('express').Router();
const { payment, callbackPayment } = require('../controller/payment');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/payment', authMiddleware, payment);
router.post('/callback', callbackPayment);

module.exports = router;
