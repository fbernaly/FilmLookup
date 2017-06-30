const express = require('express');
const db = require('./db');
const api = express.Router();

var statements = {
  "get_films": "SELECT f.id, f.number AS film_number, u.firstName || ' ' || u.lastName AS created_by, l.name AS location, f.created_at AS created_at, f.updated_at AS updated_at FROM public.film f INNER JOIN public.user u on f.created_by = u.id INNER JOIN public.location l on f.located_at = l.id",
  "get_users": "SELECT u.id, u.firstName || ' ' || u.lastName AS user, u.email AS email, u.mobile, r.name AS role FROM public.user u INNER JOIN public.role r ON r.id = u.role_id",
  "get_locations": "SELECT * FROM public.location",
  "get_roles": "SELECT * FROM public.role",
  "post_user": "INSERT INTO public.user (firstName, lastName, email, mobile, password) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text)",
  "post_film": "INSERT INTO public.film (number, located_at, created_by, updated_by)  VALUES ($1::int, 1, (SELECT id from public.user WHERE email = $2::text), (SELECT id from public.user WHERE email = $2::text))",
  "put_user": "UPDATE public.user SET",
  "delete_film": "DELETE FROM public.film WHERE id = $1::int"
};

function query(sql, params, res, callback) {
  db.query(sql, params, function (err, json) {
    // Handle connection errors
    if (err) {
      return res.status(500).json({
        success: false,
        err: err,
        data: null
      });
    }

    if (callback) {
      callback();
    } else {
      // sucess!!
      return res.status(200).json({
        success: true,
        err: null,
        data: json
      });
    }
  });
}

api.route('/')
  .get(function (req, res) {
    res.render('pages/api');
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
  .post(function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var sql = statements["post_film"];
    var params = []
    if (!req.body.number || !req.body.email) {
      return res.sendStatus(400);
    }
    params = [req.body.number, req.body.email];
    query(sql, params, res, function () {
      sql = statements["get_films"] + " WHERE f.number = $1::int";
      params = [req.body.number];
      query(sql, params, res);
    });
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
  .delete(function (req, res) {
    var sql = statements["delete_film"];
    var params = []
    if (req.params.id) {
      params = [req.params.id];
    }
    query(sql, params, res, function () {
      return res.status(200).json({
        success: true
      });
    });
  });

api.route('/users')
  .get(function (req, res) {
    var sql = statements["get_users"];
    var params = []
    if (req.query.email && req.query.password) {
      sql += " WHERE u.email = $1::text AND u.password = $2::text";
      params = [req.query.email, req.query.password];
    } else {

    }
    sql += " ORDER BY u.firstName, u.lastName, u.email";
    query(sql, params, res);
  })
  .post(function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var sql = statements["post_user"];
    var params = []
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.mobile || !req.body.password) {
      return res.sendStatus(400);
    }
    params = [req.body.firstName, req.body.lastName, req.body.email, req.body.mobile, req.body.password];
    query(sql, params, res, function () {
      sql = statements["get_users"] + " WHERE u.email = $1::text";
      params = [req.body.email];
      query(sql, params, res);
    });
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
  .put(function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var sql = statements["put_user"];
    var params = []

    if (req.body.firstName) {
      params.push(req.body.firstName);
      sql += params.length > 1 ? "," : ""
      sql += " firstName = $" + params.length.toString() + "::text";
    }

    if (req.body.lastName) {
      params.push(req.body.lastName);
      sql += params.length > 1 ? "," : ""
      sql += " lastName = $" + params.length.toString() + "::text";
    }

    if (req.body.email) {
      params.push(req.body.email);
      sql += params.length > 1 ? "," : ""
      sql += " email = $" + params.length.toString() + "::text";
    }

    if (req.body.mobile) {
      params.push(req.body.mobile);
      sql += params.length > 1 ? "," : ""
      sql += " mobile = $" + params.length.toString() + "::text";
    }

    if (req.body.password) {
      params.push(req.body.password);
      sql += params.length > 1 ? "," : ""
      sql += " password = $" + params.length.toString() + "::text";
    }

    if (req.body.role_id) {
      params.push(req.body.role_id);
      sql += params.length > 1 ? "," : ""
      sql += " role_id = $" + params.length.toString() + "::int";
    }

    params.push(req.params.id);
    sql += " WHERE id = $" + params.length.toString() + "::int";

    query(sql, params, res, function () {
      sql = statements["get_users"] + " WHERE u.id = $1::int";
      params = [req.params.id];
      query(sql, params, res);
    });
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
