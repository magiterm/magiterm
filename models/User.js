const db = require('../db/config.js');
const Sequelize = require('sequelize');
var passportLocal = require('passport-local');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
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
};

