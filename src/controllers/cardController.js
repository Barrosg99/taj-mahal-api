/* eslint-disable no-return-assign */
const CardHistory = require('../models/CardHistory');
const usersController = require('./usersController');

class CardController {
  async createHistory(history, id) {
    history.forEach((h) => h.userId = id);
    const histories = await CardHistory.bulkCreate(history);
    await usersController.userReturnCard(id);
    return histories;
  }
}

module.exports = new CardController();
