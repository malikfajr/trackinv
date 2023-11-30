const Joi = require('joi');
const { Category } = require('../model');

const productSchema = Joi.object({
  categoryId: Joi.required().external(async (value, helper) => {
    const user = helper.prefs.context;
    const exist = await Category.count({
      where: { id: value, userId: user.id },
    });

    if (!exist) {
      return helper.error('Category not found');
    }

    return value;
  }),
  name: Joi.string().required().min(3).max(30),
  stock: Joi.number().required().min(0).default(0),
  hargaBeli: Joi.number().required().min(1),
  hargaJual: Joi.number().required().min(1),
});

module.exports = { productSchema };
