const express = require('express');
const router = express.Router();
const exec = require('child_process').exec;
const kue = require('kue');
const jobs = kue.createQueue();
const docker = require('../utils/dockerAPI');
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Magiterm' });
});


router.post('/user', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var user = User.build({
    username: username,
    password: password,
    salt: 'salt',
    bio: 'bio'
  });

  user.save().then(function(response) {
    console.log('workingfasdfsdfasdfdfsdafsd');
    res.send('complete add');
  }).catch(function(err) {
    res.send('error', err);
  });
  // res.send(200)
});

router.get('/user', function(req, res) {
  var username = req.param('username');
  var password = req.param('password');
  User.findOne({
    where: {
      username: username,
      password: password
    }
  }).then(function(response) {
    console.log(response);
    res.send(response);
  }).catch(function(err) {
    console.log(err);
    res.send(err);
  })
  // res.send(200)
});

module.exports = router;
