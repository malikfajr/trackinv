const db = require('../app/db');
const { wrapSuccess, wrapError } = require('../helper/formater');
const { Category } = require('../model');
const Product = require('../model/product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
      attributes: ['id', 'name', 'stock', 'hargaBeli', 'hargaJual'],
    });

    return res.json(wrapSuccess(products));
  } catch (error) {
    console.log(error);
    return res.json(wrapError("Failed to load product's data"));
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: {
        id,
      },
      include: [{ model: Category, as: 'category' }],
      attributes: ['id', 'name', 'stock', 'hargaBeli', 'hargaJual'],
    });

    res.status(200).json(product).end();
  } catch (err) {
    res.status(500).json(err).end();
  }
};

const createProduct = async (req, res) => {
  const {
    name, stock, hargaBeli, hargaJual, categoryId
  } = req.body;
  const { id, gudangId } = req.user;

  const t = await db.transaction();

  try {
    const product = await Product.create(
      {
        name,
        stock,
        hargaBeli,
        hargaJual,
        userId: id,
        gudangId,
        categoryId,
      },
      { transaction: t }
    );

    t.commit();
    return res.json(wrapSuccess(product, 'Product created successfully'));
  } catch (error) {
    console.log(error);
    t.rollback();
    return res.json(wrapError("Failed to create product's data")).status(500);
  }
};

const updateProduct = async (req, res) => {
  const {
    name, stock, hargaBeli, hargaJual, categoryId
  } = req.body;
  const { id } = req.params;

  const t = await db.transaction();

  try {
    const product = await Product.update(
      {
        name,
        stock,
        hargaBeli,
        hargaJual,
        categoryId,
      },
      {
        where: { id },
      }
    );

    await t.commit();
    return res.json(wrapSuccess(product, 'Product created successfully'));
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.json(wrapError("Failed to create product's data")).status(500);
  }
};

const destroyProduct = async (req, res) => {
  const { id } = req.params;

  try {
    Product.destroy({
      where: { id },
    });

    return res.json(wrapSuccess(null, 'Product deleted successfully'));
  } catch (error) {
    return res.status(500).json(wrapError('Delete product failed'));
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  destroyProduct,
};
