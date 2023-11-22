const { wrapSuccess, wrapError } = require('../helper/formater');
const { Partner } = require('../model');

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Partner.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        type: 'customer',
        userId: req.user.id,
      },
    });
    return res.status(200).json(wrapSuccess(customers));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get customers'));
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Partner.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      where: {
        id: req.params.id,
        type: 'customer',
      },
    });

    if (!customer) {
      return res.status(404).json(wrapError('Customer not found'));
    }

    return res.status(200).json(wrapSuccess(customer));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get customer'));
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name } = req.body;

    const customer = await Partner.create({
      name,
      userId: req.user.id,
      type: 'customer',
    });

    return res.status(201).json(wrapSuccess(customer));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to create customer'));
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const customer = await Partner.update(
      {
        name,
      },
      {
        where: {
          id,
          type: 'customer',
        },
      }
    );

    if (!customer) {
      return res.status(404).json(wrapError('Customer not found'));
    }

    return res.status(200).json(wrapSuccess(customer));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to update customer'));
  }
};

const destroyCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await Partner.destroy({
      where: {
        id,
        type: 'customer',
      },
    });

    return res.status(200).json(wrapSuccess(null, 'Customer deleted'));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to delete customer'));
  }
};

module.exports = {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  destroyCustomer,
};
