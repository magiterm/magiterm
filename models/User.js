<<<<<<< 7d10d4b7db493dbe9560ce8b2e23425d3447fb0e
const db = require('../db/config.js');
const Sequelize = require('sequelize');

const User = db.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  bio: Sequelize.TEXT
  }, 
  {
=======
'use strict';
var passportLocal = require('passport-local');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
>>>>>>> working with passport sign in for session
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      validPassword: function(password, passwd, done, user) {
        bcrypt.compare(password, passwd, function(err, isMatch) {
          if (err) {
            return done(err, null);
          } 
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    }
  });

module.exports = User;