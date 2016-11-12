var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");
var bcrypt = require('bcrypt');

SALT_WORK_FACTOR = 12;


module.exports = function(passport) {


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

<<<<<<< 7d10d4b7db493dbe9560ce8b2e23425d3447fb0e:db/config/passport.js
passport.deserializeUser(function(user, done) {
  User.find({where: {id: user.id}}).then(function(user){
    done(null, user);
  }).catch(function(err) {
    done(err, null);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  db.User.find({where: {username: username}}).then(function(user){
    passwd = user ? user.password : '';
    isMatch = User.validPassword(password, passwd, done, user)
  });
}));
=======
// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  function(req, username, password, done) {
    console.log( 'username', username, 'password', password, 'done function', done);
    var username = req.body.username;
    var salty;
    var password;
    console.log('just about to find one');
    User.findOne({ 
      where: {
        username: username 
      }
    }).then(function(err, user) {
      if (err) {
        console.log('faling a signup')
        return done(err)
      }
      if (user) {
        return done(null, false, { message: 'Incorrect password.' });        
      } else {
        console.log('executing a signup')
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err1, salt) {
          if (err1) {
            return console.log(err1);
          }
          salty = salt;
          bcrypt.hash(req.body.password, salt, function(err2, hash) {
            if (err2) {
              return console.log('bcrypt hashing error', err);
            }
            password = hash;
            var user = User.build({
              username: username,
              password: password,
              salt: salty,
              bio: 'bio'
            }).save().then(function(response) {
              console.log( 'realrepsonserealrepsonserealrepsonserealrepsonse');
              return done(null, user, response);
            }).catch(function(err) {
              return console.log('complettion err22', err);
            });
          });
        });
<<<<<<< 5c76f95435387b2a546c90813ca294ee1f178783:db/config/passport.js

    }));
>>>>>>> working with passport sign in for session:config/passport.js
=======
      }
    });     
  }));
};
>>>>>>> signin with passport:config/passport.js
