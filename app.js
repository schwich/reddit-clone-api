var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// routes
var index = require('./routes/index');
var users = require('./routes/users');
const posts = require('./routes/posts');

const db = require('./db');

// init express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));\

console.log('setting up passport');

// authentication middleware w/ passport
passport.use(new LocalStrategy(function (username, password, done) {
  console.log('authing using local strategy');
  // return done(null, { username: 'hello', password: 'world' });
  db.one('SELECT * FROM users WHERE username = $1', [username])
    .then(function (user) {
      // TODO verify user password via hash
      console.log('heya');
      console.log(user);
      return done(null, user);
    })
    .catch(function (error) {
      console.log('got an error here');
      console.error(error);
      return done(error);
    })
}));
passport.serializeUser(function (user, done) {
  done(null, user.username);
});
passport.deserializeUser(function (id, done) {
  db.one('SELECT * FROM users WHERE username = $1', [id])
    .then(function (user) {
      return done(null, user);
    })
    .catch(function (error) {
      return done(error);
    })
});

// middleware
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'my dirty little secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// for CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// register routes files
app.use('/', index);
app.use('/users', users);

app.use('/posts', posts);

// middleware for errors
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
