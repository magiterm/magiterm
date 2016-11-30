import { expect } from 'chai';
import Sequelize from 'sequelize';
import User from '../../models/User.js';
const express = require('express');
const router = express.Router();
const port = process.env.PORT || 3000;
const host = `http://localhost:${port}`;
const app = require('../../app.js');
const request = require('supertest')(app);
var session = require('supertest-session');

const options = {
  username: 'user',
  password: 'pass11'
};

module.exports = {
  clearUser: function(callback) {
    console.log('clearingclearingclearing');
    User.find({username: 'user'})
    .then(function(user) {
      if (user) {
        console.log('found user, destring then creatings');
        user.destroy()
        .then(function() {
          callback();
        });
      } else {
        callback();
      }
    })
    .catch(function(err) {
      console.error('we have a find errorrrrr', err);
    });
  },

  localSignup: function (callback) {
    request
    .post('/auth/signup')
    .send(options)
    .end(function(err, result) {
      if (err) {
        console.log('error', err);
        return;
      }
      callback(result);
    });
  },

  authenticate: function(callback) {
    request
    .post('/auth/authenticate')
    .send(options)
    .end(function(err, result) {
      if (err) {
        console.log('error', err);
        return;
      }
      callback(result);
    });
  }, 

  testSession: function(callback) {
    session(app, {
      before: function (req) {
        callback(req.session);
      }
    });
  },

  signOut: function(callback) {
    request
    .get('/logout')
    .end(function(err, results) {
      testSession(callback)
    });
  }
};

