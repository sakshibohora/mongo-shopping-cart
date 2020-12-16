import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressHbs from 'express-handlebars';

import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import validator from 'express-validator';
const MongoStore = require('connect-mongo')(session);;

import indexRouter from './routes/index';
import userRoutes from './routes/user';
const app = express();

const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

mongoose.connect('mongodb://localhost:27017/shoppingCart', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("log>>>", db.name);
  // we're connected!
});

require('./config/passport');

// view engine setup
// app.engine('.hbs', expressHbs({
//   defaultLayout: 'layout',
//   extname: '.hbs',
//   handlebars: allowInsecurePrototypeAccess(expressHbs)
// }));
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs',handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', '.hbs');
// const hbs = expressHbs.create({
//   defaultLayout: 'layout',
//   extname: '.hbs',
//   handlebars: allowInsecurePrototypeAccess(Handlebars)
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})
app.use('/user', userRoutes);
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
