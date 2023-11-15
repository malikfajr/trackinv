const User = require('./user');
const Category = require('./category');

User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

// (async () => {
//   await User.sync({ alter: true });
//   await Category.sync({ alter: true });
// })();

module.exports = { User, Category };
