const db = require('../db/config.js');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const docker = require('../utils/dockerAPI');
const Container = require('./Container');

const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
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
      },
      updateOrCreate: function(newUser, cb) {
        if (newUser.authenticatedWith !== 'local') {
          // console.log('gethubbbbbbbbbing1', newUser.username);
          var findUser = User.findOne({where: {username: newUser.username}})
          .then(function(oldUser) {
            // console.log('gethubbbbbbbbbing2');
            if (oldUser) {
              User.update(newUser, {
                where: {username: newUser.username}
              })
              .then(function() {
                cb(null, newUser);
              })
              .catch(function(err) {
                // console.log('gethubbbbbbbbbing5', err);
                cb(err);
              });
            } else {
              // console.log('no old user no old user no old user')
              User.create(newUser)
              .then(function(userResponse) {
                // console.log('containercontainercontainercontainercontainercontainercontainer', Container)
                Container.create({
                  ownerID: newUser.username
                })
                .then(function(containerResponse) {
                  docker.startContainer('evenstevens/picoshell', newUser.username, '/bin/bash', function(err, dockerResponse) {
                    if (err) {
                      console.error('Error in creating container with docker', err);
                      // console.log('Error', err);
                      cb(err);
                    } else {
                      cb(null, newUser);
                    }
                  });  
                });                    
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
          cb(null, newUser);
        }
      }
    }
  });

module.exports = User;