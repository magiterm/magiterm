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
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/decode', function(req, res) {
  console.log('trying to access decode');
  const decoded = jwtDecode(req.query.token);
  res.send(200, decoded)
});


router.post('/handleCodeSave', function (req, res) {
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
  } else if(cmd.split(" ")[0] === 'open') {
    docker.runCommand(containerName, 'cat ' + cmd.split(" ")[1], function(err1, res1) {
      console.log('err1', err1);
      console.log('res1', res1);
      if(err1) {
        res.status(200).send(err1);
      } else {
        res.status(200).send({termResponse: res1, fileOpen: true});
      }
    });
  } else {
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



router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;