const db = require('../db/config.js');
const User = require('./User');
const Sequelize = require('sequelize');


const Container = db.define(
  'container', {
    ownerID: Sequelize.STRING,
    collaboratorID: Sequelize.STRING
  }, 
  {
    classMethods: {
      associate: function (models) {
        Container.belongsTo(models.User, { foreignKey: 'userId'} );
      }
    }
  }
);

module.exports = Container;