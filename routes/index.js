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


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/linuxcomputer', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/dashboard', function(req, res) {
  res.render('index', { title: 'picoShell' });
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
  .catch(function(err){
    res.send(500, err);
  })
})

router.get('/decode', function(req, res) {
  const decoded = jwtDecode(req.query.token);
  res.send(200, decoded);
});




router.post('/authenticate', 
  passport.authenticate('local', {
    session: true
  }),
  function(req, res) {
    console.log('trying to send status', req.user);
    req.session.user = req.user;
    res.send(req.user.dataValues);
  }
);
router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    res.redirect('/')
  });
});


router.get('/oAuth', function(req, res) {
  console.log('useruser useruser useruser useruser useruser', req.user, 'sess sess sess sess sess sess sess sess', req.session.user)
  res.json(req.session.user);
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', {
  session: true,
}),
  function(req, res) {
    console.log('trying to send statuskjhafdskjhadsfkjlhdaskjldafskjldsafkljadsfkljh', req.user);
    req.session.user = req.user;
    console.log('helloasdfkjadsklfdas')
    res.redirect('/');
  });

router.post('/updateUser', function(req, res) {
  const user = req.body;
  User.findOne({
    where: {
      username: user.username
    }
  })
  .then(function(user) {
    console.log('found a user user usr found a user user usr')
    console.log(req.body, 'bodddydydydydydydydydyd')
    user.update(req.body.toUpdate)
    .then(function() {
      res.status(200).send('Successfully updated user');
    })
    .catch(function(err) {
      res.status(500).send('Wasn\'t able to save to database');
    });
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
});

module.exports = router;