var passport = require('passport');
var path = require('path');
var Strategy = require('passport-local')
var db = require('../config');
var User = require('../../models/User');
const bcrypt = require('bcrypt');
var GitHubStrategy = require('passport-github').Strategy;


passport.use(new Strategy({  
  passReqToCallback : true
},
  function(req, username, password, done) {
    console.log('username', username)
    User.findOne({where: { username: username }})
    .then( function(user) {
      console.log('found one', user)
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


passport.use(new GitHubStrategy({
    clientID: 'f864f0df17178ff53b7b',
    clientSecret: 'd37ad17231f09cf864805e8ffa832b56ba59a855',
    callbackURL: 'http://localhost:3000/github/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('back from github', profile._json)
    var nameArray = profile.displayName.split(' ');
    var user = {
      username: profile.username,
      bio: profile._json.bio,
      firstName: nameArray[0],
      lastName: nameArray[nameArray.length - 1],
      email: profile.emails[0].value,
      authenticatedWith: 'github'
    };
    cb(null, true, user);
    // User.updateOrCreate(user, function (err, user) {
    //   if (err) {
    //     cb(err);
    //   }
    //   console.log('updated userrrrrr', user, err);
    //   cb(null, true, user);
    // });
  }
));