var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { verifyToken } = require('../helpers/Authentication');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
console.log('MongoDB connected...', process.env.MONGODB_CONN)
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

var indexRouter = require('../routes/index');
var userRouter = require('../routes/user');
var authRouter = require('../routes/auth');
var productsRouter = require('../routes/products');
var productsSecureRouter = require('../routes/productsSecure');
var purchasesRouter = require('../routes/purchases');
var basketRouter = require('../routes/basket');
var pushNotificationsRouter = require('../routes/pushNotifications');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const securePaths = ['/api/products/secure', '/api/user', '/api/auth/verify', '/api/purchases', '/api/push-notifications', '/api/basket'];

function isPathSecure(req) {
  // if any of paths return true, some returns true
  return securePaths.some(path => req.path.startsWith(path));
}

app.all('*', async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!isPathSecure(req)) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  try {
    if (!authHeader) {
      return res.sendStatus(401);
    }

    const decodedToken = await verifyToken(authHeader);

    if (decodedToken) {
      req.userId = decodedToken.id;
      return next();
    } else {
      return res.sendStatus(401);
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.sendStatus(500);
  }
});

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/products/secure', productsSecureRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/basket', basketRouter);
app.use('/api/push-notifications', pushNotificationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
