require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
var LocalStrategy = require('passport-local'), Strategy;
const favicon = require('serve-favicon');
const logger = require('morgan');
const db = require('./db/config');
const Passport = require('./db/config/passport');
const routes = require('./routes/index');
const users = require('./routes/users');
const auth = require('./routes/auth');
const test = require('./routes/test');
const docker = require('./routes/docker');
const videos = require('./routes/videos');
const messages = require('./routes/messages');
require('dotenv').config({path: __dirname + '/.env'});
const app = express();

var SALT_WORK_FACTOR = 12;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(session({ 
  secret: 'keyboard cat', 
  cookie: { maxAge: 86400000 }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/docker', docker);
app.use('/messages', messages);
app.use('/videos', videos);
app.use('/test', test);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;