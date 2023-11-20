const User = require('./user');
const Category = require('./category');
const Membership = require('./membership');
const Product = require('./product');
const Gudang = require('./gudang');
const Transaction = require('./transaction');
const ItemTransaction = require('./itemTransaction');
const Partner = require('./partner');
const db = require('../app/db');

User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Membership, { foreignKey: 'userId' });
Membership.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Gudang, { foreignKey: 'userId' });
Gudang.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ItemTransaction, { foreignKey: 'userId' });
ItemTransaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Partner, { foreignKey: 'userId' });
Partner.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' });

Gudang.hasMany(Product, { foreignKey: 'gudangId' });
Product.belongsTo(Gudang, { foreignKey: 'gudangId' });

Transaction.hasMany(ItemTransaction, { foreignKey: 'transactionId' });
ItemTransaction.belongsTo(Transaction, { foreignKey: 'transactionId' });

Partner.hasMany(Transaction, { foreignKey: 'partnerId' });
Transaction.belongsTo(Partner, { foreignKey: 'partnerId' });

Partner.hasMany(ItemTransaction, { foreignKey: 'partnerId' });
ItemTransaction.belongsTo(Partner, { foreignKey: 'partnerId' });

// Uncomment this code to create table
(async () => {
  db.sync({ alter: true, force: false });
})();

module.exports = {
  User,
  Category,
  Membership,
  Product,
  Gudang,
  Transaction,
  ItemTransaction,
  Partner,
};
