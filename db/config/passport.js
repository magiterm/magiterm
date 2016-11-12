var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models/index');
var User = db.sequelize.import(__dirname + "/../models/User");

passport.serializeUser(function(user, done) {
  done(null, user);
});

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
