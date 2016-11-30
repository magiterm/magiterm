const db = require('../db/config.js');
const Sequelize = require('sequelize');


const Container = db.define('container', {
    ownerId: Sequelize.INTEGER,
    collaboratorID: Sequelize.STRING
  }, 
  {
    classMethods: {
      associate: function (models) {
      }
    }
  }
);

module.exports = Container;