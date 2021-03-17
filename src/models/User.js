const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

class User extends Sequelize.Model { }

const attributes = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ra: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  place: {
    type: Sequelize.STRING,
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
  modelName: 'user',
};

User.init(attributes, options);

module.exports = User;
