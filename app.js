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

import indexRouter from './routes/index';
import userRoutes from './routes/user';
const app = express();
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

mongoose.connect('mongodb://localhost:27017/shoppingCart', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("log>>>", db.name);
  // we're connected!
});

require('./config/passport');
// const Schema = mongoose.Schema;

// const schema = new Schema({
//     imagePath: {type: String, required:true},
//     title: {type: String, required:true},
//     description: {type: String, required:true},
//     price: {type: Number, required:true},
// })

// const Product = mongoose.model('Products',schema);
// const products = 
// new Product({
//   imagePath: "https://images-na.ssl-images-amazon.com/images/I/6y2CKL.jpg",
//   title: "Robin sharma book",
//   description: "Awesome book!",
//   price: 20
// })

// try {
//   console.log("hiiii");
//       products.save()
//         .then(doc => {
//           console.log("doc>>",doc)
//         })
//         .catch(err => {
//           console.error("err>>>",err)
//         })
//     } catch (error) {
//       console.log(" error", error)

//     }

// view engine setup
// app.engine('.hbs', expressHbs({
//   defaultLayout: 'layout',
//   extname: '.hbs',
//   handlebars: allowInsecurePrototypeAccess(expressHbs)
// }));
app.set('view engine', '.hbs');
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({ secret: 'mysecretkey', resave: false, saveUninitialized: false }))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated();
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
