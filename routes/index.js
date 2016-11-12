const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const kue = require('kue');
const jobs = kue.createQueue();
var bcrypt = require('bcrypt');
const docker = require('../utils/dockerAPI');
var db = require('../db/config');
var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.post('/handleCodeSave', function (req, res) {
  // const code = JSON.stringify(req.body.codeValue);
  // console.log(req.body.codeValue);
  // console.log(JSON.stringify(req.body.codeValue));
  // console.log(JSON.stringify(req.body.codeValue).replace(/'/g, "\\\""));

  const code = JSON.stringify(req.body.codeValue).replace(/'/g, "\\\"");
  const echo = "'echo -e ";
  const file = " > juice.js'";
  const command = 'bash -c ' + echo + code + file;
  console.log(command);
  docker.runCommand('juice', command, function(err, response) {
    if (err) {
      res.status(200).send(err);
    } else {
      res.status(200).send(response);
    }
  });
});

router.post('/cmd', function (req, res) {
  var cmd = req.body.cmd;
  var containerName = req.body.containerName;

  if(cmd.split(" ")[0] === 'cd') {
    const newdir = cmd.split(" ")[1];
    console.log('change dir to: ', newdir);

    const command = 'bash -c "echo ' + newdir + ' > /picoShell/.pico' + '"'; 
    console.log(command);
    docker.runCommand(containerName, command, function(err, res1) {
      if (err) { res.status(200).send(err); } 
      else { res.status(200).send(res1); }
    })
  }
  else {
    docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {

      console.log('response from cat /picoShell/.pico :', res1);

      res1 = res1.replace(/^\s+|\s+$/g, '');

      cmd = '"cd ' + res1 + ' && ' + cmd + '"';
      const command = 'bash -c ' + cmd;
      console.log(command);
      docker.runCommand(containerName, command, function(err2, res2) {
        if (err2) { res.status(200).send(err2); } 
        else { res.status(200).send(res2); }
      });
    }) 
  }
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
      const user = User.build({
        username: username,
        password: passwordHashed,
        salt: salty,
        bio: 'bio'
      })
      .save()
      .then(function(response) {
        res.send(201, response);
      })
      .catch(function(err) {
        res.send(err);
      });
    });
  });
});

router.get('/login', function(req, res) {
  const username = req.query.username;
  const password = req.query.password;
  console.log(password, username);
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
            res.send(200, results);
          }
        });
      } else {
        res.send(200, 'User not found');
      }
    }).catch(function(err) {
      res.send(404, err); 
    });
});

router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;