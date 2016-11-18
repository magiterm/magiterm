var express = require('express');
var router = express.Router();

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
});


module.exports = router;
  