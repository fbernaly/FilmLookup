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
    if(err) {
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
//    const query = client.query('SELECT * FROM public.user;');
//    // Stream results back one row at a time
//    query.on('row', (row) => {
//      results.push(row);
//    });
//    // After all data is returned, close connection and return results
//    query.on('end', () => {
//      done();
//      return res.json(results);
//    });
    
    res.send('Connected');
  });



});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});