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


router.post('/collaboratingWith', function(req, res) {
  Collaborator.findAll({
    where: {
      recieverUsername: req.body.username,
      confirmed: 'confirmed'
    }
  }).then(function(resp) {
    res.status(200).send(resp);
  });
});

router.post('/myCollaborators', function(req, res) {
  Collaborator.findAll({
    where: {
      requesterUsername: req.body.username,
      confirmed: 'confirmed'
    }
  }).then(function(resp) {
    res.status(200).send(resp);
  });
});

router.post('/acceptInvite', function(req, res) {
  const reciever = req.body.invited;
  const accepter = req.body.accepter;

  Collaborator.update({
    confirmed: 'confirmed'
  }, {
    where: {
      requesterUsername: reciever,
      recieverUsername: accepter
    }
  }).then(function (resp) {
    console.log('ACCEPT RESP', resp);
    res.status(200).send(resp);
  });
});

router.post('/rejectInvite', function(req, res) {

});

router.post('/pendingInvites', function(req, res) {
  Collaborator.findAll({
    where: {
      recieverUsername: req.body.username,
      confirmed: 'unconfirmed'
    }
  }).then(function(resp) {
    res.status(200).send(resp);
  });
});

router.post('/sendInvite', function(req, res) {
  User.findOne({
    where: {
      username: req.body.usernameToInvite
    }
  })
  .then(function(resp) {
    if(!resp) {
      res.status(200).send({fail: 'Username not found!'});
    } else
    {
      const inviter = req.body.username;
      const user = req.body.usernameToInvite;
      Collaborator.find({
        where: {
          requesterUsername: inviter,
          recieverUsername: user
        }
      }).then(function(resp1) {
        if(resp1) {
          res.status(200).send({fail: 'You already sent that user an invite, or they are already collaborating with you!'});
        } else {
          Collaborator.create({
            requesterUsername: inviter,
            recieverUsername: user,
            confirmed: 'unconfirmed'
          }).then(function(resp2) {
            res.status(200).send({success: 'Collaboration invitation sent!'});
          });
        }
      }).catch(function(err1) {
        console.log('ERR', err1);
        res.status(500).send(err1);
      });
    }
  });

  //res.status(200).send('Hello!');
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


router.post('/handleCodeSave', function (req, res) {
  const fileName = req.body.fileName;
  const containerName = req.body.containerName;
  const code = JSON.stringify(req.body.codeValue).replace(/'/g, "\\\"");
  const echo = "'echo -e ";
  const file = " > " + fileName + "'"
  const command = 'bash -c ' + echo + code + file;

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
        if(picoRes[picoRes.length - 1] === '/') picoRes = picoRes.slice(0, picoRes.length - 1);
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
    docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
      if(res1[res1.length - 1] === '\n') res1 = res1.slice(0, res1.length - 1);
      const command = 'cat ' + res1 + '/' + cmd.split(" ")[1];
      docker.runCommand(containerName, command, function(err2, res2) {
        if(err2) {
          res.status(200).send(err2);
        } else {
          res.status(200).send({termResponse: res2, fileOpen: true, fileName: cmd.split(" ")[1], filePath: res1});
        }
      });
    });
  } else {
    docker.runCommand(containerName, 'cat /picoShell/.pico', function(err1, res1) {
      console.log('response from cat /picoShell/.pico :', res1);
      console.log('this is the container name', containerName);

      if (err1) {
        res.status(404).send('Creating .pico');
      } else {
        res1 = res1.replace(/^\s+|\s+$/g, '');

        cmd = '"cd ' + res1 + ' && ' + cmd + '"';
        const command = 'bash -c ' + cmd;
        console.log(command);
        docker.runCommand(containerName, command, function(err2, res2) {
          if (err2) { res.status(200).send(err2); } 
          else { res.status(200).send(res2); }
        });
      }

    }) 
  }
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