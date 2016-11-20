'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('collaborators', { 
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
    return queryInterface.dropTable('collaborators');
  }
};
  