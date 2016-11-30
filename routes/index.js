'use strict';
const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
var bcrypt = require('bcrypt');
const docker = require('../utils/dockerAPI');
var db = require('../db/config');
var User = require('../models/User');
var Collaborator = require('../models/Collaborator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var domain = 'picoshell.com';
var api_key = process.env.MAILGUN_SECRET;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
const generator = require('generate-password');
const multer = require('multer');
var upload = multer({dest: './public/files'});
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/computer', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/dashboard', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/video', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/video/:video', function(req, res) {
  res.render('index', {title: 'picoShell'});
});

router.get('/about', function(req, res) {
  res.render('index', {title: 'picoShell'});
});

router.get('/faq', function(req, res) {
  res.render('index', {title: 'picoShell'});
});


router.post('/email', function(req, res) {
  console.log('reqreqreqreqreqrqewrqwrqw', req.body.email);
  var myPassword = generator.generate({
    length: 10,
    numbers: true
  });
  console.log('passwordpasswordpassword', myPassword);
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    const salty = salt;
    bcrypt.hash(myPassword, salty, function(err, hash) {
      if (err) {
        return console.log('Error hashing the password', err);
      } else {
        User.update({
          password: hash,
          salt: salty
        }, {
          where: {
            email: req.body.email
          }
        })
        .then(function(response) {
          console.log('response', response[0]);
          console.log('reponse2222', response[1]);
          var data = {
            from: 'The Pico Team <support@picoshell.com>',
            to: req.body.email,
            subject: 'Resetting you password',
            text: `Hey there! \n We reset your password for you and it is now ${myPassword} . Remember to keep it in a safe place! \n Sincerely, \n The Pico Team`
          };
          mailgun.messages().send(data, function (error, body) {
            if (error) {
              console.log(error);
            }
            console.log('bodybodybodybodybodybody', body);
            res.send(body);
          });
        })
        .catch(function(err) {
          console.log(err);
          res.send(err);
        });
      }
    });
  });
});

router.get('/infodashboard', function(req, res) {
  const username = req.query.username;
  User.findOne({
    where: {
      username: username
    }
  })
  .then(function(response) {
    console.log(response);
    res.send(200, response);
  })
  .catch(function(err) {
    res.send(500, err);
  });
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
  session: true,
}),
  function(req, res) {
    console.log('trying to send statuskjhafdskjhadsfkjlhdaskjldafskjldsafkljadsfkljh', req.user);
    req.session.user = req.user;
    console.log('helloasdfkjadsklfdas');
    res.redirect('/');
  });

router.post('/uploadHandler', upload.single('file'), function(req, res) {
  const containerName = JSON.parse(req.body.opts).containerName;
  const curDir = JSON.parse(req.body.opts).curDir;
  const fileName = JSON.parse(req.body.opts).fileName;
  const filePath = req.file.path;

  docker.copyFile(containerName, filePath, curDir + '/' + fileName, function(res1) {
    if(res1 !== '') {
      res.status(500).send({fail: 'Failed to copy file to container'});
    } else {
      docker.deleteLocalFile(filePath, function(res2) {
        console.log(res2);
        res.status(200).send({msg: res2});
      })
    }
  });
});

module.exports = router;
