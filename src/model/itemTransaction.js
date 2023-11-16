const { DataTypes } = require('sequelize');
const db = require('../app/db');

const ItemTransaction = db.define('item_transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  barangId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalHarga: {
    type: DataTypes.VIRTUAL,
    allowNull: false,
    get() {
      return this.qty * this.harga;
    },
  },
});

module.exports = ItemTransaction;
