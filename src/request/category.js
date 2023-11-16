const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
});

module.exports = { categorySchema };
