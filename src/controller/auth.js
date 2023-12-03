/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Partner } = require('../model');
const config = require('../app/config');
const { wrapSuccess, wrapError } = require('../helper/formater');
const db = require('../app/db');
const Gudang = require('../model/gudang');

const registerController = async (req, res) => {
  const { namaToko, username, email, password, alamat } = req.body;

  const t = await db.transaction();

  try {
    const newPassword = bcrypt.hashSync(password, 15);
    const user = await User.create(
      {
        nama_toko: namaToko,
        username,
        email,
        password: newPassword,
        alamat,
      },
      { transaction: t }
    );

    await Gudang.create(
      {
        name: 'Gudang Utama',
        alamat,
        userId: user.id,
      },
      { transaction: t }
    );

    await Partner.create(
      {
        userId: user.id,
        name: 'Default',
        type: 'customer',
      },
      { transaction: t }
    );

    await Partner.create(
      {
        userId: user.id,
        name: 'Default',
        type: 'supplier',
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json(wrapSuccess(null, 'User created successfully'));
  } catch (error) {
    console.error(error);
    await t.rollback();
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
      include: { model: Gudang, as: 'gudang' },
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

    const token = jwt.sign(
      { gudangId: user.gudang.id, ...payload },
      config.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    return res.json(wrapSuccess({ token, user: payload }, 'Login success'));
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = { registerController, loginController };
