const express = require('express');
const router = express.Router();
const db = require('../db/db');
const User = require('../models/User');
const exec = require('child_process').exec;
const kue = require('kue');
const jobs = kue.createQueue();
const docker = require('../utils/dockerAPI');


router.get('/', function(req, res, next) {
  res.render('index');
});


module.exports = router;
