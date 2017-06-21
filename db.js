const pg = require('pg');
pg.defaults.ssl = true;

function connect(callback) {
  var client = new pg.Client('postgres://liyqjeeffmaeiv:9288285b584ef0ad5f7f28b212135ef8b8f81c7904581d8848a8cfb7aaa0a204@ec2-54-163-246-154.compute-1.amazonaws.com:5432/d2aeqibl0bq7k0');

  client.connect(function (err) {
    if (err) {
      return callback(err, client);
    }

    return callback(null, client);
  });
}

function query (sql, params, callback) {
  connect(function (err, client) {
    // Handle connection errors
    if (err) {
      return callback(err, null);
    }

    var query = client.query(sql, params, function (err, result) {
      // we are now done getting the data from the DB, disconnect the client
      client.end(function (err) {
        if (err) throw err;
      });

      if (err) {
        return callback(err, null);
      }

      return callback(null, result.rows);
    });

  });
}

module.exports.connect = function (callback) {
  return connect(callback);
};

module.exports.query = function (sql, params, callback) {
  return query (sql, params, callback);
};
