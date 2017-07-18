const express = require('express');
var router = express.Router();
const passport = require('passport');
const isAuthenticated = require('../../authentication/middleware');
const db = require('../api/db');


router.route('/')
  .get(function (req, res) {
    res.render('pages/index', {
      user: req.session.user
    });
  });

router.route('/users')
  .get(isAuthenticated, function (req, res) {
    if (req.session.user.role != 'admin') {
      res.sendStatus(401);
      return;
    }

    var sql = "SELECT u.id as id, u.firstName, u.lastName, u.email, u.mobile, r.name as role, u.password FROM public.user u INNER JOIN public.role r ON r.id = u.role_id ORDER BY u.firstName, u.lastName, u.email";
    var params = []
    db.query(sql, params, function (err, json) {
      // Handle connection errors
      if (err) {
        return res.status(500).json({
          success: false,
          error: err,
          data: null
        });
      }

      return res.render('pages/users', {
        user: req.session.user,
        users: JSON.parse(JSON.stringify(json))
      });
    });
  });

router.route('/account')
  .get(isAuthenticated, function (req, res) {
    res.render('pages/account', {
      user: req.session.user
    });
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
