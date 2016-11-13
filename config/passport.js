// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/User')

// const passport = function(passport) {
//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function(id, done) {
//     User.findOne({
//       where: {
//         username: id
//       } 
//     })
//     .then(function(user) {
//       done(err, user)
//     })
//     .catch(function(err) {

//     });
//   });

//   passport.use('local-signup', new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'passwd',
//     session: false
//   }, function(username, password, done) {
    
//   });
// }