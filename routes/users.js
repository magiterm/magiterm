var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/user', function(req, res, next) {
  res.send('accepted request', req.body.username, req.body.password);
});

module.exports = router;
