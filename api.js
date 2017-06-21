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
    var sql = "SELECT f.id, f.number AS film_number, u.firstName || ' ' || u.lastName AS created_by, l.name AS location, f.created_at AS created_at, f.updated_at AS updated_at FROM public.film f INNER JOIN public.user u on f.created_by = u.id INNER JOIN public.location l on f.located_at = l.id";

    var params = []
    if (req.query.number) {
      params = [req.query.number];
      sql += " WHERE f.number = $1::int";
    }

    sql += " ORDER BY f.number";

    query(sql, params, res);
  });

api.route('/film/:id')
  .get(function (req, res) {
    var sql = "SELECT f.id, f.number AS film_number, u.firstName || ' ' || u.lastName AS created_by, l.name AS location, f.created_at AS created_at, f.updated_at AS updated_at FROM public.film f INNER JOIN public.user u on f.created_by = u.id INNER JOIN public.location l on f.located_at = l.id";

    var params = []
    if (req.params.id) {
      params = [req.params.id];
      sql += " WHERE f.id = $1::int";
    }

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
