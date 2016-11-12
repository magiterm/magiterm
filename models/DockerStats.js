const db = require('../db/config.js');
const Sequelize = require('sequelize');

const DockerStats = db.define('dockerstats', {
  userID: Sequelize.STRING,
  stats: DataTypes.STRING
});

module.exports = DockerStats;