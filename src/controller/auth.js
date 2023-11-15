/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const config = require('../app/config');

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

    return res.json({
      status: 'success',
      data: {
        id: user.id,
        namaToko: user.namaToko,
        username: user.username,
        email: user.email,
        alamat: user.alamat,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
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

    console.log('1', user);
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'email atau password salah',
      });
    }
    console.log('2', user);

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'email atau password salah',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        namaToko: user.namaToko,
        username: user.username,
        email: user.email,
        alamat: user.alamat,
      },
      config.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.json({
      status: 'success',
      data: {
        id: user.id,
        namaToko: user.namaToko,
        username: user.username,
        email: user.email,
        alamat: user.alamat,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = { registerController, loginController };
