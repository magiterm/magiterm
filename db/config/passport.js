var passport = require('passport');
var path = require('path');
var Strategy = require('passport-local')
var db = require('../config');
var User = require('../../models/User');
const bcrypt = require('bcrypt');


passport.use(new Strategy({  
  passReqToCallback : true
},
  function(req, username, password, done) {
    User.findOne({where: { username: username }})
    .then( function(user) {
      if (!user) {
        return done(null, false, { message: 'No User Found.' });        
      } else {
        bcrypt.compare(password, user.dataValues.password, function(err, isMatch) {
          if (err) {
            console.log('bycrupt match error');
              done(err);
          } 
          if (isMatch) {
            console.log('bycrypt match good');
              done(null, isMatch, user);
          } else {
            console.log('bycrtup match bad', isMatch);
              done(null, false, { message: 'No User Found.' });
          }
        });
      }
    }).catch(function(err) {
      done(err, null, null);
    });
  }
));

// passport.use('local-login', new LocalStrategy({
//   passReqToCallback: true
// },
//   function(req, username, password, done) {
//     console.log('trtingfsgsdfgsd s');
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));