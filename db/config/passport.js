var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");

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
    process.nextTick(function() {
      console.log('posting');
      var username = req.body.username;
      var salty;
      var password;
      User.findOne({username: username }), function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken'));
        } else {
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            salty = salt;
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              if (err) {
                return console.log('bcrypt hashing error', err);
              }
              password = hash;
              var user = User.build({
                username: username,
                password: password,
                salt: salty,
                bio: 'bio'
              }).save().then(function(response) {
                console.log( 'asdfasdfasdfasdfasd', response);
                res.send(response);
              }).catch(function(err) {
                res.send(err);
              });
            });
          });
        }
      };      
    });
  }));
};

  passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));
>>>>>>> working with passport sign in for session:config/passport.js
