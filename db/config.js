const Sequelize = require('sequelize');

const db = new Sequelize('picodb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle:1000
  }
});

db
  .authenticate()
  .then(function(err) {
    console.log('Connected to mysql database');
  })
  .catch(function(err) {
    console.log('Could not connect to the mysql database', err);
  });


module.exports = db;

