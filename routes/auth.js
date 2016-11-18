const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode')
const secret = "PICOSHELL";
const bcrypt = require('bcrypt');
const User = require('../models/User');
const docker = require('../utils/dockerAPI');
const Container = require('../models/Container');
const passport = require('passport')


router.post('/signup', function(req, res) {
  console.log('signing up: ', req.body);
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const githubHandle = req.body.githubHandle;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    const salty = salt;
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return console.log('Error hashing the password', err);
      }
      passwordHashed = hash;

      User.create({
        username: username,
        password: passwordHashed,
        firstName: firstname,
        lastName: lastname,
        email: email,
        salt: salty,
        bio: 'bio',
        authenticatedWith: 'local',
        githubHandle: githubHandle
      })
      .then(function(userResponse) {
        Container.create({
          ownerID: username
        })
        .then(function(containerResponse) {
          console.log('this is the username');
          docker.startContainer('evenstevens/picoshell', username, '/bin/bash', function(err, dockerResponse) {
            if (err) {
              console.error('Error in creating container with docker');
                        console.log('Error', err);

              res.status(500).send(err);
            } else {
              res.status(201).send('Created a new user and container!');
            }
          })
        })
        .catch(function(err) {
          console.log('Error in container creation in DB');
          res.status(500).send(err);
        })
      })
      .catch(function(err) {
        console.log(err);
        console.log(err.errors[0].type === 'unique violation');
        if (err.errors[0].type === 'unique violation') {
          res.status(200).send('User already exists');
        } else {
          res.status(500).send(err);
        }
      });
    });
  });
});

module.exports = router;  