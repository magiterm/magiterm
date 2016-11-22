const db = require('../db/config.js');
const Sequelize = require('sequelize');

const Collaborator = db.define('collaborator', {
  recieverUsername: Sequelize.STRING,
  requesterUsername: Sequelize.STRING,
  confirmed: Sequelize.STRING,
  role: Sequelize.INTEGER
}, {
	timestamps: false
});

module.exports = Collaborator;

