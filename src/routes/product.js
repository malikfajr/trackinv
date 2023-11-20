const router = require('express').Router();
const valid = require('../middleware/validationMiddleware');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  destroyProduct,
} = require('../controller/product');
const authMiddleware = require('../middleware/authMiddleware');
const { productSchema } = require('../request/product');

router.use(authMiddleware);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', valid(productSchema), createProduct);
router.put('/:id', valid(productSchema), updateProduct);
router.delete('/:id', destroyProduct);

module.exports = router;
