  const db = require('../db/config.js');
const Sequelize = require('sequelize');

const Container = db.define('container', {
    ownerID: Sequelize.STRING,
    collaboratorID: Sequelize.STRING
});

module.exports = Container;