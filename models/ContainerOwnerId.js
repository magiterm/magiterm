const db = require('../db/config.js');
const Sequelize = require('sequelize');

const ContainerOwnerId = db.define('containerownerid', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING
}, {
  timestamps: false
});

module.exports = ContainerOwnerId;

