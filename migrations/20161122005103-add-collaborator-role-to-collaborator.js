'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'collaborators', 
      'role', 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'collaboratorroles',
          key: 'id'
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('collaborators', 'role');
  }
};
