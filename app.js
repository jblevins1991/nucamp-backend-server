var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var passport = require('passport')
var cors = require('cors')

var authenticate = require('./authenticate')
var oauth = require('./oauth')

var authenticationRouter = require('./routes/authentication')
var jobsRouter = require('./routes/jobs')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

// initialize passport middleware
app.use(passport.initialize())

// initialize the mongodb connection
mongoose.connect('mongodb://localhost:27017/local', { useNewUrlParser: true })

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next()
  } else {
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
  }
})

app.use('/auth', authenticationRouter)
// register the authRouter to be accessible at the `/auth` path.
app.use('/auth', authenticationRouter)

// register the jobsRouter to be accessible at the `/jobs` path.
app.use('/jobs', jobsRouter)

/**
 * This is a catch-all route handler.
 * 
 * If a request does not match a route on a router, it will be caught here and 
 * a 404 will be sent back to the client.
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * This catches errors and sends them back as responses.
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
