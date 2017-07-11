const express = require('express');
const app = express();
const api = require('./routes/api/api');
const pages = require('./routes/pages/pages');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

// set port
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// flash is a special area of the session used for storing messages
app.use(flash());

// public directory
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// routers
app.use('/api', api);
app.use('/', pages);

// set authentication
require('./authentication').init(app);

// start server
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
