// const should = require("should");
// import { expect } from 'chai';
// import Sequelize from 'sequelize';
// import User from '../../models/User.js';
// const express = require('express');
// const router = express.Router();
// const port = process.env.PORT || 3000;
// const host = `http://localhost:${port}`;
// const request = require('request');

// describe('Local Signup/Login test', function () {
//   const requestWithSession = request.defaults({jar: true});
//   before(function(done) { 
//     User.find({username: 'user'})
//     .then(function(user) {
//       const options = {
//         method: 'POST',
//         uri: `${host}/auth/signup`,
//         json: {
//           username: 'user',
//           password: 'pass11'
//         }
//       };
//       if (user) {
//         console.log('found user, destring then creatings');
//         user.destroy().then(function() {
//           request(options, function() {
//             done();
//           });
//         });
//       } else {
//         console.log('creating user, no user found');
//         request(options, function() {
//           done();
//         });
//       }
//     })
//     .catch(function(err) {
//       console.error(err);
//       done();
//     });
//   });

//   console.log('running');
//   it('should create a session', function (done) {
//     console.log('creating a sessions test test test');
//     const options = {
//       method: 'POST',
//       uri: `${host}/auth/authenticate`,
//       json: {
//         username: 'user',
//         password: 'pass11'
//       }
//     };
//     request(options, function(err, res, body) {
//       console.log('ererererererererere', err);
//       console.log('resresresresresresresresres', res, body);
//       expect(body.username).to.equal('user');
//       done();
//     });
//   });

//   after(function(done) {
//       User.destroy({where: { username: 'user'}}).then(function() {
//         done();
//       });
//     });
// })