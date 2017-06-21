const pg = require('pg');

module.exports.connect = function (callback) {
  var client = new pg.Client(process.env.DATABASE_URL);

  client.connect(function (err) {
    if (err) {
      console.log("Error connecting to DB: ")
      console.log(err);
      callback(err, client);
      return;
    }

    callback(null, client);
  });
};
