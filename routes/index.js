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
  const code = JSON.stringify(req.body.codeValue).replace("'", "'\\''");
  const echo = "'echo -e ";
  const file = " > juice.js'";
  const command = 'bash -c ' + echo + code + file;
  console.log(command);
  docker.runCommand('juice', command, function(err, response) {
    if (err) {
      res.send(200, err);
    } else {
      res.send(200, response);
    }
  });
});

router.post('/cmd', function (req, res) {
  var cmd = req.body.cmd;

  if(cmd.split(" ")[0] === 'cd') {
    const newdir = cmd.split(" ")[1];
    console.log('change dir to: ', newdir);

    const command = 'bash -c "echo ' + newdir + ' > .pico' + '"'; 
    console.log(command);
    docker.runCommand('test1', command, function(err, res1) {
      if (err) {
        res.send(200, err);
      } else {
        res.send(200, res1);
      }
    })
  }
  else {
    docker.runCommand('test1', 'cat /.pico', function(err1, res1) {

      console.log('response from cat /.pico :', res1);
      res1 = res1.replace(/^\s+|\s+$/g, '');

      cmd = '"cd ' + res1 + ' && ' + cmd + '"';
      const command = 'bash -c ' + cmd;
      console.log(command);
      docker.runCommand('test1', command, function(err2, res2) {
        if (err2) {
          res.send(200, err2);
        } else {
          res.send(200, res2);
        }
      });
    });    
  }
});

router.post('/signup', function(req, res) {
  passport.authenticate('local-signup', {
    successRedirect : res.redirect('/linuxcomputer'), // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  });
});




router.post('/login', function(req, res) {
  console.log('trying to authenticate');
  passport.authenticate('local-login', {
    successRedirect: '/linuxcomputer',
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  });
});
// router.get('/user', function(req, res) {
//   var username = req.query.username;
//   var password = req.query.password;
//   console.log(password, username);
//     User.findOne({
//       where: {
//         username: username
//       }
//     }).then(function(response) {
//       bcrypt.compare(password, response.dataValues.password, function(err, results) {
//         if (err) {
//           return console.log(err);
//         }
//         if (response) {
//           console.log('all god', response);
//           res.send(response);
//         } else {
//           res.send('not found');
//         }
//       });
      
//     }).catch(function(err) {
//       console.log(err);
//       res.send(err); 
//     });
// });

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;



