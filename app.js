/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { port } = require('./src/app/config').app;
const swaggerDocument = require('./contract.json');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => res.redirect('/doc'));

app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/categories', require('./src/routes/category'));
app.use('/api/v1/products', require('./src/routes/product'));
app.use('/api/v1/supliers', require('./src/routes/suplier'));
app.use('/api/v1/customers', require('./src/routes/customer'));
app.use('/api/v1/transactions', require('./src/routes/transaction'));
app.use('/api/v1/membership', require('./src/routes/membership'));

app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint tidak ditemukan',
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${PORT}`);
});
