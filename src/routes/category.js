const router = require('express').Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controller/category');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllCategories);
router.post('/', authMiddleware, createCategory);
router.get('/:id', authMiddleware, getCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
