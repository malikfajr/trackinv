/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('crypto');
const midtransClient = require('midtrans-client');
const { midtrans } = require('../app/config');
const db = require('../app/db');
const { Membership, User } = require('../model');

const { wrapSuccess } = require('../helper/formater');

const payment = async (req, res) => {
  const { time } = req.query;
  const { id: userId } = req.user;

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: midtrans.server_key,
    clientKey: midtrans.client_key,
  });

  const t = await db.transaction();
  try {
    let expiryDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
    if (time === '1y') {
      expiryDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      );
    }

    const membership = await Membership.create(
      {
        userId,
        paymentDate: new Date(),
        expiryDate,
        status: 'pending',
      },
      { transaction: t }
    );

    const parameter = {
      transaction_details: {
        order_id: membership.id,
        gross_amount: time === '1y' ? 500000 : 50000,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: req.user.username,
        email: req.user.email,
      },
    };

    await t.commit();

    const urlPayment = await snap.createTransaction(parameter);

    res.status(200).json(wrapSuccess({ ...urlPayment }));
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const callbackPayment = async (req, res) => {
  const {
    order_id: orderId,
    transaction_status: transactionStatus,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
  } = req.body;

  const t = await db.transaction();

  try {
    const key = `${orderId}${statusCode}${grossAmount}${midtrans.server_key}`;

    const hash = crypto.createHash('sha512').update(key).digest('hex');
    if (hash !== signatureKey) {
      console.log('Invalid signature key', signatureKey, ' != ', hash);
      res.status(400).json({ message: 'Invalid signature key' });
    }

    if (transactionStatus === 'settlement') {
      const membership = await Membership.findOne({
        where: { id: orderId },
        transaction: t,
      });

      membership.status = 'success';
      await membership.save({ transaction: t });

      await User.update(
        {
          status: true,
        },
        { where: { id: membership.userId }, transaction: t }
      );
    } else if (
      transactionStatus === 'cancel'
      || transactionStatus === 'deny'
      || transactionStatus === 'expire'
      || transactionStatus === 'failure'
    ) {
      await Membership.update(
        { status: 'failed' },
        { where: { id: orderId }, transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ message: 'Internal server error' });
  }
};

const success = async (req, res) => {
  const { order_id: orderId } = req.query;
  const membership = await Membership.findOne({ where: { id: orderId } });

  if (!membership) {
    return res.status(404).json({ message: 'Membership not found' });
  }

  return res.status(200).json(wrapSuccess(membership));
};

const failed = async (req, res) => {
  res.status(422).json({ message: 'Payment failed' });
};

module.exports = {
  payment, callbackPayment, success, failed
};
