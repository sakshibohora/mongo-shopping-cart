import passport from 'passport';
import { body, validationResult } from 'express-validator';

import User from '../models/user';
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
})

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  req.checkBody('email', 'Invalid Email!').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password!').notEmpty().isLength({ min: 4 });

  const errors = req.validationErrors();
  if (errors) {
    const messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });

    return done(null, false, req.flash('error', messages))
  }


  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      return done(null, false, { 'message': 'Email is already registered!' })
    }
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.save((err, user) => {
      if (err) {
        console.log("err=>>", err)
        return done(err);
      }
      return done(null, newUser);
    })
  })
}))

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  req.checkBody('email', 'Invalid Email!').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password!').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
console.log("password===>>", password)
    const messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });

    return done(null, false, req.flash('error', messages))
  }

  User.findOne({ 'email': email }, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, { 'message': 'No user found!' })
    }
    if (!user.validPassword(password)) {
      return done(null, false, { 'message': 'Wrong password' })
    }
    return done(null, user);
  })
}));