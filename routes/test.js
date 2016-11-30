const express = require('express');
const router = express.Router();

router.get('/return', function(req, res) {
  if (req.body.username === 'user' && req.body.password === 'pass11') {
    if (req.session) {
      res.send(req.session);
    } else {
      res.send('');
    }
  }
});


module.exports = router;