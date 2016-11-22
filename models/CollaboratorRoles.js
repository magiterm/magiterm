const db = require('../db/config.js');
const Sequelize = require('sequelize');

const CollaboratorRoles = db.define('collaboratorroles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING
}, {
	timestamps: false
});

module.exports = CollaboratorRoles;

