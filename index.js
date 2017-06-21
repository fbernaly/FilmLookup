const express = require('express');
const formidable = require('express-formidable');
const pg = require('pg');
const app = express();

const db = require('./db');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(formidable());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
  response.render('pages/index');
});

app.get('/films', function (req, res) {

  //ask for a client from the pool
  db.connect(function (err, client) {
    // Handle connection errors
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        data: err
      });
    }
    client.query('SELECT * FROM public.film', function (err, result) {
      if (err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('pages/db', {
          results: result.rows
        });
      }
    });
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
