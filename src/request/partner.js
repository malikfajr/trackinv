const Joi = require('joi');

const partnetSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { partnetSchema };
