/* eslint-disable no-return-assign */
const { Op } = require('sequelize');
const moment = require('moment');
const CardHistory = require('../models/CardHistory');
const User = require('../models/User');
const usersController = require('./usersController');

class CardController {
  async createHistory(history, id) {
    history.forEach((h) => h.userId = id);
    const histories = await CardHistory.bulkCreate(history);
    await usersController.userReturnCard(id);
    return histories;
  }

  async getHistory({ days }) {
    const where = days
      ? { createdAt: { [Op.gte]: moment().subtract(days, 'days').toDate() } }
      : {};
    return CardHistory.findAll({
      where,
      attributes: ['finality', 'purchase', 'place', 'price', 'createdAt', 'id'],
      include: {
        model: User,
        attributes: ['nickname'],
      },
    });
  }
}

module.exports = new CardController();
