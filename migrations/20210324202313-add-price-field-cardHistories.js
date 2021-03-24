/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('cardHistories', 'price', {
      type: Sequelize.DOUBLE(null, 2),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('cardHistories', 'price');
  },
};
