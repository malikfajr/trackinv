/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const config = require('../app/config');
const { wrapSuccess, wrapError } = require('../helper/formater');

const registerController = async (req, res) => {
  const {
    namaToko, username, email, password, alamat
  } = req.body;

  if (!namaToko || !username || !email || !password || !alamat) {
    return res.status(400).json({
      status: 'error',
      message: 'data tidak lengkap',
    });
  }

  try {
    const newPassword = bcrypt.hashSync(password, 15);
    const user = await User.create({
      nama_toko: namaToko,
      username,
      email,
      password: newPassword,
      alamat,
    });

    return res.json(wrapSuccess(user, 'User created successfully'));
  } catch (error) {
    return res.status(500).json(wrapError('User failed to create'));
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'data tidak lengkap',
    });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json(wrapError('email atau password salah'));
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(wrapError('email atau password salah'));
    }

    const payload = {
      id: user.id,
      namaToko: user.namaToko,
      username: user.username,
      email: user.email,
      alamat: user.alamat,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json(wrapSuccess({ token, user: payload }, 'Login success'));
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = { registerController, loginController };
