'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('collaboratorroles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      }
    }).then(function() {
      console.log('seeding default roles...');
      queryInterface.bulkInsert('collaboratorroles', 
        [
          { name: 'read' },
          { name: 'write' },
          { name: 'admin' }
        ])
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('collaboratorroles');
  }
};
