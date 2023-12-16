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
  items: Joi.array()
    .items(itemSchema)
    .required()
    .external(async (value, helper) => {
      const user = helper.prefs.context;
      let exist = true;
      const mapId = value.map((e) => e.id);

      let products = await Product.findAll({
        attributes: ['id'],
        userId: user.id
      });
      products = products.map((product) => product.id);

      mapId.forEach((id) => {
        if (!products.includes(id)) {
          exist = false;
        }
      });

      if (!exist) {
        return helper.message('Product not found!');
      }

      return value;
    }, 'exists')
});

module.exports = { transactionSchema };
