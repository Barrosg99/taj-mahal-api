const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class CardHistory extends Sequelize.Model { }

const attributes = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  finality: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  place: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  purchase: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE(null, 2),
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
};

const options = {
  sequelize,
  timestamps: true,
  modelName: 'cardHistory',
};

CardHistory.init(attributes, options);

module.exports = CardHistory;
