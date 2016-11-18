'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Collaborators', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recieverUsername: {
        type: Sequelize.STRING
      },
      requesterUsername: {
        type: Sequelize.STRING
      },
      confirmed: {
        type: Sequelize.STRING
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Collaborators');
  }
};
  