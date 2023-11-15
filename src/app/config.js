// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const config = {
  db: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'test',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'secret',
  },
  app: {
    port: process.env.PORT || 3000,
  },
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
};

module.exports = config;
