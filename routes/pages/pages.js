const express = require('express');
const bodyParser = require('body-parser');

var router = express.Router();

// parse application/json 
var jsonParser = bodyParser.json();

router.route('/')
  .get(function (req, res) {
    res.render('pages/index');
  });

router.route('/login')
  .get(function (req, res) {
    res.send('Hola mundo!!!');
  });

module.exports = router;
