const Joi = require('joi');
const { Product, Partner } = require('../model');

const itemSchema = Joi.object({
  id: Joi.string()
    .required()
    .external(async (value) => {
      try {
        await Product.findByPk(value);
      } catch (error) {
        throw new Error('Product not found');
      }
    }),
  qty: Joi.number().required().min(1),
});

const transactionSchema = Joi.object({
  partnerId: Joi.string()
    .required()
    .external(async (value) => {
      try {
        await Partner.findByPk(value);
      } catch (error) {
        throw new Error('Partner not found');
      }
    }),
  items: Joi.array().items(itemSchema).required(),
});

module.exports = { transactionSchema };
