const db = require('../db/config.js');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const User = db.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  salt: Sequelize.STRING,
  bio: Sequelize.TEXT,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  authenticatedWith: Sequelize.STRING
}, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      updateOrCreate: function(user, cb) {
        if (user.authenticatedWith !== 'local') {
          User.findOne({where: {username: username}})
          .then(function(err, oldUser) {
            if (err) {
              console.log('err', err);
            } else if (!oldUser) {
              User.create({user});
            } else {
              User.findOne({where: {username: username}}).update({user});
            }
          }).then(function() {
            cb(null, user);
          });
        } else {
          cb(null, user);
        }
      }
    }
  });

module.exports = User;