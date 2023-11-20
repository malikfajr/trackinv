const { DataTypes } = require('sequelize');
const db = require('../app/db');

const Product = db.define('product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  gudangId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hargaBeli: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hargaJual: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Product;
