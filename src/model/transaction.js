const { DataTypes } = require('sequelize');
const db = require('../app/db');

const Transaction = db.define('transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  partnerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  totalHarga: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  type: {
    type: DataTypes.ENUM('masuk', 'keluar'),
    defaultValue: 'keluar',
    allowNull: false,
  },
});

module.exports = Transaction;
