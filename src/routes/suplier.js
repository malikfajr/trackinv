const router = require('express').Router();
const valid = require('../middleware/validationMiddleware');

const authMiddleware = require('../middleware/authMiddleware');

const { partnetSchema } = require('../request/partner');
const {
  getAllSuplier,
  getSuplier,
  createSuplier,
  updateSuplier,
  destroySuplier,
} = require('../controller/suplier');

router.use(authMiddleware);
router.get('/', getAllSuplier);
router.get('/:id', getSuplier);
router.post('/', valid(partnetSchema), createSuplier);
router.put('/:id', valid(partnetSchema), updateSuplier);
router.delete('/:id', destroySuplier);

module.exports = router;
