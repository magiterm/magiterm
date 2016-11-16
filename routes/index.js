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
const jwtDecode = require('jwt-decode')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'picoShell' });
});

router.get('/decode', function(req, res) {
  const decoded = jwtDecode(req.query.token);
  res.send(200, decoded);
});


router.post('/handleCodeSave', function (req, res) {
  console.log(req.body);
  const fileName = req.body.fileName;
  const containerName = req.body.containerName;
  const code = JSON.stringify(req.body.codeValue).replace(/'/g, "\\\"");
  const echo = "'echo -e ";
  const file = " > " + fileName + "'"
  const command = 'bash -c ' + echo + code + file;
  console.log(command);
  docker.runCommand(containerName, command, function(err, response) {
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
    let newdir = cmd.split(" ")[1];
    console.log('change dir to: ', newdir);
    let readyToExecute = true;
    if(newdir === '..') {
      readyToExecute = false;
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err, picoRes) {
        if(picoRes[picoRes.length - 1] === '\n') picoRes = picoRes.slice(0, picoRes.length - 1);
        newdir = picoRes;
        if(newdir.indexOf('/') !== newdir.lastIndexOf('/')) {
          newdir = newdir.slice(0, newdir.lastIndexOf('/'));
        } else {
          newdir = '/';
        }

        const command = 'bash -c "echo ' + newdir + ' > /picoShell/.pico' + '"'; 
        docker.runCommand(containerName, command, function(err, res1) {
          if (err) { res.status(200).send(err); } 
          else { 
            res.status(200).send({res: res1, pwd: newdir}); 
          }
        });
      });
    } else if (newdir[0] !== '/') {
      //append newdir to current dir
      readyToExecute = false;
      docker.runCommand(containerName, 'cat /picoShell/.pico', function(err, picoRes) {
        if(picoRes[picoRes.length - 1] === '\n') picoRes = picoRes.slice(0, picoRes.length - 1);
        const dir = picoRes + '/' + newdir;
        docker.directoryExists(containerName, dir, function(dirRes) {
          if(dirRes.indexOf('Directory exists') !== -1) {
            const command = 'bash -c "echo ' + dir + ' > /picoShell/.pico' + '"'; 
            //const command = 'bash -c "cd ' + newdir + '"';
            console.log(command);
            docker.runCommand(containerName, command, function(err, res1) {
              if (err) { res.status(200).send(err); } 
              else { 
                res.status(200).send({res: res1, pwd: dir}); 
              }
            });
          } else {
            res.status(200).send('Error: Directory not found\n');
          }
        });
      });
    }
    if(readyToExecute) {
      const command = 'bash -c "echo ' + newdir + ' > /picoShell/.pico' + '"'; 
      console.log(command);
      docker.directoryExists(containerName, newdir, function(dirRes) {
        if(dirRes.indexOf('Directory exists') !== -1) {
          docker.runCommand(containerName, command, function(err, res1) {
            if (err) { res.status(200).send(err); } 
            else { 
              docker.runCommand(containerName, 'cat /picoShell/.pico', function(err2, res2) {
                res.status(200).send({res: res1, pwd: res2}); 
              });
            }
          });
        } else {
          res.status(200).send('Error: Directory not found\n');
        }
      });
    }
  } else if(cmd.split(" ")[0] === 'open') {
    docker.runCommand(containerName, 'cat ' + cmd.split(" ")[1], function(err1, res1) {
      if(err1) {
        res.status(200).send(err1);
      } else {
        res.status(200).send({termResponse: res1, fileOpen: true, fileName: cmd.split(" ")[1]});
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


// User.updateOrCreate = function(user, cb) {
//   if (user.authenticatedWith !== 'local') {
//     User.findOne({where: {username: username}})
//     .then(function(err, oldUser) {
//       if (err) {
//         console.log('err', err);
//       } else if (!oldUser) {
//         User.create({user});
//       } else {
//         User.findOne({where: {username: username}}).update({user});
//       }
//     }).then(function() {
//       cb(null, user);
//     });
//   } else {
//     cb(null, user);
//   }
// };

function generateToken(req, res, next) {
  req.token = jwt.sign({
    id: req.user.id,
    username: req.user.username
  }, 'server secret', {
    expiresIn: 7200
  });
  next();
}

function serialize(req, res, next) {
  var user = req.authInfo.dataValues;
  User.updateOrCreate(user, function(err, user) {
    if (err) {
      return next(err);
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


router.get('*', function(req, res, next) {
  res.render('index', { title: 'picoShell' });
});

module.exports = router;