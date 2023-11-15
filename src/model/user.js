const { DataTypes } = require('sequelize');
const db = require('../app/db');

const User = db.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nama_toko: {
    type: DataTypes.STRING,
    length: 50,
    allowNull: false,
  },
  namaToko: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('nama_toko');
    },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = User;
