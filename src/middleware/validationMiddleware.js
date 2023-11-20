const { wrapError } = require('../helper/formater');

module.exports = (schema) => async (req, res, next) => {
  try {
    const { body, user } = req;

    let context = {};

    if (user) context = user;
    await schema.validateAsync(body, {
      abortEarly: false,
      context,
    });
    return next();
  } catch (error) {
    const message = 'One or more fields are missing or invalid';
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message,
    }));

    return res.status(400).json(wrapError(message, errors)).end();
  }
};
