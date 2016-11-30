'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'containers',
      'ownerId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('containers', 'ownerId');
  }
};