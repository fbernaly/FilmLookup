const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

function query(sql, params, res) {
  db.query(sql, params, function (err, json) {
    // Handle connection errors
    if (err) {
      return res.status(500).json({
        success: false,
        data: err
      });
    }

    // sucess!!
    return res.status(200).json(json);
  });
}

var api = express.Router();

// parse application/json 
var jsonParser = bodyParser.json();

var statements = {
  "get_films": "SELECT f.id, f.number AS film_number, u.firstName || ' ' || u.lastName AS created_by, l.name AS location, f.created_at AS created_at, f.updated_at AS updated_at FROM public.film f INNER JOIN public.user u on f.created_by = u.id INNER JOIN public.location l on f.located_at = l.id",
  "get_users": "SELECT u.id, u.firstName || ' ' || u.lastName AS user, u.email AS email, u.mobile, r.name AS role FROM public.user u INNER JOIN public.role r ON r.id = u.role_id",
  "get_locations": "SELECT * FROM public.location",
  "get_roles": "SELECT * FROM public.role",
  "post_user": "",
  "post_film": "",
  "put_user": "",
  "delete_film": ""
};

api.route('/')
  .get(function (req, res) {
    res.send('Welcome to API for Film Lookup Service');
  });

api.route('/login')
  .post(function (req, res) {
    if (!req.body) return res.sendStatus(400);
    res.send(req.body);
  });

api.route('/films')
  .get(function (req, res) {
    var sql = statements["get_films"];
    var params = []
    if (req.query.number) {
      params = [req.query.number];
      sql += " WHERE f.number = $1::int";
    }
    sql += " ORDER BY f.number";
    query(sql, params, res);
  })
  .post(jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    res.send(req.body);
  });

api.route('/films/:id')
  .get(function (req, res) {
    var sql = statements["get_films"];
    var params = []
    if (req.params.id) {
      params = [req.params.id];
      sql += " WHERE f.id = $1::int";
    }
    query(sql, params, res);
  })
  .delete(function (req, res) {});

api.route('/users')
  .get(function (req, res) {
    var sql = statements["get_users"] + " ORDER BY u.firstName, u.lastName, u.email";
    var params = []
    query(sql, params, res);
  })
  .post(jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    res.send(req.body);
  });

api.route('/users/:id')
  .get(function (req, res) {
    var sql = statements["get_users"];
    var params = []
    if (req.params.id) {
      params = [req.params.id];
      sql += " WHERE u.id = $1::int";
    }
    query(sql, params, res);
  })
  .put(jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    res.send(req.body);
  });

api.route('/locations')
  .get(function (req, res) {
    var sql = statements["get_locations"];
    var params = []
    query(sql, params, res);
  });

api.route('/roles')
  .get(function (req, res) {
    var sql = statements["get_roles"];
    var params = []
    query(sql, params, res);
  });

module.exports = api;
