const { Category, User } = require('../model');

const getAllCategories = async (req, res) => {
  try {
    const { id } = req.user;

    const categories = await Category.findAll({
      where: {
        userId: id,
      },
    });

    res.status(200).json(categories).end();
  } catch (err) {
    console.log(err);
    res.status(500).json(err).end();
  }
};

const createCategory = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: Category,
    });

    if (user.status === false && user.categories.length >= 3) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: 'You have reached the maximum number of categories',
        })
        .end();
    }

    const { id } = req.user;
    const { name } = req.body;

    const category = await Category.create({
      name,
      userId: id,
    });

    return res.status(201).json(category).end();
  } catch (err) {
    return res.status(500).json(err).end();
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: {
        id,
      },
    });

    res.status(200).json(category).end();
  } catch (err) {
    res.status(500).json(err).end();
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json(category).end();
  } catch (err) {
    res.status(500).json(err).end();
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.destroy({
      where: {
        id,
      },
    });

    res.status(200).json(category).end();
  } catch (err) {
    res.status(500).json(err).end();
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
