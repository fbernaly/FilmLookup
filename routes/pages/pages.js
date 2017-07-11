const express = require('express');
var router = express.Router();
const passport = require('passport');
const isAuthenticated = require('../../authentication/middleware');

router.route('/')
  .get(function (req, res) {
    res.render('pages/index', {
      user: req.session.user
    });
  });

router.route('/users')
  .get(isAuthenticated, function (req, res) {
    res.send('Hello to users');
  });

router.route('/account')
  .get(isAuthenticated, function (req, res) {
    res.send('Hello to account');
  });

router.route('/login')
  .get(function (req, res) {
    res.render('pages/login');
  })
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/error',
    failureFlash: true
  }));

router.route('/signup')
  .get(function (req, res) {
    res.render('pages/signup');
  })
  .post(passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/error',
    failureFlash: true
  }));

router.route('/logout')
  .get(function (req, res) {
    req.logout();
    req.session.reset();
    res.redirect('/');
  })

router.route('/error')
  .get(function (req, res) {
    res.send(req.flash('message'));
  });

module.exports = router;
