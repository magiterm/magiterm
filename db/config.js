const Sequelize = require('sequelize');

const LOCAL_DB_URL = 'mysql://root:root@127.0.0.1:3306/demo_schema';

const db = new Sequelize('demo_schema', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',

const db = new Sequelize(process.env.JAWSDB_URL || LOCAL_DB_URL, {
  pool: {
    max: 5,
    min: 0,
    idle:1000
  }
});

db.authenticate()
  .then(function(err) {
    console.log('Connected to mysql database');
  })
  .catch(function(err) {
    console.log('Could not connect to the mysql database', err);
  });


module.exports = db;

