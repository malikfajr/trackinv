const {
  Transaction, ItemTransaction, Product, Partner
} = require('../model');
const { wrapSuccess, wrapError } = require('../helper/formater');
const db = require('../app/db');

const getAllTransaction = async (req, res) => {
  const { type } = req.query;
  const condition = {};
  try {
    if (type !== undefined) condition.type = type;

    const transaction = await Transaction.findAll({
      where: condition,
      include: [{ model: Partner, as: 'partner' }],
    });

    return res
      .json(wrapSuccess(transaction, 'Success to get transactions'))
      .end();
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get data')).end();
  }
};

const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        { model: Partner, as: 'partner' },
        { model: ItemTransaction, as: 'items' },
      ],
    });

    if (!transaction) {
      return res.status(404).json(wrapError('Transaction not found')).end();
    }

    return res
      .json(wrapSuccess(transaction, 'Success to get transaction'))
      .end();
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get data')).end();
  }
};

const createIncomingTransaction = async (req, res) => {
  const { items, partnerId } = req.body;
  const { id: userId } = req.user;

  const t = await db.transaction();
  try {
    const transaction = await Transaction.create(
      {
        type: 'masuk',
        userId,
        partnerId,
        tanggal: new Date(),
      },
      { transaction: t }
    );

    const transactionId = transaction.id;

    const promises = items.map(async (item) => {
      const { id, qty } = item;
      const product = await Product.findByPk(id, { transaction: t });
      ItemTransaction.create(
        {
          barangId: id,
          transactionId,
          harga: product.hargaBeli,
          qty,
          totalHarga: product.hargaBeli * qty,
        },
        { transaction: t }
      );

      transaction.totalHarga += product.hargaBeli * qty;

      return product.update({ stock: product.stock + qty }, { transaction: t });
    });

    await transaction.save({ transaction: t });
    await Promise.all(promises);
    await t.commit();

    return res
      .json(wrapSuccess(transaction, 'Success to insert transaction'))
      .end();
  } catch (error) {
    await t.rollback();
    return res.status(500).json(wrapError('Failed to insert data')).end();
  }
};

const createOutgoingTransaction = async (req, res) => {
  const { items, partnerId } = req.body;
  const { id: userId } = req.user;

  const t = await db.transaction();

  try {
    const transaction = await Transaction.create(
      {
        type: 'keluar',
        userId,
        partnerId,
        tanggal: new Date(),
      },
      { transaction: t }
    );

    const transactionId = transaction.id;

    const promises = items.map(async (item) => {
      const { id, qty } = item;
      const product = await Product.findByPk(id, { transaction: t });

      ItemTransaction.create(
        {
          barangId: id,
          transactionId,
          harga: product.hargaJual,
          qty,
          totalHarga: product.hargaJual * qty,
        },
        { transaction: t }
      );

      transaction.totalHarga += product.hargaJual * qty;

      return product.update({ stock: product.stock - qty }, { transaction: t });
    });

    await transaction.save({ transaction: t });
    await Promise.all(promises);
    await t.commit();

    return res
      .json(wrapSuccess(transaction, 'Success to insert transaction'))
      .end();
  } catch (error) {
    await t.rollback();
    return res.status(500).json(wrapError('Failed to insert data')).end();
  }
};

module.exports = {
  getAllTransaction,
  getTransactionById,
  createIncomingTransaction,
  createOutgoingTransaction,
};
