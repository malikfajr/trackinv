const router = require('express').Router();
const valid = require('../middleware/validationMiddleware');

const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  destroyCustomer,
} = require('../controller/customer');
const { partnetSchema } = require('../request/partner');

router.use(authMiddleware);
router.get('/', getAllCustomers);
router.get('/:id', getCustomer);
router.post('/', valid(partnetSchema), createCustomer);
router.put('/:id', valid(partnetSchema), updateCustomer);
router.delete('/:id', destroyCustomer);

module.exports = router;
