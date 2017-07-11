const express = require('express');
const app = express();
const api = require('./routes/api/api');
const pages = require('./routes/pages/pages');
const bodyParser = require('body-parser');
const session = require('client-sessions');
const passport = require('passport');
const flash = require('connect-flash');

// set port
app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set session
app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
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
