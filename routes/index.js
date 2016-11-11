const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const kue = require('kue');
const jobs = kue.createQueue();
var bcrypt = require('bcrypt');
const docker = require('../utils/dockerAPI');
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");
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

router.post('/user', function(req, res) {
  console.log('posting');
  var username = req.body.username;
  var salty;
  var password;
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    salty = salt;
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      if (err) {
        return console.log('bcrypt hashing error', err);
      }
      console.log('hellohellohellohellohello', hash);
      password = hash;
      var user = User.build({
        username: username,
        password: password,
        salt: salty,
        bio: 'bio'
      }).save().then(function(response) {
        console.log( 'asdfasdfasdfasdfasd', response);
        res.send(response);
      }).catch(function(err) {
        res.send(err);
      });
    });
  });
  // res.send(200)
});

router.get('/user', function(req, res) {
  var username = req.query.username;
  var password = req.query.password;
  console.log(password, username);
    User.findOne({
      where: {
        username: username
      }
    }).then(function(response) {
      bcrypt.compare(password, response.dataValues.password, function(err, results) {
        if (err) {
          return console.log(err);
        }
        if (response) {
          console.log('all god', response);
          res.send(response);
        } else {
          res.send('not found');
        }
      });
      
    }).catch(function(err) {
      console.log(err);
      res.send(err); 
    });
});

router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;



