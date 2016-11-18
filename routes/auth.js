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
var LocalStrategy = require('passport-local').Strategy;


router.get('/decode', function(req, res) {
  const decoded = jwtDecode(req.query.token);
  res.send(200, decoded);
});

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
              res.status(201).send({username: username, password: password});
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

function generateToken(req, res, next) {
  var info = req.user;
    console.log('here at generate', info)
  var tokenUser = info.username.slice(info.username.length - 1);
  var tokenMail = info.email.slice(info.email.indexOf('@'));
  var tokenBio = info.bio.slice(6);
    console.log('generating a token');
  req.token = jwt.sign({ 
    id: (tokenUser + tokenMail + tokenBio),
    username: info.username
  }, 'server secret', {
    expiresIn: 7200
  });
  next();
}

function serialize(req, res, next) {
  console.log('serializing userrrrrdffasdfasdfasdfasdfasdfasdfasdfasdr', res.req.authInfo)
  var user = res.req.authInfo;
  User.updateOrCreate(user, function(err, user) {
    if (err) {
      next(err);
    }
    req.user = user;
    next();
  });
}

router.post('/authenticate', 
  passport.authenticate('local', {
    session: false
  }), serialize, generateToken,
  function(req, res) {
    console.log('trying to send status', req.user, req.token);
    res.status(200).json({
      user: req.user,
      token: req.token
    });
  }
);

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
  session: false,
}), serialize, generateToken,
  function(req, res) {
    console.log('trying to send status', req.user, req.token);
    res.redirect('/dashboard').json({
      user: req.user,
      token: req.token
    });
  });

module.exports = router;  