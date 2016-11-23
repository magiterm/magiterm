'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
      'videos',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        videoId: {
          type: Sequelize.STRING
        },
        videoUrl: {
          type: Sequelize.STRING
        },

        videoTitle: {
          type: Sequelize.STRING
        },

        videoDescription: {
          type: Sequelize.STRING
        },

        videoImage: {
          type: Sequelize.STRING
        },

        videoViews: {
          type: Sequelize.STRING
        },

        videoLikes: {
          type: Sequelize.STRING
        },

        videoDislikes: {
          type: Sequelize.STRING
        }
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
