const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.db);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error.message);
}

module.exports = sequelize;
