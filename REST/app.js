var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const jwt = require('jsonwebtoken');

var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var buyRouter = require('./routes/buy');
var pushNotificationRouter = require('./routes/push-notifications');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.all('*', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const nonSecurePaths = ['/users/register', '/users/login', '/users/refresh-access-token'];
  if (nonSecurePaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
      return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err) {
        console.log('access token invalid + ' + token);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
  });
});

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/buy', buyRouter);
app.use('/push-notifications', pushNotificationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
