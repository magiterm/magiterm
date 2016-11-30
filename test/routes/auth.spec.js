const should = require("should");
import { expect } from 'chai';
import Sequelize from 'sequelize';
import User from '../../models/User.js';
const express = require('express');
const router = express.Router();
const port = process.env.PORT || 3000;
const host = `http://localhost:${port}`;
const request = require('supertest');
const util = require('../utils/auth');

describe('Local Signup/Login test', function () {
  before(function(done) {   
    util.clearUser(done);
  });
  console.log('running');
  it('should sign up a user ', function (done) {
    console.log('signing signing signing signing signing signing');
    util.localSignup(function(result) {
      expect(result.body.username).to.equal('user');
      expect(result.body.password).to.equal('pass11');
      done();
    });
  });

  it('should authenticate a valid user', function(done) {
    util.authenticate(function(result) {
      expect(result.body.username).to.equal('user');
      expect(result.body.password).to.equal(undefined);
      done();
    });
  });

  it('should have sessions', function(done) {
    util.testSession(function(result) {
      console.log(result);
      expect(result.originalMaxAge).to.equal(86400000);
      done();
    });
  });

  xit('should kill the session upon signout', function(done) {
    util.signOut(function(results) {
      expect(results.user.username).to.equal(undefined);
      done();
    });
  });

  after(function(done) {
    User.destroy({where: { username: 'user'}}).then(function() {
      done();
    });
  });
});