const express = require('express');
const db = require('./db');

function query(sql, params, res) {
  db.query(sql, params, function (err, json) {
    // Handle connection errors
    if (err) {
      res.status(500).json({
        success: false,
        data: err
      });
    } else

      // sucess!!
      res.status(200).json(json);
  });
}

var api = express.Router();

api.route('/')
  .get(function (req, res) {
    res.send('Welcome to API for Film Lookup Service');
  })

api.route('/film')
  .get(function (req, res) {
    var sql = "SELECT * FROM public.film ORDER BY number";
    var params = []
    query(sql, params, res);
  });

api.route('/user')
  .get(function (req, res) {
    var sql = "SELECT * FROM public.user";
    var params = []
    query(sql, params, res);
  });

api.route('/location')
  .get(function (req, res) {
    var sql = "SELECT * FROM public.location";
    var params = []
    query(sql, params, res);
  });

api.route('/role')
  .get(function (req, res) {
    var sql = "SELECT * FROM public.role";
    var params = []
    query(sql, params, res);
  });

module.exports = api;
