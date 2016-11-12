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
              console.log( 'realrepsonserealrepsonserealrepsonserealrepsonse  ');
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
<<<<<<< cb4535ed795ed383acccf85ddce347e9e38e2ab8:db/config/passport.js
};
>>>>>>> signin with passport:config/passport.js
=======


    // passport.use('local-login', new LocalStrategy({
    //     // by default, local strategy uses username and password, we will override with email
    //     usernameField : 'email',
    //     passwordField : 'password',
    //     passReqToCallback : true // allows us to pass back the entire request to the callback
    // },
    // function(req, email, password, done) { // callback with email and password from our form
    //     // find a user whose email is the same as the forms email
    //     // we are checking to see if the user trying to login already exists
    //     User.findOne({ 'local.email' :  email }, function(err, user) {
    //         // if there are any errors, return the error before anything else
    //         if (err)
    //             return done(err);

    //         // if no user is found, return the message
    //         if (!user)
    //             return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    //         // if the user is found but the password is wrong
    //         if (!user.validPassword(password))
    //             return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    //         // all is well, return successful user
    //         return done(null, user);
    //     });
    // }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    function(req, username, password, done) {
      console.log('got to login!!')
      var username = req.query.username;
      var password = req.query.password;
      console.log(password, username);
        User.findOne({
          where: {
            username: username
          }
        }).then(function(err, response) {
          if (err) {
            console.log('faling a login');
            return done(err);
          } else if(!response) {
            return done(null, false, { message: 'No User Found.' });        
          } else {
            bcrypt.compare(password, response.dataValues.password, function(err, results) {
              if (err) {
                console.log('err comparing passwords');
                return done(err);
              }
              if (!response) {
                console.log('passwords dont match');
                return done(null, null)
              } else {
                res.send('not found');
                return done(null, results, response)
              }
            });
          } 
        }).catch(function(err) {
          console.log(err);
          res.send(err); 
        });
    }));

};


>>>>>>> trying to login correclty:config/passport.js
