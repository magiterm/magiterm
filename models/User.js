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
  githubHandle: Sequelize.STRING,
  profilePicture: Sequelize.STRING
}, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      updateOrCreate: function(user, cb) {
        if (user.authenticatedWith !== 'local') {
          // console.log('gethubbbbbbbbbing1', user.username);
          var findUser = User.findOne({where: {username: user.username}})
          findUser
          .then(function(oldUser) {
            // console.log('gethubbbbbbbbbing2');
            if (oldUser) {
              // console.log('gethubbbbbbbbbing3');
              User.update(user, {
                where: {username: user.username}
              })
              .then(function() {
                cb(null, user);
              })
              .catch(function(err) {
                // console.log('gethubbbbbbbbbing5', err);
                cb(err);
              });
            } else {
              // console.log('no old user no old user');
              User.create(user)
              .then(function() {
                cb(null, user);
              })
              .catch(function(err) {
                // console.log('gethubbbbbbbbbing4', err);
                cb(err);
              });
            } 
          }).catch(function(err) {
            // console.log('gethubbbbbbbbbing6', err);  
            cb(err);
          });
        } else {
          cb(null, user);
        }
      }
    }
  });

module.exports = User;