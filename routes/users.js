const express = require('express');
const router = express.Router();
const User = require('../models/User');
var Collaborator = require('../models/Collaborator');
var CollaboratorRoles = require('../models/CollaboratorRoles');

router.post('/removeCollaborator', function(req, res) {
  Collaborator.destroy({
    where: {
      requesterUsername: req.body.remover,
      recieverUsername: req.body.collaborator,
      confirmed: 'confirmed'
    }
  }).then(function(resp) {
    res.status(200).send('REMOVED');
  }).catch(function(resp) {
    res.status(200).send('FAILED');
  })
});

router.post('/removeCollabWith', function(req, res) {
  Collaborator.destroy({
    where: {
      recieverUsername: req.body.remover,
      requesterUsername: req.body.collaborator,
      confirmed: 'confirmed'
    }
  }).then(function(resp) {
    res.status(200).send('REMOVED');
  }).catch(function(resp) {
    res.status(200).send('FAILED');
  });
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
    confirmed: 'confirmed',
    role: 1
  }, {
    where: {
      requesterUsername: reciever,
      recieverUsername: accepter
    }
  }).then(function (resp) {
    res.status(200).send('ACCEPTED');
  });
});

router.post('/rejectInvite', function(req, res) {
  const rejected = req.body.invited;
  const rejecter = req.body.rejecter;
  console.log('INREJECT');
  Collaborator.destroy({
    where: {
      requesterUsername: rejected,
      recieverUsername: rejecter,
      confirmed: 'unconfirmed'
    }
  }).then(function(resp) {
    res.status(200).send('REJECTED');
  }).catch(function(resp) {
    console.log('REJECT_RESP', resp);
  });
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
    if (!resp) {
      res.status(200).send({fail: 'Username not found!'});
    } else {
      const inviter = req.body.username;
      const user = req.body.usernameToInvite;
      Collaborator.find({
        where: {
          requesterUsername: inviter,
          recieverUsername: user
        }
      }).then(function(resp1) {
        if (resp1) {
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
});

router.post('/updateUser', function(req, res) {
  const user = req.body;
  User.findOne({
    where: {
      username: user.username
    }
  })
  .then(function(user) {
    console.log('found a user user usr found a user user usr');
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

router.get('/infodashboard', function(req, res) {
  const username = req.query.username;
  User.findOne({
    where: {
      username: username
    }
  })
  .then(function(response) {
    // console.log(response);
    res.send(200, response);
  })
  .catch(function(err) {
    res.send(500, err);
  });
});

router.get('/roles', function(req, res) {
  CollaboratorRoles.findAll()
  .then(function(response) {
    res.send(200, response);
  })
})

router.post('/changeRole', function(req, res) {
  // console.log('changeRole', req.body);
  CollaboratorRoles.findOne({
    where: {
      name: req.body.newRole
    }
  })
  .then(function(response) {
    // console.log(response);
    // console.log(response.dataValues);
    Collaborator.update({
      role: response.dataValues.id
    }, {
      where: {
        requesterUsername: req.body.host,
        recieverUsername: req.body.collaborator,
        confirmed: 'confirmed'
      }
    })
    .then(function(response) {
      res.status(200).send(response);
    });
    
  })

});

module.exports = router;
  