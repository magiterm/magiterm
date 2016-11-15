const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode')
const secret = "PICOSHELL";
const bcrypt = require('bcrypt');
const User = require('../models/User');






router.get('/', function(req, res, next) {
  console.log('try');
  res.send(200);
});

router.get('/decode', function(req, res) {
  console.log('trying to access decode');
  const decoded = jwtDecode(req.query.token);
  res.send(200, decoded)
});

router.post('/signup', function(req, res) {
  console.log('signing up: ', req.body.username);
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    const salty = salt;
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return console.log('Error hashing the password', err);
      }
      passwordHashed = hash;
      const user = User.create({
        username: username,
        password: passwordHashed,
        salt: salty,
        bio: 'bio'
      })
      .then(function(response) {
        res.send(201, response);
      })
      .catch(function(err) {
        console.log(err.errors[0].type === 'unique violation')
        if (err.errors[0].type === 'unique violation') {
          res.status(200).send('User already exists');
        } else {
          res.status(500).send(err);
        }
      });
    });
  });
});

router.post('/authenticate', function(req, res) {
  const username = req.body.params.username;
  const password = req.body.params.password;
  User.findOne({
    where: {
      username: username
    }
  })
  .then(function(response) {
    if (response) {
      bcrypt.compare(password, response.dataValues.password, function(err, results) {
        if (err) {
          return console.log(err);
        } else {
          if (results === true) {
            const userid = response.dataValues.id;
            const claim = {
              id: userid,
              username: response.dataValues.username 
            };
            const token = jwt.sign(claim, secret);
            const body = {
              token: jwt.sign(claim, secret)
            }
            res.send(200, body);
          } else {
            res.send(200, results);
          }
        }
      });
    } else {
      res.send(200, 'User not found');
    }
  }).catch(function(err) {
    res.send(404, err); 
  });
});

module.exports = router;  