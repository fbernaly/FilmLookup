const express = require('express');
const app = express();
const api = require('./routes/api/api');
const pages = require('./routes/pages/pages');

// set port
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// public directory
app.use(express.static(__dirname + '/public'));

// routers
app.use('/api', api);
app.use('/', pages);

// start server
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
