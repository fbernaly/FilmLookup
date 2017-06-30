const express = require('express');
var router = express.Router();

router.route('/')
  .get(function (req, res) {
    res.render('pages/index');
  });

router.route('/login')
  .get(function (req, res) {
    res.render('pages/login');
  });

router.route('/signup')
  .get(function (req, res) {
    res.render('pages/signup');
  });

module.exports = router;
