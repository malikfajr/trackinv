const { wrapSuccess, wrapError } = require('../helper/formater');
const { Partner } = require('../model');

const getAllSuplier = async (req, res) => {
  try {
    const supliers = await Partner.findAll({
      where: {
        type: 'supplier',
        userId: req.user.id,
      },
    });

    return res.status(200).json(wrapSuccess(supliers));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get supliers'));
  }
};

const getSuplier = async (req, res) => {
  try {
    const suplier = await Partner.findOne({
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json(wrapSuccess(suplier));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to get suplier'));
  }
};

const createSuplier = async (req, res) => {
  try {
    const { name } = req.body;

    const suplier = await Partner.create({
      name,
      userId: req.user.id,
      type: 'supplier',
    });

    return res.status(201).json(wrapSuccess(suplier));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to create suplier'));
  }
};

const updateSuplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const suplier = await Partner.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json(wrapSuccess(suplier));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to update suplier'));
  }
};

const destroySuplier = async (req, res) => {
  try {
    const { id } = req.params;

    const suplier = await Partner.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json(wrapSuccess(suplier));
  } catch (error) {
    return res.status(500).json(wrapError('Failed to delete suplier'));
  }
};

module.exports = {
  getAllSuplier, getSuplier, createSuplier, updateSuplier, destroySuplier
};
