/* eslint-disable import/no-extraneous-dependencies */
const midtransClient = require('midtrans-client');
const { midtrans } = require('../app/config');
const db = require('../app/db');
const { Membership } = require('../model');

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
    };

    await t.commit();

    const urlPayment = await snap.createTransaction(parameter);

    console.log(urlPayment);
    res.status(200).json(wrapSuccess({ ...urlPayment }));
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const callbackPayment = (req, res) => {
  const { order_id: orderId, transaction_status: transactionStatus } = req.body;

  console.log('ini query', req.query);
  console.log('ini body', req.body);

  try {
    console.log('order_id', orderId, 'transaction_status', transactionStatus);

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { payment, callbackPayment };
