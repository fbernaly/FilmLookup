const express = require('express');
var router = express.Router();
const passport = require('passport');

router.route('/')
  .get(function (req, res) {
    res.render('pages/index');
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

router.route('/error')
  .get(function (req, res) {
    res.send(req.flash('message'));
  });

module.exports = router;
