const { DataTypes } = require('sequelize');
const db = require('../app/db');

const Partner = db.define('partner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('supplier', 'customer'),
    allowNull: false,
  },
});

module.exports = Partner;
