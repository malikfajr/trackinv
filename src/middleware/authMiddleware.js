/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const config = require('../app/config');

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res
      .status(401)
      .json({
        status: 'error',
        message: 'unauthorized',
      })
      .end();
  }

  const decode = jwt.verify(token, config.JWT_SECRET);
  if (!decode) {
    return res
      .status(401)
      .json({
        status: 'error',
        message: 'unauthorized',
      })
      .end();
  }

  req.user = decode;
  return next();
};

module.exports = authMiddleware;
