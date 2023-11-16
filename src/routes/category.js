const router = require('express').Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controller/category');
const authMiddleware = require('../middleware/authMiddleware');
const valid = require('../middleware/validationMiddleware');
const { categorySchema } = require('../request/category');

router.use(authMiddleware);
router.get('/', getAllCategories);
router.post('/', valid(categorySchema), createCategory);
router.get('/:id', getCategory);
router.put('/:id', valid(categorySchema), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
