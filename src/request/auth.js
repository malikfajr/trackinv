const Joi = require('joi');
const { User } = require('../model');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const registerSchema = Joi.object({
  namaToko: Joi.string().required().min(3).max(30),
  username: Joi.string()
    .required()
    .min(3)
    .max(30)
    .external(async (value, helper) => {
      const user = await User.count({ where: { username: value } });

      if (user) {
        console.log('Username already exists');
        return helper.message('Username already exist', { username: value });
      }

      console.log('Username is valid');
      return value;
    }, 'exist username'),
  email: Joi.string()
    .required()
    .email()
    .external(async (value, helper) => {
      const user = await User.count({ where: { email: value } });
      if (user) {
        return helper.message('Email already exist', { email: value });
      }
      return value;
    }, 'exist email'),
  password: Joi.string().required().min(8).max(30),
  alamat: Joi.string().required(),
});

module.exports = {
  loginSchema,
  registerSchema,
};
