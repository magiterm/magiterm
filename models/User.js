const db = require('../db/config.js');
const Sequelize = require('sequelize');

const User = db.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  bio: Sequelize.TEXT
  }, 
  {
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