/* eslint-disable no-unused-vars */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'place');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'place', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
