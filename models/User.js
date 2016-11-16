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
  authenticatedWith: Sequelize.STRING,
  githubHandle: Sequelize.STRING

}, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      updateOrCreate: function(user, cb) {
        if (user.authenticatedWith !== 'local') {
          var findUser = User.findOne({where: {username: user.username}})
          findUser
          .then(function(oldUser) {
            if (oldUser) {
              User.update(user, {
                where: {username: user.usernam}
              })
              .then(function() {
                cb(null, user);
              })
              .catch(function(err) {
                cb(err);
              });
            } else {
              User.create(user)
              .then(function() {
                cb(null, user);
              })
              .catch(function(err) {
                cb(err);
              });
            } 
          }).catch(function(err) {
            cb(err);
          });
        } else {
          cb(null, user);
        }
      }
    }
  });

module.exports = User;